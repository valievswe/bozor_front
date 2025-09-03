import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

// Import views directly for clarity in the main app structure
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/Dashboard.vue'
import OwnersView from '../views/OwnersView.vue'
import LeasesView from '../views/LeasesView.vue'
import AssetsView from '../views/AssetsView.vue'
import StoresView from '../views/StoresView.vue'
import StallsView from '../views/StallsView.vue'
import UsersView from '../views/UsersView.vue'
import TransactionsView from '../views/TransactionsView.vue'

const routes = [
  // --- FIX: Redirect root path to login page ---
  {
    path: '/',
    redirect: '/login'
  },

  // --- Public Routes ---
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  // --- FIX: Removed the /register route ---

  // --- FIX: Combined all /dashboard routes into a single, nested structure ---
  {
    path: '/dashboard',
    component: DashboardLayout, // The parent layout for all dashboard pages
    meta: { requiresAuth: true }, // Protect all child routes
    children: [
      {
        path: '', // Renders at /dashboard
        name: 'dashboard', // FIX: Unique name for the main dashboard view
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
