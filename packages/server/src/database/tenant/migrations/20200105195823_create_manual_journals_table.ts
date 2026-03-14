
exports.up = async function(knex) {
  await knex.schema.createTable('manual_journals', (table) => {
    table.increments();
    table.string('journal_number').index();
    table.string('reference').index();
    table.string('journal_type').index();
    table.decimal('amount', 13, 3);
    table.string('currency_code', 3);
    table.date('date').index();
    table.string('description');
    table.date('published_at').index();
    table.string('attachment_file');
    table.integer('user_id').unsigned().index();
    table.timestamps();
  });

  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "manual_journals_id_seq" RESTART WITH 1000');
  } else {
    await knex.raw('ALTER TABLE manual_journals AUTO_INCREMENT = 1000');
  }
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('manual_journals');
};
