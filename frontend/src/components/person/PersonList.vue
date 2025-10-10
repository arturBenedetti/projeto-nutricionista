<template>
  <div>
    <div class="flex justify-between mb-3">
      <h2 class="text-lg font-semibold">Lista de Pessoas</h2>
      <button
        @click="$emit('add')"
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        Nova Pessoa
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <table v-else class="min-w-full bg-white shadow rounded">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Nome</th>
          <th class="p-2 text-left">CPF</th>
          <th class="p-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in people" :key="person.id" class="border-b">
          <td class="p-2">{{ person.nome }}</td>
          <td class="p-2">{{ person.cpf }}</td>
          <td class="p-2">
            <button @click="$emit('view', person)" class="text-blue-600 mr-2">
              👁️
            </button>
            <button @click="$emit('edit', person)" class="text-yellow-600 mr-2">
              ✏️
            </button>
            <button @click="confirmDelete(person)" class="text-red-600">
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmDialog
      v-if="personToDelete"
      title="Excluir pessoa"
      message="Tem certeza que deseja excluir esta pessoa?"
      @confirm="deletePerson"
      @cancel="personToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import personService from "../../api/personService";
// import ConfirmDialog from "../../components/shared/ConfirmDialog.vue";
// import LoadingSpinner from "../../components/shared/LoadingSpinner.vue";

const people = ref([]);
const loading = ref(true);
const personToDelete = ref(null);

onMounted(fetchData);

async function fetchData() {
  loading.value = true;
  people.value = await personService.getAll();
  loading.value = false;
}

function confirmDelete(person) {
  personToDelete.value = person;
}

async function deletePerson() {
  await personService.remove(personToDelete.value.id);
  personToDelete.value = null;
  fetchData();
}
</script>
