import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

// Import views directly for clarity in the main app structure
import LoginView from '../views/public/LoginView.vue'
import DashboardView from '../views/public/Dashboard.vue'
import OwnersView from '../views/manage/OwnersView.vue'
import LeasesView from '../views/manage/LeasesView.vue'
import AssetsView from '../views/public/AssetsView.vue'
import StoresView from '../views/manage/StoresView.vue'
import StallsView from '../views/manage/StallsView.vue'
import UsersView from '../views/manage/UsersView.vue'
import TransactionsView from '../views/manage/TransactionsView.vue'
import HomeView from '../views/public/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  // --- Public Routes ---
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },

  // ---  Combined all /dashboard routes into a single, nested structure ---
  {
    path: '/dashboard',
    component: DashboardLayout, // The parent layout for all dashboard pages
    meta: { requiresAuth: true }, // Protect all child routes
    children: [
      {
        path: '', // Renders at /dashboard
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'owners', // Renders at /dashboard/owners
        name: 'owners',
        component: OwnersView
      },
      {
        path: 'leases', // Renders at /dashboard/leases
        name: 'leases',
        component: LeasesView
      },
      {
        path: 'assets', // Renders at /dashboard/assets
        name: 'assets',
        component: AssetsView
      },
      {
        path: 'stores', // Renders at /dashboard/stores
        name: 'stores',
        component: StoresView
      },
      {
        path: 'stalls', // Renders at /dashboard/stalls
        name: 'stalls',
        component: StallsView
      },
      {
        path: 'users', // Renders at /dashboard/users
        name: 'users', // FIX: Only one definition for this name
        component: UsersView
      },
      {
        path: 'transactions', // Renders at /dashboard/transactions
        name: 'transactions',
        component: TransactionsView
      }
    ]
  },

  // --- Catch-all route for 404 Not Found, redirecting to login ---
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Your navigation guard is correct and does not need changes.
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('authToken')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // Optional: If a logged-in user tries to visit the login page, redirect them to the dashboard
    if (loggedIn && to.name === 'login') {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  }
})

export default router
