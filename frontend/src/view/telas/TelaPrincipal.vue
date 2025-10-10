<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Projeto Nutricionista</h1>
    </header>

    <div class="app-content">
      <aside class="app-sidebar">
        <ul>
          <li><a href="#/cadastrar-paciente">Cadastrar Paciente</a></li>
          <li><a href="#/cadastrar-dieta">Cadastrar Dieta</a></li>
        </ul>
      </aside>

      <main class="app-main">
        <!-- Conteúdo da página será inserido aqui -->
        <router-view />
      </main>
    </div>

    <footer class="app-footer">
      <p>&copy; 2025 Projeto Nutricionista</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "MainScreen",
  data() {
    return {};
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  padding: 20px;
  text-align: center;
}

.app-content {
  display: flex;
  flex: 1; /* Take up remaining vertical space */
}

.app-sidebar {
  background-color: #575757;
  width: 200px;
  padding: 20px;
}

.app-sidebar ul {
  list-style: none;
  padding: 0;
}

.app-sidebar li {
  margin-bottom: 10px;
}

.app-main {
  flex: 1; /* Take up remaining horizontal space */
  padding: 20px;
}

.app-footer {
  padding: 10px;
  text-align: center;
}
</style>
