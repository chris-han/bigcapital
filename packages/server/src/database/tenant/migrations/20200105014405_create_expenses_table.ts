exports.up = async function (knex) {
  await knex.schema
    .createTable('expenses_transactions', (table) => {
      table.increments();
      table.string('currency_code', 3);
      table.text('description');
      table
        .integer('payment_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.integer('payee_id').unsigned().references('id').inTable('contacts');
      table.string('reference_no');

      table.decimal('total_amount', 13, 3);
      table.decimal('landed_cost_amount', 13, 3).defaultTo(0);
      table.decimal('allocated_cost_amount', 13, 3).defaultTo(0);

      table.date('published_at').index();
      table.integer('user_id').unsigned().index();
      table.date('payment_date').index();
      table.timestamps();
    });

  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "expenses_transactions_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE expenses_transactions AUTO_INCREMENT = 1000');
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('expenses_transactions');
};
