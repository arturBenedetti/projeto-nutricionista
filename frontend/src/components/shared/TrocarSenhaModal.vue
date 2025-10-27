<template>
  <div v-if="show" class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header">
        <h2>Trocar Senha</h2>
        <button class="close-btn" @click="closeModal">✖</button>
      </header>
      <section class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="oldPassword">Senha Atual</label>
            <input
              type="password"
              id="oldPassword"
              v-model="form.oldPassword"
              required
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label for="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              v-model="form.newPassword"
              required
              :disabled="loading"
              minlength="6"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              required
              :disabled="loading"
              minlength="6"
            />
          </div>
          <div v-if="error" class="error-message">{{ error }}</div>
        </form>
      </section>
      <footer class="modal-footer">
        <button
          type="button"
          class="btn-secondary"
          @click="closeModal"
          :disabled="loading"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="btn-primary"
          @click="handleSubmit"
          :disabled="loading"
        >
          {{ loading ? "Trocando..." : "Trocar Senha" }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { changePassword } from "../../services/LoginService";
import { loggedUser } from "../../services/UsuarioService";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "success"]);

const show = computed(() => props.modelValue);

const loading = ref(false);
const error = ref("");
const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const user = computed(() => loggedUser.value);

const resetForm = () => {
  form.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  error.value = "";
};

const validateForm = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = "As senhas não coincidem";
    return false;
  }

  /*if (form.value.newPassword.length < 6) {
    error.value = "A nova senha deve ter pelo menos 6 caracteres";
    return false;
  }*/

  return true;
};

const handleSubmit = async () => {
  error.value = "";

  if (!validateForm()) {
    return;
  }

  if (!user.value) {
    error.value = "Usuário não encontrado";
    return;
  }

  loading.value = true;

  try {
    const success = await changePassword({
      id: user.value.id,
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword,
    });

    if (success) {
      emit("success");
      closeModal();
    } else {
      error.value = "Senha atual incorreta ou erro ao trocar senha";
    }
  } catch (err) {
    error.value = "Erro ao trocar senha. Tente novamente.";
    console.error("Erro ao trocar senha:", err);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit("update:modelValue", false);
  resetForm();
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1f2937;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #2f3e53;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ffffff;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.close-btn:hover {
  background-color: #2f3e53;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;  
  font-weight: 500;
  color: #ffffff;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #2f3e53;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input:disabled {
  background-color: #2f3e53;  
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #2f3e53;
  border-radius: 0.375rem;
  border: 1px solid #2f3e53;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #2f3e53;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-secondary {
  background-color: #2f3e53;
  color: #ffffff;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #3e526e;
  color: #ffffff;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary:disabled,
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
