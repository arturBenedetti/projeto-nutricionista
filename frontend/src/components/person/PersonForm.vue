<template>
  <form @submit.prevent="save" class="max-w-md bg-[#111827] shadow rounded p-4">
    <h2 class="text-lg font-semibold mb-4">
      {{ person?.id ? "Editar Paciente" : "Novo Paciente" }}
    </h2>

    <label class="block mb-2">Nome</label>
    <input
      v-model="localPerson.nome"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Email</label>
    <input
      v-model="localPerson.email"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Sexo</label>
    <div class="flex space-x-4 mb-3">
      <div>
        <input
          type="radio"
          id="masculino"
          value="masculino"
          v-model="localPerson.sexo"
          class="mr-1"
        />
        <label for="masculino">Masculino</label>
      </div>
      <div>
        <input
          type="radio"
          id="feminino"
          value="feminino"
          v-model="localPerson.sexo"
          class="mr-1"
        />
        <label for="feminino">Feminino</label>
      </div>
    </div>

    <label class="block mb-2">Data de Nascimento</label>
    <input
      v-model="localPerson.dtaNascimento"
      type="date"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Altura (cm)</label>
    <input
      v-model="localPerson.altura"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      @change="calcIMC"
      required
    />

    <label class="block mb-2">Peso (kg)</label>
    <input
      v-model="localPerson.peso"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      @change="calcIMC"
      required
    />

    <label class="block mb-2">IMC</label>
    <input
      v-model="localPerson.imc"
      disabled
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Anamnese</label>
    <textarea
      v-model="localPerson.anamnese"
      rows="5"
      class="border w-full p-2 mb-3 rounded"
      required
    ></textarea>

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

const localPerson = ref({
  nome: "",
  email: "",
  sexo: "",
  dtaNascimento: "",
  altura: "",
  peso: "",
  imc: "",
  anamnese: "",
});

function calcIMC() {
  if (localPerson.value.peso && localPerson.value.altura) {
    const peso = parseFloat(localPerson.value.peso);
    const altura = parseFloat(localPerson.value.altura) / 100;

    if (altura > 0) {
      const imc = peso / (altura * altura);
      localPerson.value.imc = imc.toFixed(2);
      return;
    }
  }

  localPerson.value.imc = "";
}

watch(
  () => props.person,
  (newVal) => {
    localPerson.value = newVal
      ? { ...newVal }
      : {
          nome: "",
          email: "",
          sexo: "",
          dtaNascimento: "",
          altura: "",
          peso: "",
          imc: "",
          anamnese: "",
        };
  },
  { immediate: true }
);

async function save() {
  if (localPerson.value.id) {
    
  } else {
    await window.api.criarPaciente(localPerson.value);
  }
  emit("saved");
}
</script>

<style scoped>
:root {
  background-color: #111827;
}
</style>
