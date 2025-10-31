<template>
  <div>
    <h1>Meu Perfil</h1>
    <p>Atualize suas informações pessoais e senha.</p>
    
    <div class="form-container">
      <h3>Editar Dados</h3>
      <form @submit.prevent="handleUpdateProfile">
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="form.nome" required />
        </div>
        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        
        <hr style="margin: 20px 0; border-top: 1px solid #eee;">
        
        <div class="form-group" style="width: 100%;">
          <label for="senha">Nova Senha:</label>
          <input type="password" id="senha" v-model="form.senha" />
          <small>Deixe em branco para não alterar a senha atual.</small>
        </div>

        <button type="submit" class="btn-create" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/api/axiosConfig';
import { useAuthStore } from '@/stores/auth'; // Importa a store

const authStore = useAuthStore(); // Instancia a store
const isLoading = ref(false);

const form = ref({
  nome: '',
  email: '',
  senha: '' // Este campo é opcional
});

// 1. Busca os dados atuais do usuário quando a página carrega
async function fetchProfile() {
  // Poderíamos usar authStore.user, mas buscar da API garante
  // que os dados estão 100% atualizados.
  try {
    const response = await apiClient.get('/profile');
    form.value.nome = response.data.nome;
    form.value.email = response.data.email;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    alert('Não foi possível carregar seus dados.');
  }
}

// 2. Envia as atualizações para a API
async function handleUpdateProfile() {
  isLoading.value = true;
  
  // Prepara o payload
  const payload = {
    nome: form.value.nome,
    email: form.value.email
  };

  // Só envia a senha se o campo foi preenchido
  if (form.value.senha) {
    payload.senha = form.value.senha;
  }

  try {
    const response = await apiClient.put('/profile', payload);

    // 3. ATUALIZA A STORE (e o localStorage) com os novos dados
    //    Isso é crucial para que o "Olá, Nome" no topo mude!
    authStore.updateUser(response.data);

    alert('Perfil atualizado com sucesso!');
    form.value.senha = ''; // Limpa o campo de senha

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.response?.data);
    alert('Erro: ' + (error.response?.data?.error || 'Não foi possível salvar.'));
  } finally {
    isLoading.value = false;
  }
}

// Busca os dados ao montar o componente
onMounted(fetchProfile);
</script>

<style scoped>
/* Estilos específicos para esta página, se necessário */
.form-group small {
  display: block;
  margin-top: 5px;
  color: #777;
}
</style>