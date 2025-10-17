<template>
  <router-view />
</template>

<script>
import { ref, onMounted, provide } from "vue";
import router from "./router";

onMounted(() => {
  router.push("/");
});
</script>
