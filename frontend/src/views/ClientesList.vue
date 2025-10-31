<template>
  <div>
    <h1>Gerenciamento de Clientes</h1>
    
    <div class="form-container" style="margin-bottom: 20px; background: #fff; padding: 15px; border-radius: 8px;">
      <h3>{{ editMode ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="form.nome" required />
        </div>
        <div class="form-group">
          <label for="documento">Documento (CPF/CNPJ):</label>
          <input type="text" id="documento" v-model="form.documento" />
        </div>
        <button type="submit" class="btn-create" :disabled="isLoading">
          {{ editMode ? 'Salvar Alterações' : 'Criar Cliente' }}
        </button>
        <button v-if="editMode" type="button" @click="cancelEdit" class="action-button" style="background: #aaa;">
          Cancelar
        </button>
      </form>
    </div>

    <table class="crud-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Documento</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="clientes.length === 0">
          <td colspan="4">Nenhum cliente cadastrado.</td>
        </tr>
        <tr v-for="cliente in clientes" :key="cliente.id">
          <td>{{ cliente.id }}</td>
          <td>{{ cliente.nome }}</td>
          <td>{{ cliente.documento }}</td>
          <td>
            <button @click="handleView(cliente.id)" class="action-button btn-details">
              Ver Faturas
            </button>
            <button @click="handleEdit(cliente)" class="action-button btn-edit">
              Editar
            </button>
            <button @click="handleDelete(cliente.id)" class="action-button btn-delete">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axiosConfig'; // Nosso cliente Axios protegido

const router = useRouter();
const clientes = ref([]);
const isLoading = ref(false);
const editMode = ref(false);
const form = ref({
  id: null,
  nome: '',
  documento: ''
});

// --- Funções CRUD ---

async function fetchClientes() {
  try {
    const response = await apiClient.get('/clientes');
    clientes.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    alert('Não foi possível carregar os clientes.');
  }
}

function resetForm() {
  editMode.value = false;
  form.value = { id: null, nome: '', documento: '' };
}

async function handleSubmit() {
  isLoading.value = true;
  try {
    if (editMode.value) {
      // 4. UPDATE
      await apiClient.put(`/clientes/${form.value.id}`, {
        nome: form.value.nome,
        documento: form.value.documento
      });
      alert('Cliente atualizado com sucesso!');
    } else {
      // 1. CREATE
      await apiClient.post('/clientes', {
        nome: form.value.nome,
        documento: form.value.documento
      });
      alert('Cliente criado com sucesso!');
    }
    resetForm();
    await fetchClientes(); // Recarrega a lista
  } catch (error) {
    console.error('Erro ao salvar cliente:', error.response?.data);
    alert('Erro ao salvar: ' + (error.response?.data?.error || 'Tente novamente.'));
  } finally {
    isLoading.value = false;
  }
}

// 5. DELETE
async function handleDelete(id) {
  if (confirm('Tem certeza que deseja remover este cliente? (Soft delete)')) {
    try {
      await apiClient.delete(`/clientes/${id}`);
      alert('Cliente removido com sucesso.');
      await fetchClientes(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      alert('Erro ao remover cliente.');
    }
  }
}

// --- Funções de UI ---

function handleEdit(cliente) {
  editMode.value = true;
  form.value = { ...cliente }; // Copia os dados do cliente para o formulário
  window.scrollTo(0, 0); // Rola para o topo (onde está o form)
}

function cancelEdit() {
  resetForm();
}

// 2. READ (Um) / 3. READ (Todos)
function handleView(id) {
  // Navega para a página de detalhes (1:N)
  router.push({ name: 'ClienteDetalhes', params: { id: id } });
}

// Carrega os clientes quando o componente é montado
onMounted(fetchClientes);
</script>