<template>
  <router-view />
  <!-- <div>
    <TelaLogin v-if="currentScreen === 'login'" @navigate-to-cadastro="navigateToCadastro" />
    <TelaCadastro v-if="currentScreen === 'cadastro'" @navigate-to-login="navigateToLogin" />
  </div> -->
</template>

<script>
import { onMounted } from "vue";
import router from "./router";

onMounted(() => {
  // Exemplo: Redirecionar para a tela de login ao iniciar
  router.push("/");
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
