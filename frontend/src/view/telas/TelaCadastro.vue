<template>
  <div class="register-form">
    <h2>Cadastro de Conta</h2>
    <div>
      <input
        label="Nome Completo"
        placeholder="Digite seu nome"
        v-model="form.name"
      />
    </div>
    <div class="linha-input">
      <input
        label="Email"
        type="email"
        placeholder="Digite seu email"
        v-model="form.email"
      />
    </div>
    <div class="linha-input">
      <input
        label="Usuário"
        type="user"
        placeholder="Escolha um usuário"
        v-model="form.user"
      />
    </div>
    <div class="linha-input">
      <input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        v-model="form.password"
      />
    </div>
    <div class="linha-input">
      <input
        label="Confirmar Senha"
        type="password"
        placeholder="Confirme sua senha"
        v-model="form.confirmPassword"
      />
    </div>
    <div class="linha-input checkbox-container">
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="form.isPaciente"
          class="checkbox-input"
        />
        <span class="checkbox-text">Sou um paciente</span>
      </label>
    </div>
    <button label="Cadastrar" @click="submitForm">Cadastrar</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p class="login-link">
      Já possui uma conta?
      <span @click="navigateToLogin" class="login-link-text">Faça login</span>
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");
const form = ref({
  name: "",
  email: "",
  user: "",
  password: "",
  confirmPassword: "",
  isPaciente: false,
});

const isFormValid = () => {
  return (
    form.value.name &&
    form.value.email &&
    form.value.user &&
    form.value.password &&
    form.value.password === form.value.confirmPassword
  );
};

const submitForm = () => {
  if (!isFormValid()) {
    errorMessage.value = "Preencha todos os campos corretamente.";
    successMessage.value = "";
    return;
  }

  window.api
    .createUser({
      name: form.value.name,
      email: form.value.email,
      user: form.value.user,
      password: form.value.password,
      isPaciente: form.value.isPaciente,
    })
    .then(() => {
      successMessage.value = `Conta criada com sucesso para ${form.value.name}!`;
      errorMessage.value = "";

      // Limpar o formulário
      form.value.name = "";
      form.value.email = "";
      form.value.user = "";
      form.value.password = "";
      form.value.confirmPassword = "";
      form.value.isPaciente = false;
    })
    .catch((err) => {
      errorMessage.value = `Erro ao criar conta: ${err.message}`;
      successMessage.value = "";
    });
};

const navigateToLogin = () => {
  router.push("/");
};
</script>

<style scoped>
@import "tailwindcss";

.register-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #00b5ad;
  border-radius: 6px;
  box-shadow: 0px 0px 10px #00b5ad;
}

input {
  @apply bg-teal-500/20 border border-teal-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent gap-1;
}
.linha-input {
  margin-top: 15px;
}
button {
  margin-top: 15px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  color: #666;
}

.login-link-text {
  color: #00b5ad;
  cursor: pointer;
  text-decoration: underline;
}

.login-link-text:hover {
  color: #008a82;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.checkbox-input {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #00b5ad;
}

.checkbox-text {
  user-select: none;
}
</style>
