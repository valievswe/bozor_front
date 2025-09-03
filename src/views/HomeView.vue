<template>
  <div class="home">
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="logo">Bozor</span>
      </div>
      <div class="navbar-links">
        <router-link to="/login" class="nav-link">Kirish</router-link>
        <router-link to="/register" class="nav-link register"
          >Ro'yxatdan o'tish</router-link
        >
      </div>
    </nav>
    <main class="content">
      <h1>Assalomu alaykum</h1>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #42b983;
}

.register {
  background-color: #42b983;
  color: white !important;
}

.register:hover {
  background-color: #3aa876;
  color: white;
}

.content {
  flex: 1;
  padding: 2rem;
  text-align: center;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .navbar-links {
    margin-top: 1rem;
    width: 100%;
    justify-content: space-around;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style>
