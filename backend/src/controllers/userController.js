const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserController {
  

  async getProfile(req, res) {
    const userId = req.userId;

    try {
      const user = await db('usuarios')
        .where({ id: userId, removido: false })
        .select('id', 'nome', 'email') 
        .first();
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
    }
  }

  
  async updateProfile(req, res) {
    const userId = req.userId; 
    const { nome, email, senha } = req.body; 

    try {
      // 1. Prepara o objeto de atualização
      const dataToUpdate = {};

      if (nome) {
        dataToUpdate.nome = nome;
      }

      if (email) {
        // 2. Verifica se o novo e-mail já está em uso por OUTRO usuário
        const emailExists = await db('usuarios')
          .where({ email: email })
          .whereNot({ id: userId }) 
          .first();

        if (emailExists) {
          return res.status(400).json({ error: 'Este e-mail já está em uso por outra conta.' });
        }
        dataToUpdate.email = email;
      }

      // 3. Se uma nova senha foi fornecida, hasheia ela
      if (senha) {
        if (senha.length < 3) { 
           return res.status(400).json({ error: 'A nova senha é muito curta.' });
        }
        dataToUpdate.senha_hash = await bcrypt.hash(senha, 10);
      }
      
      // 4. Se não há nada para atualizar (corpo vazio)
      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
      }

      // 5. Executa a atualização no banco
      const [updatedUser] = await db('usuarios')
        .where({ id: userId })
        .update(dataToUpdate)
        .returning(['id', 'nome', 'email']); 
      
      return res.json(updatedUser);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
    }
  }
}

module.exports = new UserController();