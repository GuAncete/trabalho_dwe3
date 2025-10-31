<template>
  <div class="auth-container">
    <h1>Registrar</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="nome" required />
      </div>
      <div class="form-group">
        <label for="email">E-mail:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="senha">Senha:</label>
        <input type="password" id="senha" v-model="senha" required />
      </div>
      <button type="submit" class="auth-button" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrar' }}
      </button>
    </form>
     <p>
      Já tem uma conta? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const nome = ref('');
const email = ref('');
const senha = ref('');
const isLoading = ref(false);

async function handleSubmit() {
  if (!nome.value || !email.value || !senha.value) {
    alert('Preencha todos os campos.');
    return;
  }

  isLoading.value = true;
  await authStore.register({ 
    nome: nome.value, 
    email: email.value, 
    senha: senha.value 
  });
  isLoading.value = false;
}
</script>