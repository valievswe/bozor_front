<template>
  <div class="dashboard-view">
    <header class="view-header">
      <h1>Boshqaruv Paneli</h1>
      <p class="current-date">{{ formattedDate }}</p>

      <button
        class="btn btn-outline"
        @click="handleExport"
        v-if="userRole === 'ADMIN'"
        :disabled="isExporting"
      >
        <i class="fas fa-file-excel"></i>
        <span v-if="!isExporting">Excelga Yuklash</span>
        <span v-else>Yuklanmoqda...</span>
      </button>
    </header>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="dashboard-content">
      <!-- Key Metrics Section -->
      <div class="key-metrics-grid">
        <div class="metric-card main-metric income" v-if="userRole === 'ADMIN'">
          <div class="metric-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="metric-info">
            <span class="metric-label">Shu Oy Tushumi</span>
            <span class="metric-value">{{
              formatCurrency(stats.keyMetrics.monthlyIncome)
            }}</span>
          </div>
        </div>
        <div class="metric-card main-metric debt">
          <div class="metric-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Jami Qarzdorlik</span>
            <span class="metric-value">{{
              formatCurrency(stats.keyMetrics.totalDebt)
            }}</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-file-contract"></i></div>
          <div class="metric-info">
            <span class="metric-label">Faol Ijaralar</span>
            <span class="metric-value">{{
              stats.keyMetrics.activeLeases
            }}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-archive"></i></div>
          <div class="metric-info">
            <span class="metric-label">Arxivdagi Ijaralar</span>
            <span class="metric-value">{{
              stats.keyMetrics.archivedLeases
            }}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-user-friends"></i></div>
          <div class="metric-info">
            <span class="metric-label">Jami Mulkdorlar</span>
            <span class="metric-value">{{ stats.keyMetrics.totalOwners }}</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-store"></i></div>
          <div class="metric-info">
            <span class="metric-label">Jami Obyektlar</span>
            <span class="metric-value">{{ stats.keyMetrics.totalAssets }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid (Chart and Lists) -->
      <div class="main-grid">
        <div class="chart-card" v-if="userRole === 'ADMIN'">
          <h3>Oxirgi 6 Oylik Moliya</h3>
          <Line :data="chartData" :options="chartOptions" />
        </div>

        <div class="list-card">
          <h3>Yaqinda To'langanlar</h3>
          <ul class="activity-list" v-if="stats.recentTransactions && stats.recentTransactions.length > 0">
            <li v-for="tx in stats.recentTransactions" :key="tx.id">
              <span class="activity-owner">{{ tx.lease?.owner?.fullName || 'Noma\'lum' }}</span>
              <span class="activity-amount">{{
                formatCurrency(tx.amount)
              }}</span>
            </li>
          </ul>
          <p v-else class="empty-list">Yaqin orada to'lovlar bo'lmagan.</p>
        </div>

        <div class="list-card">
          <h3>Asosiy Qarzdorlar</h3>
          <ul
            class="activity-list overdue-list"
            v-if="stats.overdueLeases && stats.overdueLeases.length > 0"
          >
            <li v-for="lease in stats.overdueLeases" :key="lease.id">
              <div class="overdue-info">
                <span class="activity-owner">{{ lease.owner?.fullName || 'Noma\'lum' }}</span>
                <span class="activity-asset">{{ getAssetName(lease) }}</span>
              </div>
              <span class="activity-debt" v-if="lease.debt">{{
                formatCurrency(lease.debt)
              }}</span>
            </li>
          </ul>
          <p v-else class="empty-list">Hozirda qarzdorlar yo'q.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reportService, exportService } from '@/services/api'
import AuthService from '@/services/auth'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Filler
} from 'chart.js'

import { useToast } from 'vue-toastification'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Filler
)

