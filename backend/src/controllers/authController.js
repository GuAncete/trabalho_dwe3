const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  // REGISTRAR (Criar usuário)
  async register(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const emailExists = await db('usuarios').where({ email }).first();
      if (emailExists) {
        return res.status(400).json({ error: 'Este e-mail já está em uso.' });
      }

      const senha_hash = await bcrypt.hash(senha, 10);

      // Knex retorna um array, pegamos o primeiro (e único) item
      const [novoUsuario] = await db('usuarios')
        .insert({
          nome,
          email,
          senha_hash,
          removido: false,
        })
        .returning(['id', 'nome', 'email']); // Retorna os dados inseridos

      return res.status(201).json(novoUsuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
  }

  // LOGIN
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
      const usuario = await db('usuarios')
        .where({ email })
        .where({ removido: false }) // Não deixa usuário "removido" logar
        .first();

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Compara a senha enviada com a hash salva no banco
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // Gerar o Token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: '8h' } // Token expira em 8 horas
      );

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
        token: token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
    }
  }
}

module.exports = new AuthController();