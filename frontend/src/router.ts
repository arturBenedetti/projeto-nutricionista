import { createRouter, createWebHashHistory } from "vue-router";
import TelaLogin from "./view/telas/TelaLogin.vue";
import TelaCadastro from "./view/telas/TelaCadastro.vue";
import TelaPrincipal from "./view/telas/TelaPrincipal.vue";

const routes = [
  { path: "/", name: "login", component: TelaLogin },
  { path: "/cadastro", name: "cadastro", component: TelaCadastro },
  { path: "/principal", name: "principal", component: TelaPrincipal },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
