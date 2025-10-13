<template>
  <div class="register-form">
    <h2>Cadastro de Conta</h2>
    <div class="linha-input">
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
    <button label="Cadastrar" @click="submitForm">Cadastrar</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p class="login-link">
      Já possui uma conta?
      <span @click="navigateToLogin" class="login-link-text">Faça login</span>
    </p>
  </div>
</template>

<script>
import Input from "../../components/inputs/Input.vue";
import Button from "../../components/buttons/Button.vue";
import { useRouter } from "vue-router";

const router = useRouter();

export default {
  name: "Register",
  components: { Input, Button },
  data() {
    return {
      form: {
        name: "",
        email: "",
        user: "",
        password: "",
        confirmPassword: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.name &&
        this.form.email &&
        this.form.user &&
        this.form.password &&
        this.form.password === this.form.confirmPassword
      );
    },
  },
  methods: {
    submitForm() {
      if (!this.isFormValid) {
        this.errorMessage = "Preencha todos os campos corretamente.";
        this.successMessage = "";
        return;
      }

      window.api
        .createUser({
          name: this.form.name,
          email: this.form.email,
          user: this.form.user,
          password: this.form.password,
        })
        .then(() => {
          this.successMessage = `Conta criada com sucesso para ${this.form.name}!`;
          this.errorMessage = "";

          // Limpar o formulário
          this.form.name = "";
          this.form.email = "";
          this.form.user = "";
          this.form.password = "";
          this.form.confirmPassword = "";
        })
        .catch((err) => {
          this.errorMessage = `Erro ao criar conta: ${err.message}`;
          this.successMessage = "";
        });
    },
    navigateToLogin() {
      router.push("/");
    },
  },
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #00b5ad;
  border-radius: 6px;
  box-shadow: 0px 0px 10px #00b5ad;
}

.linha-input {
  padding-bottom: 10px;
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
</style>
