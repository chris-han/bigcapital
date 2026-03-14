/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  const templateNameCol = isPostgres ? 'template_name' : 'templateName';

  return knex('pdf_templates').insert([
    {
      resource: 'SaleInvoice',
      [templateNameCol]: 'Standard Template',
      predefined: true,
      default: true,
    },
    {
      resource: 'SaleEstimate',
      [templateNameCol]: 'Standard Template',
      predefined: true,
      default: true,
    },
    {
      resource: 'SaleReceipt',
      [templateNameCol]: 'Standard Template',
      predefined: true,
      default: true,
    },
    {
      resource: 'CreditNote',
      [templateNameCol]: 'Standard Template',
      predefined: true,
      default: true,
    },
    {
      resource: 'PaymentReceive',
      [templateNameCol]: 'Standard Template',
      predefined: true,
      default: true,
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
