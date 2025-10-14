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

    <table v-else class="min-w-full bg-white shadow rounded">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Nome</th>
          <th class="p-2 text-left">email</th>
          <th class="p-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="paciente in people" :key="paciente.id" class="border-b">
          <td class="p-2">{{ paciente.nome }}</td>
          <td class="p-2">{{ paciente.email }}</td>
          <td class="p-2">
            <button @click="$emit('view', paciente)" class="text-blue-600 mr-2">
              👁️
            </button>
            <button @click="$emit('edit', paciente)" class="text-yellow-600 mr-2">
              ✏️
            </button>
            <button @click="confirmDelete(paciente)" class="text-red-600">
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmDialog
      v-if="pacienteToDelete"
      title="Excluir pessoa"
      message="Tem certeza que deseja excluir esta pessoa?"
      @confirm="deletePaciente"
      @cancel="pacienteToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ConfirmDialog from "../../components/shared/ConfirmDialog.vue";
import LoadingSpinner from "../../components/shared/LoadingSpinner.vue";

const pacientes = ref([]);
const loading = ref(true);
const pacienteToDelete = ref(null);

onMounted(fetchData);

async function fetchData() {
  // loading.value = true;
  // pacientes.value = await pacienteService.getAll();
  // loading.value = false;
}

function confirmDelete(paciente) {
  pacienteToDelete.value = paciente;
}

async function deletePaciente() {
  await pacienteService.remove(pacienteToDelete.value.id);
  pacienteToDelete.value = null;
  fetchData();
}
</script>
