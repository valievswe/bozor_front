<template>
  <div class="attendance-view">
    <header class="view-header">
      <h1>Davomat Boshqaruvi</h1>
      <button class="btn btn-primary" @click="handleBulkCreate">
        <span class="icon">+</span> Barcha Rastalarga Belgilash
      </button>
    </header>

    <!-- Date Navigation -->
    <div class="date-navigation">
      <button class="btn-icon" @click="navigateDate(-1)" title="Oldingi kun">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <input
        type="date"
        v-model="selectedDate"
        @change="fetchAttendanceByDate"
        class="date-picker"
      />
      <button class="btn-icon" @click="navigateDate(1)" title="Keyingi kun">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <button class="btn btn-secondary" @click="goToToday">Bugun</button>
    </div>

    <!-- Statistics Summary -->
    <div class="stats-summary" v-if="!isLoading && attendanceData.length > 0">
      <div class="stat-card">
        <span class="stat-label">Jami Rastalar:</span>
        <span class="stat-value">{{ totalStalls }}</span>
      </div>
      <div class="stat-card stat-paid">
        <span class="stat-label">To'langan:</span>
        <span class="stat-value">{{ paidCount }}</span>
      </div>
      <div class="stat-card stat-unpaid">
        <span class="stat-label">To'lanmagan:</span>
        <span class="stat-value">{{ unpaidCount }}</span>
      </div>
      <div class="stat-card stat-unmarked">
        <span class="stat-label">Belgilanmagan:</span>
        <span class="stat-value">{{ unmarkedCount }}</span>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-if="!isLoading && attendanceData.length > 0">
      <button
        class="btn btn-success"
        @click="handleMarkAllPaid"
        :disabled="unpaidCount === 0"
      >
        <i class="fa-solid fa-check-double"></i> Hammasini To'langan Deb Belgilash
      </button>
    </div>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
        <button @click="fetchAttendanceByDate" class="btn btn-secondary">
          Qaytadan Urinish
        </button>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rasta</th>
              <th>Bo'lim</th>
              <th>Savdo Turi</th>
              <th>Holat</th>
              <th>Kunlik To'lov</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="attendanceData.length > 0">
            <tr v-for="item in attendanceData" :key="item.stallId">
              <td>{{ item.stallNumber }}</td>
              <td>{{ item.section }}</td>
              <td>{{ item.saleType }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    item.status === 'PAID'
                      ? 'status-paid'
                      : item.status === 'UNPAID'
                        ? 'status-unpaid'
                        : 'status-unmarked'
                  ]"
                >
                  {{
                    item.status === 'PAID'
                      ? "To'langan"
                      : item.status === 'UNPAID'
                        ? "To'lanmagan"
                        : 'Belgilanmagan'
                  }}
                </span>
              </td>
              <td>{{ Number(item.amount).toLocaleString() }} so'm</td>
              <td class="actions">
                <button
                  v-if="!item.status"
                  class="btn-action btn-mark"
                  @click="handleMarkStall(item)"
                  title="Belgilash"
                >
                  <i class="fa-solid fa-check"></i> Belgilash
                </button>
                <button
                  v-if="item.status === 'UNPAID' && isToday"
                  class="btn-action btn-pay"
                  @click="handlePayStall(item)"
                  title="To'lash (faqat onlayn)"
                >
                  <i class="fa-solid fa-qrcode"></i> To'lash
                </button>
                <span
                  v-if="item.status === 'UNPAID' && !isToday"
                  class="status-note unpaid-note"
                >
                  Faqat bugun to'lash mumkin
                </span>
                <button
                  v-if="item.attendanceId"
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteAttendance(item)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">
                Bu sana uchun ma'lumotlar topilmadi.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="paymentModal.visible" class="modal-overlay" @click.self="closePaymentModal">
      <div class="modal-content payment-modal">
        <div class="modal-header">
          <h2>To'lov Qilish</h2>
          <button class="btn-close" @click="closePaymentModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="paymentModal.isGenerating" class="loading-indicator">
            <p>To'lov havolasi yaratilmoqda...</p>
          </div>

          <div v-else class="payment-details">
            <div class="stall-info">
              <h3>Rasta: {{ paymentModal.stall?.stallNumber }}</h3>
              <p>Summa: {{ Number(paymentModal.stall?.amount).toLocaleString() }} so'm</p>
              <p>Sana: {{ selectedDate }}</p>
            </div>

            <div class="qr-code-container" v-if="paymentModal.qrCodeDataUrl">
              <img :src="paymentModal.qrCodeDataUrl" alt="QR Code" class="qr-code" />
              <p class="qr-instruction">
                Ushbu QR kodni Click ilovasida skanerlang yoki quyidagi tugmani bosing
              </p>
            </div>

            <div class="payment-actions">
              <button class="btn btn-primary btn-large" @click="openPaymentUrl">
                <i class="fa-solid fa-external-link-alt"></i> Click orqali to'lash
              </button>
              <button class="btn btn-secondary" @click="closePaymentModal">
                Yopish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { attendanceService, stallPaymentService } from '@/services/api'
