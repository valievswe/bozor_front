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
import SectionsView from '../views/manage/SectionsView.vue'
import SaleTypesView from '../views/manage/SaleTypesView.vue'
import AttendanceView from '../views/manage/AttendanceView.vue'
import DailyReportView from '../views/manage/DailyReportView.vue'
import MonthlyReportView from '../views/manage/MonthlyReportView.vue'
import UsersView from '../views/manage/UsersView.vue'
import TransactionsView from '../views/manage/TransactionsView.vue'
import HomeView from '../views/public/HomeView.vue'
import PaymentIdView from '../views/public/PaymentIdView.vue'
import PaymentSelectView from '../views/public/PaymentSelectView.vue'
import PublicPaymentView from '../views/public/PublicPaymentView.vue'
import StallPaymentView from '../views/public/StallPaymentView.vue'

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

  {
    path: '/pay',
    name: 'PaymentId',
    component: PaymentIdView
  },
  {
    path: '/pay/select',
    name: 'PaymentSelect',
    component: PaymentSelectView
  },
  {
    path: '/pay/lease/:leaseId',
    name: 'PublicPayment',
    component: PublicPaymentView,
    props: true
  },
  {
    path: '/pay/stall/:id',
    name: 'StallPayment',
    component: StallPaymentView,
    props: true
  },

  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },

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
        path: 'sections', // Renders at /dashboard/sections
        name: 'sections',
        component: SectionsView
      },
      {
        path: 'sale-types', // Renders at /dashboard/sale-types
        name: 'sale-types',
        component: SaleTypesView
      },
      {
        path: 'attendance', // Renders at /dashboard/attendance
        name: 'attendance',
        component: AttendanceView
      },
      {
        path: 'reports/daily', // Renders at /dashboard/reports/daily
        name: 'daily-report',
        component: DailyReportView
      },
      {
        path: 'reports/monthly', // Renders at /dashboard/reports/monthly
        name: 'monthly-report',
        component: MonthlyReportView
      },
      {
        path: 'users', // Renders at /dashboard/users
        name: 'users',
        component: UsersView
      },
      {
        path: 'transactions', // Renders at /dashboard/transactions
        name: 'transactions',
        component: TransactionsView
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('authToken')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    if (loggedIn && to.name === 'login') {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  }
})

export default router
