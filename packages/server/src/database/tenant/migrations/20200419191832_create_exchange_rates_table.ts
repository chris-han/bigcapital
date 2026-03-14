
exports.up = async function(knex) {
  await knex.schema.createTable('exchange_rates', table => {
    table.increments();
    table.string('currency_code', 4).index();
    table.decimal('exchange_rate');
    table.date('date').index();
    table.timestamps();
  });

  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "exchange_rates_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE exchange_rates AUTO_INCREMENT = 1000');
  }
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('exchange_rates');
};
