<template>
  <div class="payment-container">
    <div class="payment-card">
      <div v-if="isLoading" class="loader">Ma'lumotlar yuklanmoqda...</div>
      <div v-else-if="error" class="error-panel">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Xatolik Yuz Berdi</h2>
        <p>{{ error }}</p>
        <a href="/" class="home-link">Bosh sahifaga qaytish</a>
      </div>

      <div v-else-if="lease">
        <header class="card-header">
          <h2>Ijara To'lovi</h2>
        </header>
        <div class="card-body">
          <div class="info-row">
            <span>Tadbirkor:</span>
            <strong>{{ lease.ownerName }}</strong>
          </div>
          <div class="info-row">
            <span>Obyekt:</span>
            <strong>{{ lease.storeNumber || lease.stallNumber }}</strong>
          </div>
          <div class="info-row" v-if="lease.paymentInterval">
            <span>To'lov Turi:</span>
            <strong>{{ lease.paymentInterval === 'MONTHLY' ? 'Oylik' : 'Kunlik' }}</strong>
          </div>
          <hr />
          <div class="amount-row">
            <span>Kerakli Summa:</span>
            <strong class="total-amount"
              >{{ lease.totalFee.toLocaleString('uz-UZ') }} so'm</strong
            >
          </div>
          <p class="payment-note" v-if="lease.paymentStatus !== 'PAID'">
            <i class="fas fa-info-circle"></i>
            To'lov summasi aynan {{ lease.totalFee.toLocaleString('uz-UZ') }} so'm bo'lishi kerak.
          </p>
        </div>

        <!-- --- START OF THE FIX --- -->
        <footer class="card-footer">
          <!-- Show this block if the lease is ALREADY PAID -->
          <div v-if="lease.paymentStatus === 'PAID'" class="status-paid-panel">
            <div class="paid-icon">✓</div>
            <h3>To'langan</h3>
            <p>Joriy davr uchun to'lov qilingan.</p>
          </div>

          <!-- Show this block if the lease is NOT PAID -->
          <div v-else>
            <button
              @click="handlePayment"
              class="pay-button"
              :disabled="isProcessing"
            >
              <span v-if="!isProcessing">Payme orqali to'lash</span>
              <span v-else>Bajarilmoqda...</span>
            </button>
            <div class="payme-logo">
              <img
                src="https://cdn.paycom.uz/documentation_assets/payme_01.svg"
                alt="Payme Logo"
              />
            </div>
          </div>
        </footer>
        <!-- --- END OF THE FIX --- -->
      </div>
    </div>
  </div>
</template>

<script>
import { paymentService } from '@/services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'PublicPaymentView',
  props: {
    leaseId: { type: String, required: true }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      lease: null,
      isLoading: true,
      isProcessing: false,
      error: null
    }
  },
  // The 'computed' properties are no longer needed as the backend provides the data directly
  methods: {
    async fetchLeaseInfo() {
      this.isLoading = true
      try {
        // The service function name should match what's in your api.js
        const response = await paymentService.getPublicLeaseInfo(this.leaseId)
        this.lease = response.data
      } catch (err) {
        const errorMessage =
          err.response?.data?.error ||
          'Ijara shartnomasi topilmadi yoki yaroqsiz.'
        this.error = errorMessage
        this.toast.error(errorMessage)
        console.error('Failed to fetch lease info:', err)
      } finally {
        this.isLoading = false
      }
    },
    async handlePayment() {
      this.isProcessing = true
      try {
        const payload = {
          leaseId: parseInt(this.leaseId, 10),
          amount: this.lease.totalFee
        }
        const response = await paymentService.initiatePayment(payload)
        this.toast.info("Payme sahifasiga yo'naltirilmoqda...")
        setTimeout(() => {
          window.location.href = response.data.checkoutUrl
        }, 1500)
      } catch (err) {
        // The backend now sends a specific error for already-paid leases
        const errorMessage =
          err.response?.data?.error ||
          "To'lovni boshlashda kutilmagan xatolik yuz berdi."
        this.toast.error(errorMessage)
        this.isProcessing = false
      }
    }
  },
  mounted() {
    this.fetchLeaseInfo()
  }
}
</script>

<style scoped>
.status-paid-panel {
  text-align: center;
  padding: 1rem;
}
.paid-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  background-color: #27ae60;
  color: white;
  margin: 0 auto 1rem;
}
.status-paid-panel h3 {
  margin: 0 0 0.5rem;
  color: #27ae60;
  font-size: 1.5rem;
}
.status-paid-panel p {
  margin: 0;
  color: #555;
}

.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7fa;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
}
.payment-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.card-header {
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.card-header h2 {
  margin: 0;
  font-weight: 600;
}
.card-body {
  padding: 1.5rem;
}
.info-row,
.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #555;
}
.info-row strong,
.amount-row strong {
  color: #2c3e50;
  text-align: right;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
}
.amount-row {
  font-size: 1.3rem;
  font-weight: 500;
}
.total-amount {
  font-weight: bold;
  color: #27ae60;
}
.payment-note {
  margin: 0.75rem 0 0 0;
  padding: 0.75rem;
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  font-size: 0.9rem;
  color: #1565c0;
  border-radius: 4px;
}
.payment-note i {
  margin-right: 0.5rem;
}
.card-footer {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}
.pay-button {
  width: 100%;
  padding: 1rem;
  background-color: #00c853;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.pay-button:hover {
  background-color: #00b248;
}
.pay-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.payme-logo {
  text-align: center;
  margin-top: 1rem;
}
.payme-logo img {
  height: 25px;
  opacity: 0.7;
}
.loader,
.error-panel {
  padding: 3rem 2rem;
  text-align: center;
  color: #7f8c8d;
}
.error-panel h2 {
  color: #c0392b;
  margin-top: 1rem;
}
.error-icon {
  font-size: 3rem;
  color: #c0392b;
}
.home-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
</style>
