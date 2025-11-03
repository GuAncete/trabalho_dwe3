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
import { useAuthStore } from '@/stores/auth'; 

const authStore = useAuthStore(); 
const isLoading = ref(false);

const form = ref({
  nome: '',
  email: '',
  senha: '' 
});

async function fetchProfile() {
  
  try {
    const response = await apiClient.get('/profile');
    form.value.nome = response.data.nome;
    form.value.email = response.data.email;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    alert('Não foi possível carregar seus dados.');
  }
}

async function handleUpdateProfile() {
  isLoading.value = true;
  
  const payload = {
    nome: form.value.nome,
    email: form.value.email
  };

  if (form.value.senha) {
    payload.senha = form.value.senha;
  }

  try {
    const response = await apiClient.put('/profile', payload);

    
    authStore.updateUser(response.data);

    alert('Perfil atualizado com sucesso!');
    form.value.senha = ''; 

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.response?.data);
    alert('Erro: ' + (error.response?.data?.error || 'Não foi possível salvar.'));
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchProfile);
</script>

<style scoped>
.form-group small {
  display: block;
  margin-top: 5px;
  color: #777;
}
</style>