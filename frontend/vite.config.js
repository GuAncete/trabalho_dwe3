// vite.config.js

import { fileURLToPath, URL } from 'node:url' // Verifique esta linha
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      // Esta é a linha que faz o '@' funcionar
      '@': fileURLToPath(new URL('./src', import.meta.url)) 
    }
  }
})