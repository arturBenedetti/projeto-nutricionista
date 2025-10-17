import { createRouter, createWebHashHistory } from "vue-router";
import LayoutPrincipal from "./layouts/LayoutPrincipal.vue";
import TelaLogin from "./view/telas/TelaLogin.vue";
import TelaCadastro from "./view/telas/TelaCadastro.vue";
import TelaHome from "./view/telas/TelaHome.vue";
import TelaPacientes from "./view/Telas/TelaPacientes.vue";
import TelaDadosPaciente from "./view/telas/TelaDadosPaciente.vue";

const routes = [
  { path: "/", name: "login", component: TelaLogin },
  { path: "/cadastro", name: "cadastro", component: TelaCadastro },
  {
    path: "/principal",
    name: "principal",
    component: LayoutPrincipal,
    children: [
      { path: "/home", name: "home", component: TelaHome },
      { path: "/pacientes", name: "pacientes", component: TelaPacientes },
      { path: "/dados-paciente", name: "dados-paciente", component: TelaDadosPaciente },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
