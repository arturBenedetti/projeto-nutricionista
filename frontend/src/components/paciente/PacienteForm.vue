<script setup>
import { ref, watch } from "vue";

const props = defineProps({ paciente: Object });
const emit = defineEmits(["cancel", "saved"]);

const localPaciente = ref({
  nome: "",
  email: "",
  sexo: "",
  dataNascimento: "",
  altura: "",
  peso: "",
  imc: "",
  anamnese: "",
});

function calcIMC() {
  if (localPaciente.value.peso && localPaciente.value.altura) {
    const peso = parseFloat(localPaciente.value.peso);
    const altura = parseFloat(localPaciente.value.altura) / 100;

    if (altura > 0) {
      const imc = peso / (altura * altura);
      localPaciente.value.imc = imc.toFixed(2);
      return;
    }
  }

  localPaciente.value.imc = "";
}

watch(
  () => props.paciente,
  (newVal) => {
    localPaciente.value = newVal
      ? { ...newVal }
      : {
          nome: "",
          email: "",
          sexo: "",
          dataNascimento: "",
          altura: "",
          peso: "",
          imc: "",
          anamnese: "",
        };
  },
  { immediate: true }
);

async function save() {
  if (localPaciente.value.id) {
    // Update existing paciente
  } else {
    const novoPaciente = {
      idNutricionista: "",
      nome: localPaciente.value.nome,
      sexo: localPaciente.value.sexo,
      email: localPaciente.value.email,
      dataNascimento: localPaciente.value.dataNascimento,
      peso: localPaciente.value.peso,
      altura: localPaciente.value.altura,
      anamnese: localPaciente.value.anamnese,
    };
    await window.api.criarPaciente(novoPaciente);
  }
  emit("saved");
}
</script>

<template>
  <form @submit.prevent="save" class="max-w-md bg-[#111827] shadow rounded p-4">
    <h2 class="text-lg font-semibold mb-4">
      {{ paciente?.id ? "Editar Paciente" : "Novo Paciente" }}
    </h2>

    <label class="block mb-2">Nome</label>
    <input
      v-model="localPaciente.nome"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Email</label>
    <input
      v-model="localPaciente.email"
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
          v-model="localPaciente.sexo"
          class="mr-1"
        />
        <label for="masculino">Masculino</label>
      </div>
      <div>
        <input
          type="radio"
          id="feminino"
          value="feminino"
          v-model="localPaciente.sexo"
          class="mr-1"
        />
        <label for="feminino">Feminino</label>
      </div>
    </div>

    <label class="block mb-2">Data de Nascimento</label>
    <input
      v-model="localPaciente.dataNascimento"
      type="date"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Altura (cm)</label>
    <input
      v-model="localPaciente.altura"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      @change="calcIMC"
      required
    />

    <label class="block mb-2">Peso (kg)</label>
    <input
      v-model="localPaciente.peso"
      type="text"
      class="border w-full p-2 mb-3 rounded"
      @change="calcIMC"
      required
    />

    <label class="block mb-2">IMC</label>
    <input
      v-model="localPaciente.imc"
      disabled
      type="text"
      class="border w-full p-2 mb-3 rounded"
      required
    />

    <label class="block mb-2">Anamnese</label>
    <textarea
      v-model="localPaciente.anamnese"
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

<style scoped>
:root {
  background-color: #111827;
}
</style>
