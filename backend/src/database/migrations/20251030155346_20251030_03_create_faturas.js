exports.up = function (knex) {
  return knex.schema.createTable('faturas', (table) => {
    table.increments('id').primary(); 
    table.string('descricao').notNullable(); 
        
    table.decimal('valor', 14, 2).notNullable(); 
    
    table.date('data_vencimento').notNullable(); 
    table.boolean('removido').defaultTo(false); 

    table
      .integer('cliente_id')
      .notNullable()
      .references('id')
      .inTable('clientes')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT'); 

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('faturas');
};