<template>
  <div class="max-w-md bg-white shadow rounded p-4">
    <h2 class="text-lg font-semibold mb-4">Detalhes do Paciente</h2>
    <p><strong>Nome:</strong> {{ person.nome }}</p>
    <p><strong>CPF:</strong> {{ person.cpf }}</p>

    <div class="flex justify-end mt-4">
      <button @click="$emit('close')" class="px-4 py-2 bg-blue-600 text-white rounded">Fechar</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ person: Object });
</script>
