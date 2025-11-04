const db = require('../config/database');

class FaturaController {
  
  // 1. CREATE (Criar Fatura para um Client)
  async create(req, res) {
    const { cliente_id, descricao, valor, data_vencimento } = req.body;

    if (!cliente_id || !descricao || !valor || !data_vencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    try {
      const cliente = await db('clientes')
        .where({ id: cliente_id, removido: false })
        .first();
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
      
      const [novaFatura] = await db('faturas')
        .insert({
          cliente_id,
          descricao,
          valor,
          data_vencimento,
          removido: false
        })
        .returning('*');
        
      return res.status(201).json(novaFatura);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao criar fatura.' });
    }
  }

  // 2. READ (Listar todas as faturas de um cliente específico)
  async indexByCliente(req, res) {
    const { cliente_id } = req.params;

    try {
       const cliente = await db('clientes')
        .where({ id: cliente_id, removido: false })
        .first();
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
      
      const faturas = await db('faturas')
        .where({ cliente_id: cliente_id, removido: false })
        .select('*');
        
      return res.json(faturas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao listar faturas.' });
    }
  }

  // 3. READ (Buscar uma fatura específica)
  async show(req, res) {
    const { id } = req.params;
    try {
      const fatura = await db('faturas')
        .where({ id: id, removido: false })
        .first();
      
      if (!fatura) {
        return res.status(404).json({ error: 'Fatura não encontrada.' });
      }
      return res.json(fatura);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao buscar fatura.' });
    }
  }

  // 4. UPDATE (Atualizar Fatura)
  async update(req, res) {
    const { id } = req.params;
    const { descricao, valor, data_vencimento } = req.body; 

    try {
      const fatura = await db('faturas')
        .where({ id: id, removido: false })
        .first();
      
      if (!fatura) {
        return res.status(404).json({ error: 'Fatura não encontrada.' });
      }

      const [faturaAtualizada] = await db('faturas')
        .where({ id: id })
        .update({
          descricao: descricao || fatura.descricao,
          valor: valor || fatura.valor,
          data_vencimento: data_vencimento || fatura.data_vencimento,
        })
        .returning('*');

      return res.json(faturaAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao atualizar fatura.' });
    }
  }

  // 5. DELETE (Soft Delete da Fatura)
  async delete(req, res) {
    const { id } = req.params;

    try {
      const fatura = await db('faturas')
        .where({ id: id, removido: false })
        .first();

      if (!fatura) {
        return res.status(404).json({ error: 'Fatura não encontrada.' });
      }

      await db('faturas').where({ id: id }).update({ removido: true });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao deletar fatura.' });
    }
  }


  // 6. PAY (Marcar Fatura como Paga)
  async pagar(req, res) {
    const { id } = req.params;

    try {
      const fatura = await db('faturas')
        .where({ id: id, removido: false })
        .first();

      if (!fatura) {
        return res.status(404).json({ error: 'Fatura não encontrada.' });
      }

      if (fatura.data_pagamento) {
        return res.status(400).json({ error: 'Esta fatura já foi paga.' });
      }

      const [faturaPaga] = await db('faturas')
        .where({ id: id })
        .update({
          data_pagamento: new Date(),
        })
        .returning('*');
      
      return res.json(faturaPaga);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao processar pagamento.' });
    }
  }
} 

module.exports = new FaturaController();