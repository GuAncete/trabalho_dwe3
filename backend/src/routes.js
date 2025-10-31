const { Router } = require('express');
const authMiddleware = require('./middlewares/authMiddleware');

// Importar Controllers
const authController = require('./controllers/authController');
const clienteController = require('./controllers/clienteController');
const faturaController = require('./controllers/faturaController');
const userController = require('./controllers/userController');
const dashboardController = require('./controllers/dashboardController');

const routes = new Router();

// --- Rotas Públicas (Autenticação) ---
routes.post('/register', authController.register); // Criar usuário
routes.post('/login', authController.login);       // Obter token JWT

// --- Rotas Protegidas (Daqui para baixo, todas exigem JWT) ---
routes.use(authMiddleware);

routes.get('/profile', userController.getProfile);
routes.put('/profile', userController.updateProfile);

// --- Rotas de Clientes (CRUD 1) ---
routes.post('/clientes', clienteController.create);
routes.get('/clientes', clienteController.index);
routes.get('/clientes/:id', clienteController.show);
routes.put('/clientes/:id', clienteController.update);
routes.delete('/clientes/:id', clienteController.delete); // Soft delete

// --- Rotas de Faturas (CRUD 2) ---
routes.post('/faturas', faturaController.create);
routes.get('/faturas/:id', faturaController.show);
routes.put('/faturas/:id', faturaController.update);
routes.delete('/faturas/:id', faturaController.delete); // Soft delete

// --- NOVA ROTA DE PAGAMENTO ---
routes.patch('/faturas/:id/pagar', faturaController.pagar); // Rota para pagar

// Rota especial para o relacionamento 1:N
routes.get('/clientes/:cliente_id/faturas', faturaController.indexByCliente);
routes.get('/dashboard/summary', dashboardController.getSummary);



module.exports = routes;