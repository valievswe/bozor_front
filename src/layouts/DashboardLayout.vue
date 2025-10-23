<template>
  <div
    class="dashboard-layout"
    :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
  >
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Myrent</h3>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/dashboard" exact-active-class="active"
              >Boshqaruv Paneli</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/owners" active-class="active"
              >Mulkdorlar</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/leases" active-class="active"
              >Ijaralar</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/assets" active-class="active"
              >Do'konlar va Rastalar</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/sections" active-class="active"
              >Bo'limlar</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/sale-types" active-class="active"
              >Savdo Turlari</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/attendance" active-class="active"
              >Davomat</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/reports/daily" active-class="active"
              >Kunlik Hisobot</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/reports/monthly" active-class="active"
              >Oylik Hisobot</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/users" active-class="active"
              >Foydalanuvchilar</router-link
            >
          </li>
          <li>
            <router-link to="/dashboard/transactions" active-class="active"
              >To'lovlar</router-link
            >
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="logout-button">Chiqish</button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="content-wrapper">
      <header class="main-header">
        <button
          @click="toggleSidebar"
          class="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth'

export default {
  name: 'DashboardLayout',
  data() {
    return {
      isSidebarCollapsed: false,
      userRole: authService.getUser()?.role || null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken')
      this.$router.push('/login')
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    }
  }
}
</script>

<style>
:root {
  --sidebar-width: 240px;
  --sidebar-bg: #2c3e50;
  --sidebar-text-color: #bdc3c7;
  --sidebar-text-hover: #ffffff;
  --primary-color: #42b983;
  --content-bg: #f4f7fa;
  --header-height: 60px;
}
</style>

<style scoped>
.dashboard-layout {
  display: flex;
  background-color: var(--content-bg);
}

/* --- Sidebar --- */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 100;
}

.sidebar-header {
  padding: 1.25rem 1.5rem;
  font-size: 1.1rem;
  text-align: center;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid #34495e;
}

.sidebar-nav {
  flex-grow: 1;
  padding-top: 1rem;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav a {
  display: block;
  padding: 0.8rem 1.5rem;
  color: var(--sidebar-text-color);
  text-decoration: none;
  font-size: 0.95rem;
  transition:
    background-color 0.2s,
    color 0.2s;
  border-left: 4px solid transparent;
}

.sidebar-nav a:hover {
  background-color: #34495e;
  color: var(--sidebar-text-hover);
}

.sidebar-nav a.active {
  background-color: rgba(66, 185, 131, 0.1);
  color: var(--primary-color);
  font-weight: 600;
  border-left-color: var(--primary-color);
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #34495e;
}

.logout-button {
  width: 100%;
  padding: 0.6rem;
  background-color: transparent;
  color: var(--sidebar-text-color);
  border: 1px solid #e74c3c;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.logout-button:hover {
  background-color: #e74c3c;
  color: #fff;
}

/* --- Content Area --- */
.content-wrapper {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease-in-out;
}

.main-header {
  height: var(--header-height);
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 50;
}

.main-content {
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* --- Sidebar Toggle Button --- */
.sidebar-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
}
.sidebar-toggle-btn span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #2c3e50;
  border-radius: 2px;
}

/* --- Collapsed State --- */
.dashboard-layout.sidebar-collapsed .sidebar {
  transform: translateX(calc(-1 * var(--sidebar-width)));
}

.dashboard-layout.sidebar-collapsed .content-wrapper {
  margin-left: 0;
}
</style>
