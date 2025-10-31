exports.up = function (knex) {
  return knex.schema.table('faturas', (table) => {
    // Adiciona a coluna 'data_pagamento'.
    // Pode ser nula (se não estiver paga)
    table.date('data_pagamento').nullable().defaultTo(null);
  });
};

exports.down = function (knex) {
  return knex.schema.table('faturas', (table) => {
    // Remove a coluna se precisarmos reverter
    table.dropColumn('data_pagamento');
  });
};