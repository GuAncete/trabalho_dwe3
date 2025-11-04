const db = require("../config/database");

class DashboardController {

  async getSummary(req, res) {
    try {
      // 1. Agregações de Fatura (SUMs, COUNTs)
      const faturaStats = await db("faturas as f") 
        .join("clientes as c", "f.cliente_id", "=", "c.id") 
        .where("f.removido", false) 
        .where("c.removido", false) 
        .select(
          db.raw("SUM(f.valor) as total_faturado"),
          db.raw(
            "SUM(CASE WHEN f.data_pagamento IS NOT NULL THEN f.valor ELSE 0 END) as total_pago"
          ),
          db.raw(
            "SUM(CASE WHEN f.data_pagamento IS NULL THEN f.valor ELSE 0 END) as total_pendente"
          ),
          db.raw("COUNT(f.id) as total_faturas") 
        )
        .first(); 

      // 2. Contagem de Clientes
      const clienteStats = await db("clientes")
        .where({ removido: false })
        .count("* as total_clientes")
        .first();

      // 3. Top Clientes (com mais faturas)
      const topClientes = await db("clientes as c")
        .join("faturas as f", "c.id", "=", "f.cliente_id")
        .where("c.removido", false)
        .where("f.removido", false)
        .select("c.id", "c.nome")
        .count("f.id as contagem_faturas") 
        .groupBy("c.id", "c.nome")
        .orderBy("contagem_faturas", "desc")
        .limit(5); 

      // 4. Monta o objeto de resposta
      const summary = {
        total_faturado: parseFloat(faturaStats.total_faturado) || 0,
        total_pago: parseFloat(faturaStats.total_pago) || 0,
        total_pendente: parseFloat(faturaStats.total_pendente) || 0,
        total_faturas: parseInt(faturaStats.total_faturas, 10) || 0,
        total_clientes: parseInt(clienteStats.total_clientes, 10) || 0,
        topClientes: topClientes,
      };

      return res.json(summary);
    } catch (error) {
      console.error("Erro ao buscar resumo da dashboard:", error);
      return res.status(500).json({ error: "Erro interno ao buscar resumo." });
    }
  }
}

module.exports = new DashboardController();
