<template>
  <form @submit.prevent="save" class="max-w-md bg-white shadow rounded p-4">
    <h2 class="text-lg font-semibold mb-4">
      {{ person?.id ? "Editar Pessoa" : "Nova Pessoa" }}
    </h2>

    <label class="block mb-2">Nome</label>
    <input
      v-model="localPerson.nome"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">CPF</label>
    <input
      v-model="localPerson.cpf"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 bg-gray-300 rounded"
      >
        Cancelar
      </button>
      <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">
        Salvar
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import personService from "../../api/personService";

const props = defineProps({ person: Object });
const emit = defineEmits(["cancel", "saved"]);

const localPerson = ref({ nome: "", cpf: "" });

watch(
  () => props.person,
  (newVal) => {
    localPerson.value = newVal ? { ...newVal } : { nome: "", cpf: "" };
  },
  { immediate: true }
);

async function save() {
  if (localPerson.value.id) {
    await personService.update(localPerson.value.id, localPerson.value);
  } else {
    await personService.create(localPerson.value);
  }
  emit("saved");
}
</script>
