<template>
  <div class="container">
    <h1>Dados de *aqui vai o nome do paciente*</h1>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Nome</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Email</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
    </div>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Sexo</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Data de Nascimento</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
    </div>
    <div class="grid md:grid-cols-3 md:gap-6">
      <div class="relative z-0 w-full mb-4 group">
        <label class="block mb-2">Altura (cm)</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
      <div class="relative z-0 w-full mb-3 group">
        <label class="block mb-2">Peso (kg)</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
      <div class="relative z-0 w-full mb-3 group">
        <label class="block mb-2">IMC</label>
        <input disabled type="text" class="border w-full p-2 mb-3 rounded" />
      </div>
    </div>
    <hr class="border-4 border-gray-400">
  </div>
</template>

<style scoped>
.container {
  width: 100%;
}

h1 {
  font-family: 'Courier New', Courier, monospace;
  color: blue;
}

label,
input {
  color: black;
}

:root {
  background-color: #111827;
}
</style>