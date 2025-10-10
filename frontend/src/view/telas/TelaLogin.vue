<template>
  <div class="container">
    <img src="../../assets/caduceu.png" />
    <p v-if="erroLogin" class="senha-invalida">{{ erroLogin }}</p>
    <div class="forms-login">
      <div class="input-wrapper">
        <Input
          :value="usuario"
          placeholder="Digite seu usuário"
          @update:value="usuario = $event"
          :disabled="carregando"
        />
      </div>
      <div class="input-wrapper">
        <Input
          :value="senha"
          placeholder="Digite sua senha"
          @update:value="senha = $event"
          :disabled="carregando"
          type="password"
        />
      </div>
      <p>
        Não possui uma conta?
        <span @click="navigateToCadastro" class="cadastre-link"
          >Cadastre-se</span
        >
      </p>
    </div>
    <Button
      :label="carregando ? 'Entrando...' : 'Entrar'"
      :color="'teal'"
      :size="'medium'"
      :disabled="carregando || !usuario || !senha"
      @click="handleLogin"
    />
  </div>
</template>

<script setup>
import Button from "../../components/buttons/Button.vue";
import Input from "../../components/inputs/Input.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

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

    if (resultado) {
      // Login bem-sucedido
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