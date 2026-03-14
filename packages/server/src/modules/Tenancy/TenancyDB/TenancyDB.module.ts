import knex from 'knex';
import * as LRUCache from 'lru-cache';
import { Global, Module } from '@nestjs/common';
import { knexSnakeCaseMappers } from 'objection';
import { ClsModule, ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import { TENANCY_DB_CONNECTION } from './TenancyDB.constants';
import { UnitOfWork } from './UnitOfWork.service';

const lruCache = new LRUCache();

export const TenancyDatabaseProxyProvider = ClsModule.forFeatureAsync({
  provide: TENANCY_DB_CONNECTION,
  global: true,
  strict: true,
  inject: [ConfigService, ClsService],
  useFactory: async (configService: ConfigService, cls: ClsService) => () => {
    const organizationId = cls.get('organizationId');
    const dbNamePrefix = configService.get('tenantDatabase.dbNamePrefix') || 'bigcapital_tenant_';
    const database = `${dbNamePrefix}${organizationId}`;
    const cachedInstance = lruCache.get(database);

    if (cachedInstance) {
      return cachedInstance;
    }

    const pgUrl = configService.get('systemDatabase.postgresUrl');
    const connection = pgUrl
      ? pgUrl.replace(/\/([^\/?]+)(\?.*)?$/, `/${database}$2`)
      : {
        host: configService.get('tenantDatabase.host'),
        user: configService.get('tenantDatabase.user'),
        password: configService.get('tenantDatabase.password'),
        database,
        charset: 'utf8',
      };

    const knexInstance = knex({
      client: configService.get('tenantDatabase.client'),
      connection,
      migrations: {
        directory: configService.get('tenantDatabase.migrationsDir'),
        loadExtensions: ['.js'],
      },
      seeds: {
        directory: configService.get('tenantDatabase.seedsDir'),
      },
      pool: { min: 0, max: 7 },
      ...knexSnakeCaseMappers({ upperCase: false }),
    });
    lruCache.set(database, knexInstance);

    return knexInstance;
  },
  type: 'function',
});

@Global()
@Module({
  imports: [TenancyDatabaseProxyProvider],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class TenancyDatabaseModule {}
