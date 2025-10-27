<template>
  <header class="header">
    <h1>Projeto Nutricionista</h1>
    <div class="user-section">
      <span class="user-name">{{ loggedUser.name }}</span>
      <button class="logout-btn" @click="handleLogout">Sair</button>
    </div>
  </header>
</template>

<script setup>
import { loggedUser, logout } from "../../services/UsuarioService";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  logout();
  router.push("/");
};
</script>

<style scoped>
.header {
  height: 60px;
  background-color: #1f2937;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-weight: bold;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: normal;
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #dc2626;
}
</style>
