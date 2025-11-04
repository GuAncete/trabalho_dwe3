const db = require('../config/database');

class ClienteController {
  
  // 1. CREATE (Criar Client)
  async create(req, res) {
    const { nome, documento } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }

    try {
      const [novoCliente] = await db('clientes')
        .insert({ nome, documento, removido: false })
        .returning('*');
      
      return res.status(201).json(novoCliente);
    } catch (error) {
     
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Este documento (CPF/CNPJ) já está cadastrado.' });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao criar cliente.' });
    }
  }

  // 2. READ (Listar Todos)
  async index(req, res) {
    try {
      
      const clientes = await db('clientes').where({ removido: false }).select('*');
      return res.json(clientes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao listar clientes.' });
    }
  }

  // 3. READ (Buscar Um)
  async show(req, res) {
    const { id } = req.params;

    try {
      const cliente = await db('clientes')
        .where({ id: id, removido: false })
        .first(); 

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      return res.json(cliente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao buscar cliente.' });
    }
  }

  // 4. UPDATE (Atualizar Cliente)
  async update(req, res) {
    const { id } = req.params;
    const { nome, documento } = req.body;

    try {
      const cliente = await db('clientes')
        .where({ id: id, removido: false })
        .first();

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      const [clienteAtualizado] = await db('clientes')
        .where({ id: id })
        .update({
          nome: nome || cliente.nome, 
          documento: documento || cliente.documento,
        })
        .returning('*');

      return res.json(clienteAtualizado);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Este documento (CPF/CNPJ) já está cadastrado em outro cliente.' });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao atualizar cliente.' });
    }
  }
  
  // 5. DELETE (Remoção Lógica / Soft Delete)
  async delete(req, res) {
    const { id } = req.params;

    try {
      const cliente = await db('clientes')
        .where({ id: id, removido: false })
        .first();

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      await db('clientes').where({ id: id }).update({ removido: true });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao deletar cliente.' });
    }
  }
}

module.exports = new ClienteController();