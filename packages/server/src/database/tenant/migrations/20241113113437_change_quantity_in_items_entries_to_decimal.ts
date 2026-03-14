/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  const qtyOnHandCol = isPostgres ? 'quantity_on_hand' : 'quantityOnHand';

  return knex.schema
    .table('items_entries', (table) => {
      table.decimal('quantity', 13, 3).alter();
    })
    .table('inventory_transactions', (table) => {
      table.decimal('quantity', 13, 3).alter();
    })
    .table('inventory_cost_lot_tracker', (table) => {
      table.decimal('quantity', 13, 3).alter();
    })
    .table('items', (table) => {
      table.decimal(qtyOnHandCol, 13, 3).alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  const qtyOnHandCol = isPostgres ? 'quantity_on_hand' : 'quantityOnHand';

  return knex.schema
    .table('items_entries', (table) => {
      table.integer('quantity').alter();
    })
    .table('inventory_transactions', (table) => {
      table.integer('quantity').alter();
    })
    .table('inventory_cost_lot_tracker', (table) => {
      table.integer('quantity').alter();
    })
    .table('items', (table) => {
      table.integer(qtyOnHandCol).alter();
    });
};
