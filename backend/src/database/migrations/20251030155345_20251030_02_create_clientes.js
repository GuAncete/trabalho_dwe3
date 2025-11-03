// src/database/migrations/...._02_create_clientes.js

exports.up = function (knex) {
  return knex.schema.createTable('clientes', (table) => {
    table.increments('id').primary(); 
    table.string('nome').notNullable(); 
    table.string('documento').unique(); 
    table.boolean('removido').defaultTo(false); 
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('clientes');
};