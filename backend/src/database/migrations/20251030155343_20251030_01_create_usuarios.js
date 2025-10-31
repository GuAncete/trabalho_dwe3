exports.up = function (knex) {
  return knex.schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable(); // Campo texto
    table.string('email').notNullable().unique();
    table.string('senha_hash').notNullable();
    table.boolean('removido').defaultTo(false); // Campo Removido
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usuarios');
};