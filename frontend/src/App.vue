<template>
  <router-view />
</template>

<script>
import { onMounted } from "vue";
import router from "./router";

onMounted(() => {
  router.push("/");
});
</script>
