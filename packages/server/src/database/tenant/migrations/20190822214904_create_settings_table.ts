
exports.up = async function (knex) {
  await knex.schema.createTable('settings', (table) => {
    table.increments();
    table.integer('user_id').unsigned().index();
    table.string('group').index();
    table.string('type');
    table.string('key').index();
    table.string('value');
  });

  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  if (isPostgres) {
    await knex.raw('ALTER SEQUENCE "settings_id_seq" RESTART WITH 2000');
  } else {
    await knex.raw('ALTER TABLE settings AUTO_INCREMENT = 2000');
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('settings');
