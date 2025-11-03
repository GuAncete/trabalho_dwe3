<template>
  <div>
    <router-link to="/clientes">&larr; Voltar para Clientes</router-link>

    <div v-if="cliente">
      <h1>Faturas de: {{ cliente.nome }}</h1>
      <p><strong>Documento:</strong> {{ cliente.documento }}</p>
    </div>
    <div v-else>
      <h1>Carregando cliente...</h1>
    </div>

    <div classs="summary-container">
      <div class="summary-box">
        <span>Total Faturado</span>
        <strong>R$ {{ totalFaturado.toFixed(2) }}</strong>
      </div>
      <div class="summary-box pago">
        <span>Total Pago</span>
        <strong>R$ {{ totalPago.toFixed(2) }}</strong>
      </div>
      <div class="summary-box pendente">
        <span>Total Pendente</span>
        <strong>R$ {{ totalPendente.toFixed(2) }}</strong>
      </div>
    </div>
    <hr>
    
    <div class="form-container">
      <h3>Nova Fatura</h3>
      <form @submit.prevent="handleCreateFatura">
        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <input type="text" id="descricao" v-model="formFatura.descricao" required />
        </div>
         <div class="form-group">
          <label for="valor">Valor (ex: 1500.50):</label>
          <input type="number" step="0.01" id="valor" v-model="formFatura.valor" required />
        </div>
         <div class="form-group">
          <label for="vencimento">Data de Vencimento:</label>
          <input type="date" id="vencimento" v-model="formFatura.data_vencimento" required />
        </div>
        <button type="submit" class="btn-create" :disabled="isLoading">
          Criar Fatura
        </button>
      </form>
    </div>
    
    <h3>Faturas do Cliente</h3>
    <table class="crud-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Vencimento</th>
          <th>Status</th> <th>Ações</th>
        </tr>
      </thead>
      <tbody>
         <tr v-if="faturas.length === 0">
          <td colspan="6">Nenhuma fatura encontrada para este cliente.</td>
        </tr>
        <tr v-for="fatura in faturas" :key="fatura.id">
          <td>{{ fatura.id }}</td>
          <td>{{ fatura.descricao }}</td>
          <td>R$ {{ parseFloat(fatura.valor).toFixed(2) }}</td>
          <td>{{ formatarData(fatura.data_vencimento) }}</td>
          
          <td>
            <span v-if="fatura.data_pagamento" class="status-pago">
              Pago em {{ formatarData(fatura.data_pagamento) }}
            </span>
            <span v-else class="status-pendente">
              Pendente
            </span>
          </td>

          <td>
            <button 
              v-if="!fatura.data_pagamento"
              @click="handlePagarFatura(fatura.id)" 
              class="action-button btn-pay">
              Pagar
            </button>
             <button 
              @click="handleDeleteFatura(fatura.id)" 
              class="action-button btn-delete"
              :disabled="!!fatura.data_pagamento"
              title="Não é possível excluir faturas pagas">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; 
import { useRoute } from 'vue-router';
import apiClient from '@/api/axiosConfig';

const route = useRoute();
const clienteId = route.params.id; 

const cliente = ref(null);
const faturas = ref([]);
const isLoading = ref(false);

const formFatura = ref({
  descricao: '',
  valor: 0.0,
  data_vencimento: ''
});


const totalFaturado = computed(() => {
  return faturas.value.reduce((total, fatura) => {
    return total + parseFloat(fatura.valor);
  }, 0);
});


const totalPago = computed(() => {
  return faturas.value.reduce((total, fatura) => {
    if (fatura.data_pagamento) {
      return total + parseFloat(fatura.valor);
    }
    return total;
  }, 0);
});


const totalPendente = computed(() => {
  return totalFaturado.value - totalPago.value;
});




async function fetchCliente() {
  try {
    const response = await apiClient.get(`/clientes/${clienteId}`);
    cliente.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    alert('Cliente não encontrado.');
  }
}

async function fetchFaturas() {
  try {
    const response = await apiClient.get(`/clientes/${clienteId}/faturas`);
    faturas.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar faturas:', error);
  }
}



async function handleCreateFatura() {
  isLoading.value = true;
  try {
    await apiClient.post('/faturas', {
      ...formFatura.value,
      cliente_id: clienteId 
    });
    alert('Fatura criada com sucesso!');
    formFatura.value = { descricao: '', valor: 0.0, data_vencimento: '' };
    await fetchFaturas(); 
  } catch (error) {
     console.error('Erro ao criar fatura:', error.response?.data);
    alert('Erro ao criar fatura: ' + (error.response?.data?.error || 'Tente novamente.'));
  } finally {
    isLoading.value = false;
  }
}

async function handleDeleteFatura(faturaId) {
   if (confirm('Tem certeza que deseja remover esta fatura? (Soft delete)')) {
    try {
      await apiClient.delete(`/faturas/${faturaId}`);
      alert('Fatura removida com sucesso.');
      await fetchFaturas(); 
    } catch (error) {
      console.error('Erro ao deletar fatura:', error);
      alert('Erro ao remover fatura.');
    }
  }
}


async function handlePagarFatura(faturaId) {
  if (confirm('Confirmar o pagamento desta fatura?')) {
    try {
      
      await apiClient.patch(`/faturas/${faturaId}/pagar`);
      alert('Fatura paga com sucesso!');
      await fetchFaturas(); 
    } catch (error) {
      console.error('Erro ao pagar fatura:', error.response?.data);
      alert('Erro: ' + (error.response?.data?.error || 'Não foi possível pagar a fatura.'));
    }
  }
}



function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

onMounted(() => {
  fetchCliente();
  fetchFaturas();
});
</script>

<style>

.summary-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 20px; 
}
.summary-box {
  flex: 1; 
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-left: 5px solid #0275d8; 
}
.summary-box span {
  display: block;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}
.summary-box strong {
  display: block;
  font-size: 1.8rem;
  color: #333;
}

.summary-box.pago {
  border-left-color: #5cb85c; 
}
.summary-box.pago strong {
  color: #5cb85c;
}
.summary-box.pendente {
  border-left-color: #d9534f; 
}
.summary-box.pendente strong {
  color: #d9534f;
}


.status-pago {
  color: #5cb85c;
  font-weight: 600;
}
.status-pendente {
  color: #f0ad4e; 
  font-weight: 600;
}


.btn-pay {
  background-color: #5cb85c;
  color: white;
}


.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>