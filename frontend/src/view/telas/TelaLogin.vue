<template>
  <div class="container">
    <img src="../../assets/caduceu.png" />
    <p v-if="false" class="senha-invalida">Usuário ou senha inválidos</p>
    <div class="forms-login">
      <div class="input-wrapper">
        <Input
          :value="usuario"
          placeholder="Digite seu usuário"
          @update:value="usuario = $event"
          :disabled="false"
        />
      </div>
      <div class="input-wrapper">
        <Input
          :value="senha"
          placeholder="Digite sua senha"
          @update:value="senha = $event"
          :disabled="false"
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
      label="Entrar 1"
      :color="'teal'"
      :size="'medium'"
      :disabled="false"
      @click="handleSave"
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

const handleSave = () => {
  const ret = window.api.login({
    user: usuario.value,
    password: senha.value,
  });
  router.push("/principal");
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