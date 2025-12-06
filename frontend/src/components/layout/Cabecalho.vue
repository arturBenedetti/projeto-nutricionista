<template>
  <div>
    <header class="header">
      <h1>NutriLife</h1>
      <div class="user-section">
        <DropdownMenu class="user-dropdown">
          <template #trigger>
            <div class="user-name-wrapper">
              <span class="user-name">{{ loggedUser.name }}</span>
              <span class="dropdown-icon">▼</span>
            </div>
          </template>
          <DropdownItem @click="openChangePasswordModal">
            Trocar Senha
          </DropdownItem>
        </DropdownMenu>
        <button class="logout-btn" @click="handleLogout">Sair</button>
      </div>
    </header>

    <TrocarSenhaModal
      v-model="showChangePasswordModal"
      @success="handlePasswordChangeSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loggedUser, logout } from "../../services/UsuarioService";
import { useRouter } from "vue-router";
import DropdownMenu from "../shared/DropdownMenu.vue";
import DropdownItem from "../shared/DropdownItem.vue";
import TrocarSenhaModal from "../shared/TrocarSenhaModal.vue";

const router = useRouter();
const showChangePasswordModal = ref(false);

const handleLogout = () => {
  logout();
  router.push("/");
};

const openChangePasswordModal = () => {
  showChangePasswordModal.value = true;
};

const handlePasswordChangeSuccess = () => {
  // Senha trocada com sucesso
  console.log("Senha trocada com sucesso!");
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

.user-dropdown {
  display: inline-block;
}

.user-name-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.15s ease;
}

.user-name-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-weight: normal;
  font-size: 0.9rem;
}

.dropdown-icon {
  font-size: 0.7rem;
  opacity: 0.8;
  transition: transform 0.15s ease;
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
