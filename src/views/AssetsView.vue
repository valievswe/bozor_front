<template>
  <div class="assets-view">
    <h1>Do'konlar va Rastalar</h1>
    <p>Qaysi bo'limni boshqarmoqchisiz?</p>
    <div class="navigation-cards">
      <router-link to="/dashboard/stores" class="nav-card">
        <h2>Do'konlar</h2>
        <p>Barcha do'konlarni ko'rish va boshqarish.</p>
      </router-link>
      <router-link to="/dashboard/stalls" class="nav-card">
        <h2>Rastalar</h2>
        <p>Barcha rastalarni ko'rish va boshqarish.</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.assets-view {
  text-align: center;
}
.navigation-cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}
.nav-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 250px;
  text-decoration: none;
  color: #2c3e50;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.nav-card h2 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}
</style>
