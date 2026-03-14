exports.up = function (knex) {
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  const refTypeCol = isPostgres ? 'reference_type' : 'referenceType';
  const transTypeCol = isPostgres ? 'transaction_type' : 'transactionType';

  return knex('accounts_transactions')
    .whereIn(refTypeCol, [
      'OtherIncome',
      'OtherExpense',
      'OwnerDrawing',
      'OwnerContribution',
      'TransferToAccount',
      'TransferFromAccount',
    ])
    .update({
      [transTypeCol]: knex.raw(`
        CASE 
          WHEN REFERENCE_TYPE = 'OtherIncome' THEN 'OtherIncome'
          WHEN REFERENCE_TYPE = 'OtherExpense' THEN 'OtherExpense'
          WHEN REFERENCE_TYPE = 'OwnerDrawing' THEN 'OwnerDrawing'
          WHEN REFERENCE_TYPE = 'OwnerContribution' THEN 'OwnerContribution'
          WHEN REFERENCE_TYPE = 'TransferToAccount' THEN 'TransferToAccount'
          WHEN REFERENCE_TYPE = 'TransferFromAccount' THEN 'TransferFromAccount'
        END
      `),
      [refTypeCol]: knex.raw(`
        CASE 
          WHEN REFERENCE_TYPE IN ('OtherIncome', 'OtherExpense', 'OwnerDrawing', 'OwnerContribution', 'TransferToAccount', 'TransferFromAccount') THEN 'CashflowTransaction'
          ELSE REFERENCE_TYPE
        END
      `),
    });
};

exports.down = function (knex) {
  const isPostgres = knex.client.config.client === 'pg' || knex.client.config.client === 'postgresql';
  const refTypeCol = isPostgres ? 'reference_type' : 'referenceType';
  const transTypeCol = isPostgres ? 'transaction_type' : 'transactionType';

  return knex('accounts_transactions')
    .whereIn(transTypeCol, [
      'OtherIncome',
      'OtherExpense',
      'OwnerDrawing',
      'OwnerContribution',
      'TransferToAccount',
      'TransferFromAccount',
    ])
    .update({
      [refTypeCol]: knex.raw(`
      CASE 
        WHEN TRANSACTION_TYPE = 'OtherIncome' THEN 'OtherIncome'
        WHEN TRANSACTION_TYPE = 'OtherExpense' THEN 'OtherExpense'
        WHEN TRANSACTION_TYPE = 'OwnerDrawing' THEN 'OwnerDrawing'
        WHEN TRANSACTION_TYPE = 'OwnerContribution' THEN 'OwnerContribution'
        WHEN TRANSACTION_TYPE = 'TransferToAccount' THEN 'TransferToAccount'
        WHEN TRANSACTION_TYPE = 'TransferFromAccount' THEN 'TransferFromAccount'
        ELSE REFERENCE_TYPE
      END
    `),
      [transTypeCol]: knex.raw(`
      CASE 
        WHEN TRANSACTION_TYPE IN ('OtherIncome', 'OtherExpense', 'OwnerDrawing', 'OwnerContribution', 'TransferToAccount', 'TransferFromAccount') THEN NULL
        ELSE TRANSACTION_TYPE
      END
    `),
    });
};
