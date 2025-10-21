<template>
  <div class="stall-payment-view">
    <div class="payment-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="fa-solid fa-circle-exclamation"></i>
        <h2>Xatolik</h2>
        <p>{{ error }}</p>
        <button class="btn btn-secondary" @click="$router.push('/')">
          Bosh sahifaga qaytish
        </button>
      </div>

      <div v-else-if="stall" class="payment-content">
        <div class="payment-header">
          <h1>Rasta To'lovi</h1>
          <div class="stall-info-card">
            <div class="info-row">
              <span class="label">Rasta raqami:</span>
              <span class="value">{{ stall.stallNumber }}</span>
            </div>
            <div v-if="stall.Section" class="info-row">
              <span class="label">Bo'lim:</span>
              <span class="value">{{ stall.Section.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Maydoni:</span>
              <span class="value">{{ stall.area }} m²</span>
            </div>
            <div class="info-row highlight">
              <span class="label">Kunlik to'lov:</span>
              <span class="value">{{ Number(stall.dailyFee).toLocaleString() }} so'm</span>
            </div>
          </div>
        </div>

        <div v-if="alreadyPaid" class="success-message">
          <i class="fa-solid fa-circle-check"></i>
          <h3>Bugungi to'lov amalga oshirilgan</h3>
          <p>Siz bugun uchun allaqachon to'lovni amalga oshirgansiz.</p>
          <p class="paid-date">Sana: {{ new Date().toLocaleDateString('uz-UZ') }}</p>
        </div>

        <div v-else class="payment-section">
          <h2>Bugungi kun uchun to'lov</h2>
          <p class="payment-description">
            Quyidagi tugmani bosib, bugungi kun uchun rasta to'lovini amalga oshiring.
          </p>

          <div class="payment-amount-box">
            <span class="amount-label">To'lov miqdori:</span>
            <span class="amount-value">{{ Number(stall.dailyFee).toLocaleString() }} so'm</span>
          </div>

          <div class="payment-actions">
            <button
              class="btn btn-primary btn-large"
              @click="initiatePayment"
              :disabled="processingPayment"
            >
              <i class="fa-solid fa-credit-card"></i>
              {{ processingPayment ? 'Kutilmoqda...' : 'To\'lovga o\'tish' }}
            </button>
          </div>

          <div class="payment-info">
            <p><i class="fa-solid fa-info-circle"></i> To'lov xavfsiz tizim orqali amalga oshiriladi</p>
            <p><i class="fa-solid fa-shield-halved"></i> Ma'lumotlaringiz himoyalangan</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default {
  name: 'StallPaymentView',
  data() {
    return {
      stall: null,
      loading: true,
      error: null,
      alreadyPaid: false,
      processingPayment: false
    }
  },
  async created() {
    await this.loadStallData()
  },
  methods: {
    async loadStallData() {
      try {
        const stallId = this.$route.params.id

        const response = await axios.get(`${API_BASE_URL}/payments/public/stalls/${stallId}`)

        this.stall = response.data.stall
        this.alreadyPaid = response.data.alreadyPaid

      } catch (err) {
        this.error = err.response?.data?.message || 'Rasta ma\'lumotlari yuklanmadi'
      } finally {
        this.loading = false
      }
    },
    async initiatePayment() {
      if (this.processingPayment) return

      this.processingPayment = true

      try {
        const stallId = this.$route.params.id

        const response = await axios.post(
          `${API_BASE_URL}/payments/public/stalls/${stallId}/pay`,
          {}
        )

        if (response.data.success && response.data.checkoutUrl) {
          // Redirect to payment gateway
          window.location.href = response.data.checkoutUrl
        } else {
          throw new Error('To\'lov havolasi olinmadi')
        }
      } catch (err) {
        alert(err.response?.data?.message || 'To\'lovni boshlashda xatolik yuz berdi')
        this.processingPayment = false
      }
    }
  }
}
</script>

<style scoped>
.stall-payment-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.payment-container {
  max-width: 600px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  background-color: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state i {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.payment-content {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.payment-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
}

.payment-header h1 {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
}

.stall-info-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.info-row.highlight {
  background-color: rgba(255, 255, 255, 0.15);
  margin: 0 -1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.info-row .label {
  opacity: 0.9;
}

.info-row .value {
  font-weight: 700;
}

.success-message {
  padding: 2rem;
  text-align: center;
  color: #27ae60;
}

.success-message i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.paid-date {
  margin-top: 1rem;
  font-weight: 600;
  color: #7f8c8d;
}

.payment-section {
  padding: 2rem;
}

.payment-section h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.payment-description {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.payment-amount-box {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.amount-label {
  color: #2e7d32;
  font-weight: 600;
}

.amount-value {
  color: #1b5e20;
  font-size: 1.8rem;
  font-weight: 700;
}

.payment-actions {
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-large {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-large i {
  margin-right: 0.5rem;
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}

.payment-info {
  border-top: 1px solid #ecf0f1;
  padding-top: 1rem;
}

.payment-info p {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
