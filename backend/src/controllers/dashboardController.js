const db = require("../config/database");

class DashboardController {
  /**
   * GET /api/v1/dashboard/summary
   * Busca um resumo de dados de toda a aplicação para a dashboard.
   */
  async getSummary(req, res) {
    try {
      // 1. Agregações de Faturas (SUMs, COUNTs)
      // Usamos db.raw para SQL customizado dentro do Knex
      const faturaStats = await db("faturas as f") // Damos um apelido 'f' para faturas
        .join("clientes as c", "f.cliente_id", "=", "c.id") // Fazemos o JOIN com clientes 'c'
        .where("f.removido", false) // Garante que a fatura não foi removida
        .where("c.removido", false) // <<<--- A CORREÇÃO: Garante que o cliente não foi removido
        .select(
          // Usamos 'f.valor' para ser explícito
          db.raw("SUM(f.valor) as total_faturado"),
          db.raw(
            "SUM(CASE WHEN f.data_pagamento IS NOT NULL THEN f.valor ELSE 0 END) as total_pago"
          ),
          db.raw(
            "SUM(CASE WHEN f.data_pagamento IS NULL THEN f.valor ELSE 0 END) as total_pendente"
          ),
          db.raw("COUNT(f.id) as total_faturas") // Usamos 'f.id'
        )
        .first(); // .first() pois é uma linha de agregação

      // 2. Contagem de Clientes
      const clienteStats = await db("clientes")
        .where({ removido: false })
        .count("* as total_clientes")
        .first();

      // 3. Top Clientes (com mais faturas)
      // Requer JOIN, GROUP BY, e ORDER BY
      const topClientes = await db("clientes as c")
        .join("faturas as f", "c.id", "=", "f.cliente_id")
        .where("c.removido", false)
        .where("f.removido", false)
        .select("c.id", "c.nome")
        .count("f.id as contagem_faturas") // Conta faturas
        .groupBy("c.id", "c.nome")
        .orderBy("contagem_faturas", "desc")
        .limit(5); // Top 5

      // 4. Monta o objeto de resposta
      const summary = {
        // Usa parseFloat e || 0 para garantir que sejam números, não strings ou null
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
