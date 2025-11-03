<template>
  <div>
    <h1>Dashboard</h1>
    <p>Bem-vindo ao sistema financeiro do ERP, {{ auth.user?.nome }}.</p>

    <div v-if="isLoading" class="loading-container">
      <p>Carregando dados...</p>
    </div>

    <div v-else-if="summary" class="dashboard-grid">

      <div classs="summary-container" style="grid-column: 1 / -1;">
        <div class="summary-box">
          <span>Total Faturado</span>
          <strong>{{ formatCurrency(summary.total_faturado) }}</strong>
        </div>
        <div class="summary-box pago">
          <span>Total Pago</span>
          <strong>{{ formatCurrency(summary.total_pago) }}</strong>
        </div>
        <div class="summary-box pendente">
          <span>Total Pendente</span>
          <strong>{{ formatCurrency(summary.total_pendente) }}</strong>
        </div>
      </div>

      <div class="widget-container">
        <h3>Total de Clientes</h3>
        <div class="widget-value">{{ summary.total_clientes }}</div>
        <router-link to="/clientes" class="widget-link">Ver todos</router-link>
      </div>

      <div class="widget-container">
        <h3>Total de Faturas</h3>
        <div class="widget-value">{{ summary.total_faturas }}</div>
      </div>

      <div class="widget-container" style="grid-column: 1 / -1;">
        <h3>Top 5 Clientes (por nº de faturas)</h3>
        <ul v-if="summary.topClientes.length > 0" class="top-clients-list">
          <li v-for="cliente in summary.topClientes" :key="cliente.id">
            <router-link :to="`/clientes/${cliente.id}`">
              {{ cliente.nome }}
            </router-link>
            <span>{{ cliente.contagem_faturas }} faturas</span>
          </li>
        </ul>
        <p v-else>Nenhuma fatura encontrada para classificar clientes.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/api/axiosConfig';

const auth = useAuthStore();
const isLoading = ref(true);

const summary = ref({
  total_faturado: 0,
  total_pago: 0,
  total_pendente: 0,
  total_faturas: 0,
  total_clientes: 0,
  topClientes: []
});

async function fetchSummary() {
  isLoading.value = true;
  try {
    const response = await apiClient.get('/dashboard/summary');
    summary.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar resumo da dashboard:', error);
    alert('Não foi possível carregar os dados da dashboard.');
  } finally {
    isLoading.value = false;
  }
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

onMounted(fetchSummary);
</script>

<style>


.loading-container {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #777;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.summary-container {
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
}

.widget-container {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.widget-container h3 {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.widget-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #3498db;
  text-align: center;
  margin-bottom: 15px;
}

.widget-link {
  display: block;
  text-align: center;
  text-decoration: none;
  color: #3498db;
  font-weight: 500;
}
.widget-link:hover {
  text-decoration: underline;
}

.top-clients-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.top-clients-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.top-clients-list li:last-child {
  border-bottom: none;
}

.top-clients-list li a {
  font-weight: 500;
  color: #2c3e50;
  text-decoration: none;
}
.top-clients-list li a:hover {
  color: #3498db;
}

.top-clients-list li span {
  font-size: 0.9rem;
  color: #777;
  background-color: #f4f7f6;
  padding: 3px 8px;
  border-radius: 4px;
}
</style>