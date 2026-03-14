exports.up = async function (knex) {
  await knex.schema
    .createTable('view_roles', (table) => {
      table.increments();
      table.integer('index');
      table.string('field_key').index();
      table.string('comparator');
      table.string('value');
      table
        .integer('view_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('views');
    });

  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "view_roles_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE view_roles AUTO_INCREMENT = 1000');
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_roles');
