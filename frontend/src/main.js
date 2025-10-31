// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- 1. Importe o createPinia

import App from './App.vue'
import router from './router'

// Cria a instância principal do Vue
const app = createApp(App)

// --- Registro dos Plugins ---
// Você DEVE registrar os plugins ANTES de montar a aplicação

app.use(createPinia()) // <-- 2. Diga ao Vue para usar o Pinia
app.use(router)      // <-- 3. Diga ao Vue para usar o Router

// --- Montagem ---
// Agora que os plugins estão prontos, inicie a aplicação
app.mount('#app')