export default {
  name: 'DashboardView',
  components: { Line },

  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      stats: {
        keyMetrics: {},
        chartData: [],
        recentTransactions: [],
        overdueLeases: []
      },
      isLoading: true,
      error: null,
      userRole: null,
      isExporting: false
    }
  },
  computed: {
    formattedDate() {
      return new Date().toLocaleDateString('uz-UZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    chartData() {
      // Add null safety check
      if (!this.stats.chartData || !Array.isArray(this.stats.chartData)) {
        return {
          labels: [],
          datasets: []
        }
      }

      const labels = this.stats.chartData.map(d => d.month || '')
      return {
        labels,
        datasets: [
          {
            label: 'Tushum',
            backgroundColor: 'rgba(39, 174, 96, 0.2)',
            borderColor: '#27ae60',
            data: this.stats.chartData.map(d => d.income || 0),
            tension: 0.4,
            fill: true
          },
          {
            label: 'Qarzdorlik',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            borderColor: '#e74c3c',
            data: this.stats.chartData.map(d => d.debt || 0),
            tension: 0.4,
            fill: true
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  methods: {
    async fetchStats() {
      this.isLoading = true
      this.error = null
      try {
        const response = await reportService.getDashboardStats()
        console.log('Dashboard stats response:', response)

        // Validate response structure
        if (!response.data) {
          throw new Error('API ma\'lumot qaytarmadi')
        }

        this.stats = response.data
      } catch (err) {
        console.error('Dashboard stats error:', err)
        console.error('Error response:', err.response)

        // Show specific error message
        if (err.response?.data?.message) {
          this.error = err.response.data.message
          this.toast.error(err.response.data.message)
        } else if (err.response?.status === 401) {
          this.error = 'Tizimga qayta kiring'
          this.toast.error('Autentifikatsiya xatosi. Iltimos qayta kiring.')
        } else if (err.response?.status === 403) {
          this.error = 'Ruxsat yo\'q'
          this.toast.error('Sizda bu ma\'lumotni ko\'rish huquqi yo\'q')
        } else if (err.message) {
          this.error = err.message
          this.toast.error(err.message)
        } else {
          this.error = "Statistikani yuklab bo'lmadi"
          this.toast.error("Statistikani yuklab bo'lmadi")
        }
      } finally {
        this.isLoading = false
      }
    },
    formatCurrency(amount) {
      if (typeof amount !== 'number') return "0 so'm"
      return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS'
      }).format(amount)
    },
    getAssetName(lease) {
      if (!lease) return ''
      return (
        lease.store?.storeNumber ||
        lease.stall?.stallNumber ||
        "Noma'lum Obyekt"
      )
    },

    async handleExport() {
      this.isExporting = true
      try {
        const response = await exportService.exportLeases()

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const today = new Date().toISOString().split('T')[0]
        const fileName = `Faol_Ijaralar_Hisoboti_${today}.xlsx`
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        this.toast.success('Hisobot muvaffaqiyatli yuklandi.')
      } catch (error) {
        console.error('Export failed:', error)

        const errorMessage =
          error.response?.data?.message ||
          "Hisobotni yuklab bo'lmadi. Serverda xatolik yuz berdi."

        this.toast.error(errorMessage)
      } finally {
        this.isExporting = false
      }
    }
  },
  created() {
    const user = AuthService.getUser()
    if (user) {
      this.userRole = user.role
    }
    this.fetchStats()
  }
}
</script>

<style scoped>
/* --- Main View Layout --- */
.dashboard-view {
  padding: 1.5rem 2rem;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Changed from baseline to center for better alignment */
  margin-bottom: 2rem;
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
  gap: 1rem;
}
h1 {
  font-size: 2rem;
  color: #2c3e50;
}
.current-date {
  color: #7f8c8d;
  font-weight: 500;
  font-size: 0.9rem;
}

/* --- Key Metrics Grid --- */
.key-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e0e6ed;
}
.metric-card.main-metric {
  grid-column: span 2;
}
.metric-icon {
  font-size: 1.8rem;
  padding: 1rem;
  border-radius: 50%;
  background: #f4f7f9;
}
.metric-info {
  display: flex;
  flex-direction: column;
}
.metric-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}
.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}
.metric-card.income .metric-icon {
  color: #27ae60;
  background: #e9f5ee;
}
.metric-card.debt .metric-icon {
  color: #e74c3c;
  background: #fbeae5;
}

/* --- Main Content Grid --- */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.chart-card {
  grid-column: 1 / -1;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  height: 450px;
}
.list-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.activity-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f4f7f9;
}
.activity-list li:last-child {
  border-bottom: none;
}
.activity-owner {
  font-weight: 500;
}
.activity-amount {
  font-weight: 600;
  color: #27ae60;
}
.activity-asset {
  color: #7f8c8d;
  font-size: 0.9rem;
}
.activity-debt {
  font-weight: 600;
  color: #e74c3c;
  white-space: nowrap;
}
.overdue-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.overdue-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.empty-list {
  color: #7f8c8d;
}

/* --- UPDATED BUTTON STYLES --- */
.btn {
  /* This can be a base class if you have other buttons */
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
}

.btn-outline {
  background-color: #ffffff;
  color: var(--primary-color, #27ae60);
  border: 2px solid var(--primary-color, #27ae60);
}

.btn-outline:hover {
  background-color: var(--primary-color, #27ae60);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-outline:disabled {
  background-color: #e0e6ed;
  border-color: #e0e6ed;
  color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* --- Responsive Adjustments --- */
@media (min-width: 1200px) {
  .chart-card {
    grid-column: span 1;
    grid-row: span 2;
  }
  .main-grid {
    grid-template-columns: 2fr 1fr;
  }
}
@media (max-width: 992px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  .chart-card {
    grid-column: span 1;
  }
}
@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .key-metrics-grid {
    grid-template-columns: 1fr;
  }
  .metric-card.main-metric {
    grid-column: span 1;
  }
}
</style>
