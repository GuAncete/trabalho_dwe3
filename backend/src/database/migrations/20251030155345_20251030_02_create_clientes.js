// src/database/migrations/...._02_create_clientes.js

exports.up = function (knex) {
  return knex.schema.createTable('clientes', (table) => {
    table.increments('id').primary(); // Campo ID
    table.string('nome').notNullable(); // Campo texto
    table.string('documento').unique(); // Ex: CPF/CNPJ
    table.boolean('removido').defaultTo(false); // Campo Removido
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  // O 'down' deve ser o oposto do 'up'
  return knex.schema.dropTable('clientes');
};