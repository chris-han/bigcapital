
exports.up = async function(knex) {
  await knex.schema.createTable('currencies', table => {
    table.increments();
    table.string('currency_name').index();
    table.string('currency_code', 4).index();
    table.string('currency_sign').index();
    table.timestamps();
  });
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "currencies_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE currencies AUTO_INCREMENT = 1000');
  }
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('currencies');
};
