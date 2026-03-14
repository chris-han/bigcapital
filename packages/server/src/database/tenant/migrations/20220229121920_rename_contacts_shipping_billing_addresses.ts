exports.up = async (knex) => {
  await knex.schema.table('contacts', (table) => {
    table.renameColumn('billing_address_1', 'billing_address1');
    table.renameColumn('billing_address_2', 'billing_address2');
    table.renameColumn('shipping_address_1', 'shipping_address1');
    table.renameColumn('shipping_address_2', 'shipping_address2');
  });
};

exports.down = async (knex) => {
  await knex.schema.table('contacts', (table) => {
    table.renameColumn('billing_address1', 'billing_address_1');
    table.renameColumn('billing_address2', 'billing_address_2');
    table.renameColumn('shipping_address1', 'shipping_address_1');
    table.renameColumn('shipping_address2', 'shipping_address_2');
  });
};
