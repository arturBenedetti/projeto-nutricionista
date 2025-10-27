<template>
  <div class="container">
    <img src="../../assets/caduceu.png" />
    <div class="forms-login">
      <div class="input-wrapper">
        <input type="text" v-model="usuario" placeholder="Digite seu usuário" />
      </div>
      <div class="input-wrapper">
        <input
          class="bg-teal-500/20 border border-teal-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          type="password"
          v-model="senha"
          placeholder="Digite sua senha"
        />
      </div>
      <p v-if="erroLogin" class="senha-invalida">{{ erroLogin }}</p>
      <p>
        Não possui uma conta?
        <span @click="navigateToCadastro" class="cadastre-link"
          >Cadastre-se</span
        >
      </p>
    </div>
    <button
      class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
      @click="handleLogin"
    >
      {{ carregando ? "Entrando..." : "Entrar" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setAuth } from "../../services/UsuarioService";
import { LoginResponseDTO } from "../../services/AuthService";

const router = useRouter();
const usuario = ref("");
const senha = ref("");
const erroLogin = ref("");
const carregando = ref(false);

const handleLogin = async () => {
  if (!usuario.value || !senha.value) {
    erroLogin.value = "Por favor, preencha todos os campos";
    return;
  }

  carregando.value = true;
  erroLogin.value = "";

  try {
    const resultado = await window.api.login({
      user: usuario.value,
      password: senha.value,
    });

    if (resultado && resultado.user && resultado.token && resultado.expiresAt) {
      // Parse expiresAt string to Date
      const expiresAt = new Date(resultado.expiresAt);

      // Login bem-sucedido - salvar user, token e expiração
      setAuth(resultado.user, resultado.token, expiresAt);

      router.push("/principal");
    } else {
      erroLogin.value = "Usuário ou senha inválidos";
    }
  } catch (error) {
    console.error("Erro no login:", error);
    erroLogin.value = "Erro ao fazer login. Tente novamente.";
  } finally {
    carregando.value = false;
  }
};

const navigateToCadastro = () => {
  router.push("/cadastro");
};
</script>

<style scoped>
@import "tailwindcss";

input {
  @apply bg-teal-500/20 border border-teal-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
}

img {
  width: 200px;
  height: 200px;
}

.forms-login {
  padding-bottom: 5px;
}

.input-wrapper {
  margin-bottom: 15px;
}

.forms-login span {
  color: #00b5ad;
}

.cadastre-link {
  cursor: pointer;
  text-decoration: underline;
}

.cadastre-link:hover {
  color: #008a82;
}

.senha-invalida {
  color: red;
  margin: 2px;
}
</style>
