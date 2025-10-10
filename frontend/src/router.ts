import { createRouter, createWebHashHistory } from "vue-router";
import LayoutPrincipal from "./layouts/LayoutPrincipal.vue";
import TelaLogin from "./view/telas/TelaLogin.vue";
import TelaCadastro from "./view/telas/TelaCadastro.vue";
import TelaHome from "./view/telas/TelaHome.vue";
import TelaExemplo from "./view/telas/TelaExemplo.vue";
import TelaPessoas from "./view/Telas/TelaPessoas.vue";

const routes = [
  { path: "/", name: "login", component: TelaLogin },
  { path: "/cadastro", name: "cadastro", component: TelaCadastro },
  {
    path: "/principal",
    name: "principal",
    component: LayoutPrincipal,
    children: [
      { path: "/home", name: "home", component: TelaHome },
      { path: "/exemplo", name: "exemplo", component: TelaExemplo },
      {
        path: "/pessoas",
        name: "pessoas",
        component: TelaPessoas,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
