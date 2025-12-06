import { createRouter, createWebHashHistory } from "vue-router"
import LayoutPrincipal from "./layouts/LayoutPrincipal.vue"
import TelaLogin from "./view/telas/TelaLogin.vue"
import TelaCadastro from "./view/telas/TelaCadastro.vue"
import TelaHome from "./view/telas/TelaHome.vue"
import TelaPacientes from "./view/Telas/TelaPacientes.vue"
import TelaDadosPaciente from "./view/telas/TelaDadosPaciente.vue"
import TelaDietas from "./view/telas/TelaDietas.vue"
import TelaMinhaDieta from "./view/telas/TelaMinhaDieta.vue"
import { getLoggedUser, isAuthenticated, logout } from "./services/UsuarioService"
import { AuthService } from "./services/AuthService"

const routes = [
  { 
    path: "/", 
    name: "login", 
    component: TelaLogin,
    meta: { requiresAuth: false }
  },
  { 
    path: "/cadastro", 
    name: "cadastro", 
    component: TelaCadastro,
    meta: { requiresAuth: false }
  },
  {
    path: "/principal",
    name: "principal",
    component: LayoutPrincipal,
    meta: { requiresAuth: true },
    children: [
      { path: "/home", name: "home", component: TelaHome },
      { path: "/pacientes", name: "pacientes", component: TelaPacientes },
      {
        path: "/dados-paciente",
        name: "dados-paciente",
        component: TelaDadosPaciente,
      },
      {
        path: "/minha-dieta",
        name: "minha-dieta",
        component: TelaMinhaDieta,
      },
      { path: "/dietas", name: "dietas", component: TelaDietas },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const loggedUser = getLoggedUser()
  const requiresAuth = to.meta.requiresAuth
  const isAuthValid = isAuthenticated()

  // If route requires auth and user is not logged in or token is expired
  if (requiresAuth && !isAuthValid) {
    // If there was a user but token expired, clear auth
    if (loggedUser && !isAuthValid) {
      logout()
    }
    next("/")
    return
  }
  
  // If user is logged in and tries to access login/cadastro, redirect to home
  if ((to.name === "login" || to.name === "cadastro") && isAuthValid) {
    next("/home")
    return
  }
  
  // Allow navigation
  next()
})

export default router
