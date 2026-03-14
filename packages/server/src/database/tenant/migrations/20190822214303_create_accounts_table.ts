exports.up = async function (knex) {
  await knex.schema.createTable('accounts', (table) => {
    table.increments('id').comment('Auto-generated id');
    table.string('name').index();
    table.string('slug');
    table.string('account_type').index();
    table.integer('parent_account_id').unsigned().references('id').inTable('accounts');
    table.string('code', 10).index();
    table.text('description');
    table.boolean('active').defaultTo(true).index();
    table.integer('index').unsigned();
    table.boolean('predefined').defaultTo(false).index();
    table.decimal('amount', 15, 5);
    table.string('currency_code', 3).index();
    table.timestamps();
  });
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "accounts_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE accounts AUTO_INCREMENT = 1000');
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('accounts');