import { useToast } from 'vue-toastification'
import QRCode from 'qrcode'

export default {
  name: 'AttendanceView',
  data() {
    return {
      attendanceData: [],
      selectedDate: this.getTodayDate(),
      isLoading: false,
      error: null,
      paymentModal: {
        visible: false,
        stall: null,
        paymentUrl: null,
        qrCodeDataUrl: null,
        isGenerating: false
      }
    }
  },

  setup() {
    const toast = useToast()
    return { toast }
  },

  computed: {
    totalStalls() {
      return this.attendanceData.length
    },
    paidCount() {
      return this.attendanceData.filter((item) => item.status === 'PAID').length
    },
    unpaidCount() {
      return this.attendanceData.filter((item) => item.status === 'UNPAID').length
    },
    unmarkedCount() {
      return this.attendanceData.filter((item) => !item.status).length
    },
    isToday() {
      return this.selectedDate === this.getTodayDate()
    }
  },

  methods: {
    getTodayDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },

    goToToday() {
      this.selectedDate = this.getTodayDate()
      this.fetchAttendanceByDate()
    },

    navigateDate(days) {
      const currentDate = new Date(this.selectedDate)
      currentDate.setDate(currentDate.getDate() + days)
      this.selectedDate = currentDate.toISOString().split('T')[0]
      this.fetchAttendanceByDate()
    },

    async fetchAttendanceByDate() {
      this.isLoading = true
      this.error = null
      try {
        const response = await attendanceService.getByDate(this.selectedDate)
        this.attendanceData = response.data || []
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
        this.toast.error("Ma'lumotlarni yuklab bo'lmadi.")
        console.error('Failed to fetch attendance:', err)
      } finally {
        this.isLoading = false
      }
    },

    async handleBulkCreate() {
      if (
        !confirm(
          `${this.selectedDate} sanasi uchun barcha rastalarga davomat belgilansinmi?`
        )
      ) {
        return
      }

      try {
        await attendanceService.bulkCreate(this.selectedDate)
        await this.fetchAttendanceByDate()
        this.toast.success('Barcha rastalar uchun davomat belgilandi!')
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Davomat belgilashda xatolik yuz berdi."
        this.toast.error(errorMessage)
        console.error('Failed to bulk create:', err)
      }
    },

    async handleMarkStall(item) {
      try {
        await attendanceService.createAttendance(item.stallId)
        await this.fetchAttendanceByDate()
        this.toast.success("Davomat belgilandi!")
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Davomat belgilashda xatolik yuz berdi."
        this.toast.error(errorMessage)
      }
    },

    async handlePayStall(item) {
      // Check if attendance exists
      if (!item.attendanceId) {
        this.toast.error("Avval davomatni belgilang")
        return
      }

      // Check if it's today
      if (!this.isToday) {
        this.toast.warning("Faqat bugungi kun uchun to'lash mumkin")
        return
      }

      // Generate payment URL and QR code
      this.paymentModal.isGenerating = true
      this.paymentModal.visible = true
      this.paymentModal.stall = item

      try {
        const response = await stallPaymentService.initiatePayment(item.stallId, 'CLICK')
        this.paymentModal.paymentUrl = response.data.checkoutUrl

        // Generate QR code
        this.paymentModal.qrCodeDataUrl = await QRCode.toDataURL(
          response.data.checkoutUrl,
          { width: 300, margin: 2 }
        )

        this.paymentModal.isGenerating = false
      } catch (err) {
        this.paymentModal.isGenerating = false
        this.paymentModal.visible = false
        let errorMessage = "To'lov havolasi yaratishda xatolik yuz berdi."

        if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error
        }

        this.toast.error(errorMessage)
        console.error('Payment initiation error:', err)
      }
    },

    closePaymentModal() {
      this.paymentModal.visible = false
      this.paymentModal.stall = null
      this.paymentModal.paymentUrl = null
      this.paymentModal.qrCodeDataUrl = null
      // Refresh data to check if payment was made
      this.fetchAttendanceByDate()
    },

    openPaymentUrl() {
      if (this.paymentModal.paymentUrl) {
        window.open(this.paymentModal.paymentUrl, '_blank')
      }
    },

    async handleMarkAllPaid() {
      if (
        !confirm(
          `${this.selectedDate} sanasi uchun barcha to'lanmagan davomatlarni to'langan deb belgilashni xohlaysizmi?`
        )
      ) {
        return
      }

      try {
        await attendanceService.markAllPaid(this.selectedDate)
        await this.fetchAttendanceByDate()
        this.toast.success("Barcha to'lanmagan davomatlar to'langan deb belgilandi!")
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Yangilashda xatolik yuz berdi."
        this.toast.error(errorMessage)
        console.error('Failed to mark all paid:', err)
      }
    },

    async handleDeleteAttendance(item) {
      if (!confirm(`Haqiqatan ham bu davomat yozuvini o'chirmoqchimisiz?`)) {
        return
      }

      try {
        await attendanceService.deleteAttendance(item.attendanceId)
        await this.fetchAttendanceByDate()
        this.toast.success("Davomat o'chirildi!")
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Davomatni o'chirishda xatolik yuz berdi."
        this.toast.error(errorMessage)
      }
    }
  },

  created() {
    this.fetchAttendanceByDate()
  }
}
</script>

