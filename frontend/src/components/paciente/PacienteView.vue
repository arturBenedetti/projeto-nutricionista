<template>
  <div class="bg-[#111827] shadow rounded p-4">
    <h2 class="text-lg font-semibold mb-4">Detalhes do Paciente</h2>
    <p><strong>Nome:</strong> {{ paciente.nome }}</p>
    <p><strong>Email:</strong> {{ paciente.email }}</p>
    <p><strong>Sexo:</strong> {{ paciente.sexo }}</p>
    <p>
      <strong>Data de Nascimento:</strong>
      {{ paciente.dataNascimento.toLocaleDateString("pt-BR") }}
    </p>
    <p><strong>Altura:</strong> {{ paciente.altura }}</p>
    <p><strong>Peso:</strong> {{ paciente.peso }}</p>
    <p><strong>IMC:</strong> {{ paciente.imc.toFixed(2) }}</p>
    <p><strong>Anamnese:</strong> {{ paciente.anamnese }}</p>

    <div class="flex justify-center mt-4">
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Fechar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ paciente: Object });
</script>
