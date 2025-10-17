<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="bg-[#111827] p-6 rounded shadow-lg w-80">
      <h2 class="text-lg font-semibold mb-3">{{ title }}</h2>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-center space-x-2">
        <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, message: String });
defineEmits(["confirm", "cancel"]);
</script>
