// src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <--- 1. Importe o CORS
const routes = require('./routes');

// ... (teste de conexão com o banco) ...

const app = express();
const PORT = process.env.PORT || 3333;

// --- Middlewares ---
app.use(cors()); // <--- 2. Habilite o CORS para todas as origens (bom para dev)
app.use(express.json());

// Carrega as rotas
app.use('/api/v1', routes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});