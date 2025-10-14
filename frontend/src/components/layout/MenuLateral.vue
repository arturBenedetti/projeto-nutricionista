<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li>
          <router-link to="/home" exact-active-class="active"
            >🏠 Home</router-link
          >
        </li>
        <li>
          <router-link to="/exemplo" exact-active-class="active"
            >ℹ️ Exemplo</router-link
          >
        </li>
        <li>
          <router-link to="/pacientes" exact-active-class="active"
            >Pacientes</router-link
          >
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: "MenuLateral",
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #111827;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

a {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  color: white;
}

.active {
  color: #3b82f6;
}
</style>
