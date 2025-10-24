<template>
  <div>
    <div class="flex justify-between mb-3">
      <h2 class="text-lg font-semibold">Lista de Pacientes</h2>
      <button
        @click="$emit('add')"
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        Novo Paciente
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <table v-else class="min-w-full bg-[#111827] shadow rounded">
      <thead class="bg-gray-700">
        <tr>
          <th class="p-2 text-left">Nome</th>
          <th class="p-2 text-left">Email</th>
          <th class="p-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="paciente in pacientes"
          :key="paciente.id"
          class="border-b"
        >
          <td class="p-2">{{ paciente.nome }}</td>
          <td class="p-2">{{ paciente.email }}</td>
          <td class="p-2">
            <button @click="$emit('view', paciente)" class="text-blue-300 mr-2">
              Ver
            </button>
            <button
              @click="$emit('edit', paciente)"
              class="text-yellow-300 mr-2"
            >
              Editar
            </button>
            <button @click="confirmDelete(paciente)" class="text-red-500">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmDialog
      v-if="pacienteToDelete"
      title="Excluir paciente"
      message="Tem certeza que deseja excluir este paciente?"
      @confirm="deletePaciente"
      @cancel="pacienteToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ConfirmDialog from "../../components/shared/ConfirmDialog.vue";
import LoadingSpinner from "../../components/shared/LoadingSpinner.vue";
import { loggedUser } from "../../services/UsuarioService";

const pacientes = ref([]);
const loading = ref(true);
const pacienteToDelete = ref(null);

onMounted(fetchData);

async function fetchData() {
  loading.value = true;
  const response = await window.api.listarPacientes({
    idNutricionista: loggedUser.value.id,
  });

  if (response && response.pacientes) {
    pacientes.value = response.pacientes;
  } else {
    console.error("Erro ao listar pacientes:", response);
  }

  loading.value = false;
}

function confirmDelete(paciente) {
  pacienteToDelete.value = paciente;
}

async function deletePaciente() {  
  try {
    const sucesso = await window.api.excluirPaciente({
      id: pacienteToDelete.value.id
    });
    
    if (sucesso) {
      console.log("Paciente excluído com sucesso");
      fetchData(); // Recarregar a lista
    } else {
      console.error("Erro ao excluir paciente");
      alert("Erro ao excluir paciente");
    }
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    alert("Erro ao excluir paciente: " + error.message);
  } finally {
    pacienteToDelete.value = null;
  }
}
</script>
