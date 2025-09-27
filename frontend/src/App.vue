<template>
  <div>
    <TelaLogin v-if="currentScreen === 'login'" @navigate-to-cadastro="navigateToCadastro" />
    <TelaCadastro v-if="currentScreen === 'cadastro'" @navigate-to-login="navigateToLogin" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TelaCadastro from "./view/telas/TelaCadastro.vue";
import TelaLogin from "./view/telas/TelaLogin.vue";

const currentScreen = ref('login');

const navigateToCadastro = () => {
  currentScreen.value = 'cadastro';
};

const navigateToLogin = () => {
  currentScreen.value = 'login';
};
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