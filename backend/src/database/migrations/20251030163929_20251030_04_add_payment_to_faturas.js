exports.up = function (knex) {
  return knex.schema.table('faturas', (table) => {
    table.date('data_pagamento').nullable().defaultTo(null);
  });
};

exports.down = function (knex) {
  return knex.schema.table('faturas', (table) => {
    table.dropColumn('data_pagamento');
  });
};