<style scoped>
.attendance-view {
  width: 100%;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Date Navigation */
.date-navigation {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.date-picker {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
}

.date-picker:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* Statistics Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: #fff;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #95a5a6;
}

.stat-card.stat-paid {
  border-left-color: #27ae60;
}

.stat-card.stat-unpaid {
  border-left-color: #e74c3c;
}

.stat-card.stat-unmarked {
  border-left-color: #95a5a6;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

/* Bulk Actions */
.bulk-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3aa876;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.2);
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}

.btn-secondary:hover {
  background-color: #6c7a7b;
}

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #229954;
  box-shadow: 0 4px 8px rgba(39, 174, 96, 0.2);
}

.btn .icon {
  margin-right: 0.5rem;
}

.btn-icon {
  background: none;
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 5px;
  font-size: 1rem;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  color: #34495e;
}

.btn-icon:hover {
  background-color: #ecf0f1;
  border-color: var(--primary-color);
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow-x: auto;
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

.status-paid {
  background-color: #27ae60;
}

.status-unpaid {
  background-color: #e74c3c;
}

.status-unmarked {
  background-color: #95a5a6;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-action {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: white;
}

.btn-mark {
  background-color: #3498db;
}

.btn-mark:hover {
  background-color: #2980b9;
}

.btn-pay {
  background-color: #27ae60;
}

.btn-pay:hover {
  background-color: #229954;
}

.status-note {
  padding: 0.5rem 0.75rem;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 500;
}

.unpaid-note {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  color: #e74c3c;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #fbeae5;
}

.text-center {
  text-align: center;
}

.loading-indicator,
.error-message {
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
}

.error-message {
  color: #c0392b;
}

/* Payment Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 2rem;
}

.payment-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stall-info {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stall-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.stall-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #34495e;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: white;
  border: 2px dashed #3498db;
  border-radius: 8px;
}

.qr-code {
  width: 300px;
  height: 300px;
  margin-bottom: 1rem;
}

.qr-instruction {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.payment-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-large {
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>
