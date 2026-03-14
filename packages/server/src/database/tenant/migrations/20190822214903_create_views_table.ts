
exports.up = async function (knex) {
  await knex.schema.createTable('views', (table) => {
    table.increments();
    table.string('name').index();
    table.string('slug').index();
    table.boolean('predefined');
    table.string('resource_model').index();
    table.boolean('favourite');
    table.string('roles_logic_expression');
    table.timestamps();
  });

  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "views_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE views AUTO_INCREMENT = 1000');
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('views');
