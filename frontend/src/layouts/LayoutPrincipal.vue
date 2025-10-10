<template>
  <div class="app-layout">
    <Cabecalho />

    <div class="main-content">
      <MenuLateral />

      <main class="page-content">
        <router-view />
      </main>
    </div>

    <Rodape />
  </div>
</template>

<script setup>
import Cabecalho from "../components/Cabecalho.vue";
import MenuLateral from "../components/MenuLateral.vue";
import Rodape from "../components/Rodape.vue";
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.page-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #f3f4f6;
  overflow-y: auto;
}
</style>
