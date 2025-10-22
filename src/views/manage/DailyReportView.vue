<template>
  <div class="daily-report-view">
    <header class="view-header">
      <h1>Kunlik Hisobot</h1>
      <div class="date-picker">
        <label for="reportDate">Sana:</label>
        <input
          id="reportDate"
          type="date"
          v-model="selectedDate"
          @change="fetchReport"
        />
      </div>
    </header>

    <div v-if="isLoading" class="loading-indicator">
      <p>Hisobot yuklanmoqda...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>Xatolik yuz berdi: {{ error }}</p>
      <button @click="fetchReport" class="btn btn-secondary">
        Qaytadan Urinish
      </button>
    </div>

    <div v-else-if="report" class="report-content">
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon income-icon">
            <i class="fa-solid fa-dollar-sign"></i>
          </div>
          <div class="card-info">
            <span class="card-label">Kunlik Tushum</span>
            <span class="card-value">{{ formatCurrency(report.totalIncome) }}</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon transaction-icon">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <div class="card-info">
            <span class="card-label">To'lovlar Soni</span>
            <span class="card-value">{{ report.transactionCount }}</span>
          </div>
        </div>
      </div>

      <div class="card" v-if="report.transactions && report.transactions.length > 0">
        <h3>To'lovlar Ro'yxati</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Vaqt</th>
                <th>Mulkdor</th>
                <th>Obyekt</th>
                <th>Miqdor</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in report.transactions" :key="transaction.id">
                <td>{{ formatTime(transaction.createdAt) }}</td>
                <td>{{ transaction.lease?.owner?.fullName || 'N/A' }}</td>
                <td>{{ getAssetName(transaction.lease) }}</td>
                <td>{{ formatCurrency(transaction.amount) }}</td>
                <td>
                  <span
                    :class="[
                      'status-badge',
                      transaction.status === 'SUCCESS'
                        ? 'status-success'
                        : transaction.status === 'PENDING'
                        ? 'status-pending'
                        : 'status-failed'
                    ]"
                  >
                    {{ getStatusText(transaction.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Bu kun uchun hech qanday to'lov topilmadi.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reportService } from '@/services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'DailyReportView',
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      report: null,
      isLoading: false,
      error: null
    }
  },

  setup() {
    const toast = useToast()
    return { toast }
  },

  methods: {
    async fetchReport() {
      this.isLoading = true
      this.error = null
      try {
        const response = await reportService.getDailyReport(this.selectedDate)
        this.report = response.data
      } catch (err) {
        this.error = "Hisobotni yuklab bo'lmadi."
        this.toast.error("Hisobotni yuklab bo'lmadi.")
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

    formatTime(datetime) {
      return new Date(datetime).toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getAssetName(lease) {
      if (!lease) return 'N/A'
      return (
        lease.store?.storeNumber ||
        lease.stall?.stallNumber ||
        "Noma'lum"
      )
    },

    getStatusText(status) {
      const statusMap = {
        SUCCESS: 'Muvaffaqiyatli',
        PENDING: 'Kutilmoqda',
        FAILED: 'Muvaffaqiyatsiz'
      }
      return statusMap[status] || status
    }
  },

  created() {
    this.fetchReport()
  }
}
</script>

<style scoped>
.daily-report-view {
  width: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-picker label {
  font-weight: 500;
  color: #34495e;
}

.date-picker input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  font-size: 1.8rem;
  padding: 1rem;
  border-radius: 50%;
}

.income-icon {
  color: #27ae60;
  background: #e9f5ee;
}

.transaction-icon {
  color: #3498db;
  background: #e8f4f8;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.card-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow-x: auto;
}

.card h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #2c3e50;
}

.table-container {
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th,
.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.data-table th {
  background-color: #f8f9fa;
  color: #34495e;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

.status-success {
  background-color: #27ae60;
}

.status-pending {
  background-color: #f39c12;
}

.status-failed {
  background-color: #e74c3c;
}

.loading-indicator,
.error-message,
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  color: #7f8c8d;
}

.error-message {
  color: #c0392b;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}

.btn-secondary:hover {
  background-color: #6c7a89;
}

.report-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
