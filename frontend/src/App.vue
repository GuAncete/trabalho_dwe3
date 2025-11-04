<template>
  <div v-if="auth.isAuthenticated" class="app-container">
    
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>ERP Financeiro</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/">
          <span>Dashboard</span>
        </router-link>
        <router-link to="/clientes">
          <span>Clientes</span>
        </router-link>
      </nav>
    </aside>

    <div class="main-content">
      
      <header class="content-header">
        <div class="user-menu">
        <router-link to="/profile" class="profile-link">
          <span>Olá, {{ auth.user?.nome }}</span>
        </router-link>

        <button @click="handleLogout" class="logout-button">Sair</button>
      </div>
      </header>
      
      <main class="content-view">
        <router-view />
      </main>

    </div>
  </div>
  <!-- 
    Layout Alternativo (Else):
    Se o usuário NÃO estiver autenticado, mostra este container.
    Usado para as telas de Login, Registro, etc.
  -->
  <div v-else class="logged-out-container">
    <router-view />
  </div>

</template> <script setup>
// O script permanece exatamente o mesmo
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>

<style>
/* --- 1. ESTILOS GLOBAIS E RESET --- */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  background-color: #f4f7f6;
  color: #333;
}

* {
  box-sizing: border-box;
}


.app-container {
  display: flex;
}

.sidebar {
  width: 240px;
  height: 100vh; /* Altura total da tela */
  position: fixed; /* Fixo no lugar */
  left: 0;
  top: 0;
  background-color: #2c3e50; /* Cor escura moderna */
  color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.sidebar-nav {
  margin-top: 20px;
  flex-grow: 1; /* Ocupa o espaço restante */
}

.sidebar-nav a {
  display: flex; /* Para alinhar ícones no futuro */
  align-items: center;
  padding: 15px 25px;
  color: #ecf0f1; /* Cor de texto clara */
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.sidebar-nav a:hover {
  background-color: #34495e; /* Destaque sutil ao passar o mouse */
}

/* Estilo do link ATIVO (página atual) */
.sidebar-nav a.router-link-exact-active {
  background-color: #3498db; /* Cor primária (azul) */
  color: white;
  font-weight: 600;
  position: relative;
}

/* Pequeno triângulo/detalhe para o link ativo */
.sidebar-nav a.router-link-exact-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #ffffff;
}

/* --- 2b. Estilos da Área de Conteúdo --- */
.main-content {
  /* A mágica acontece aqui: empurra o conteúdo para a direita */
  margin-left: 240px; 
  width: calc(100% - 240px); /* Ocupa o resto da largura */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-header {
  height: 65px;
  display: flex;
  justify-content: flex-end; /* Alinha o menu do usuário à direita */
  align-items: center;
  padding: 0 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0; /* Impede que o header encolha */
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-menu span {
  margin-right: 15px;
  font-weight: 500;
  color: #555;
}

.logout-button {
  background-color: #e74c3c; /* Vermelho moderno */
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #c0392b; /* Vermelho mais escuro no hover */
}

.content-view {
  /* Esta é a área que segura o <router-view> */
  padding: 30px;
  flex-grow: 1; /* Ocupa todo o espaço vertical restante */
  background-color: #f4f7f6; /* Fundo cinza claro */
}


/* --- 3. ESTILOS DE LOGIN/REGISTRO (Tela Cheia) --- */
.logged-out-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f7f6;
}

.auth-container {
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.auth-container h1 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
  color: #2c3e50;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.auth-button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}
.auth-button:hover {
  background-color: #2980b9;
}
.auth-container p {
  text-align: center;
  margin-top: 20px;
  color: #555;
}
.auth-container p a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
.auth-container p a:hover {
  text-decoration: underline;
}


/* --- 4. ESTILOS DE CONTEÚDO (Tabelas, Forms, etc.) --- */

/* Estilos para containers (ex: formulário de clientes) */
.form-container {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 30px;
}
.form-container h3 {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

/* Estilos de Tabela */
.crud-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 8px;
  overflow: hidden; /* Para o border-radius funcionar nas bordas */
}
.crud-table th, .crud-table td {
  border-bottom: 1px solid #ddd;
  padding: 14px 18px;
  text-align: left;
}
.crud-table th {
  background-color: #f9fafb; /* Cabeçalho de tabela mais claro */
  font-weight: 600;
  color: #444;
}
.crud-table tr:nth-child(even) {
  background-color: #fdfdfd;
}
.crud-table tr:last-child td {
  border-bottom: none;
}
.crud-table tr:hover {
  background-color: #f5f5f5;
}

/* Estilos de Botões de Ação */
.action-button {
  margin-right: 6px;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: opacity 0.2s;
}
.action-button:hover {
  opacity: 0.8;
}

.btn-edit { background-color: #f0ad4e; color: white; }
.btn-delete { background-color: #d9534f; color: white; }
.btn-details { background-color: #0275d8; color: white; }

.btn-create {
  padding: 10px 16px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 20px;
  transition: background-color 0.2s;
}
.btn-create:hover {
  background-color: #4a9d4e;
}

/* Ajuste nos formulários de criação/edição */
.form-container .form-group {
  display: inline-block;
  width: calc(50% - 10px);
  margin-right: 15px;
}
.form-container .form-group:last-of-type {
  margin-right: 0;
}
.form-container button {
  margin-top: 10px;
}

/* Cole isso no final da tag <style> em App.vue */

.profile-link {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  margin-right: 15px;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.profile-link:hover {
  background-color: #f0f0f0;
}
</style>