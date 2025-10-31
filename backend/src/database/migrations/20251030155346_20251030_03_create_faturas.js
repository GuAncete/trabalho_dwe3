exports.up = function (knex) {
  return knex.schema.createTable('faturas', (table) => {
    table.increments('id').primary(); // Campo ID
    table.string('descricao').notNullable(); // Campo texto
    
    // Campo decimal (Ex: 1500.50)
    // precision = 14 (total de dígitos), scale = 2 (dígitos após a vírgula)
    table.decimal('valor', 14, 2).notNullable(); 
    
    table.date('data_vencimento').notNullable(); // Campo data
    table.boolean('removido').defaultTo(false); // Campo Removido

    // Chave Estrangeira (Relacionamento 1:N com Clientes)
    table
      .integer('cliente_id')
      .notNullable()
      .references('id')
      .inTable('clientes')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT'); // Não deixa deletar cliente se tiver fatura

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('faturas');
};