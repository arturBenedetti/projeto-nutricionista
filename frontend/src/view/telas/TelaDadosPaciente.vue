<script setup>
import { ref, onMounted } from "vue";
import { loggedUser } from "../../services/UsuarioService";

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

onMounted(fetchData);

const localPaciente = ref({
  nome: loggedUser.value.name,
  email: loggedUser.value.email,
  sexo: loggedUser.value.sexo,
  dataNascimento: "",
  altura: "",
  peso: "",
  imc: "",
});

async function fetchData() {  
  const response = await window.api.consultarDados({
    id: loggedUser.value.id,
  });
  
  localPaciente.value.nome = response.nome;
  localPaciente.value.email = response.email;
  localPaciente.value.sexo = response.sexo;
  localPaciente.value.dataNascimento =
    response.dataNascimento.toLocaleDateString("pt-BR");
  localPaciente.value.altura = response.altura;
  localPaciente.value.peso = response.peso;

  calcIMC();
}
</script>

<template>
  <div class="container">
    <h1>
      Dados de <b>{{ localPaciente.nome }}</b>
    </h1>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Nome</label>
        <input
          disabled
          v-model="localPaciente.nome"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Email</label>
        <input
          disabled
          v-model="localPaciente.email"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Sexo</label>
        <input
          disabled
          v-model="localPaciente.sexo"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Data de Nascimento</label>
        <input
          disabled
          v-model="localPaciente.dataNascimento"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-3 md:gap-6">
      <div class="relative z-0 w-full mb-4 group">
        <label class="block mb-2">Altura (cm)</label>
        <input
          disabled
          v-model="localPaciente.altura"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-3 group">
        <label class="block mb-2">Peso (kg)</label>
        <input
          disabled
          v-model="localPaciente.peso"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-3 group">
        <label class="block mb-2">IMC</label>
        <input
          disabled
          v-model="localPaciente.imc"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
    </div>
    <hr class="border-4 border-gray-400" />
  </div>
</template>

<style scoped>
@import "tailwindcss";

.container {
  @apply rounded-2xl p-[20px] bg-[#111827] w-full;
}

h1 {
  color: rgb(180, 180, 250);
  margin-bottom: 10px;
}

label,
input {
  color: white;
}

:root {
  background-color: #111827;
}
</style>
