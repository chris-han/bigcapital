
exports.up = async function (knex) {
  await knex.schema.createTable('view_has_columns', (table) => {
    table.increments();
    table.integer('view_id').unsigned().index().references('id').inTable('views');
    table.string('field_key');
    table.integer('index').unsigned();
  });
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "items_categories_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE items_categories AUTO_INCREMENT = 1000');
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_has_columns');
