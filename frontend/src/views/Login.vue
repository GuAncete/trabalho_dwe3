<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">E-mail:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="senha">Senha:</label>
        <input type="password" id="senha" v-model="senha" required />
      </div>
      <button type="submit" class="auth-button" :disabled="isLoading">
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
    <p>
      Não tem uma conta? <router-link to="/register">Registre-se</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const email = ref('');
const senha = ref('');
const isLoading = ref(false);

async function handleSubmit() {
  if (!email.value || !senha.value) {
    alert('Preencha e-mail e senha.');
    return;
  }
  
  isLoading.value = true;
  await authStore.login({ email: email.value, senha: senha.value });
  isLoading.value = false;
}
</script>