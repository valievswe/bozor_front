<template>
  <div class="payment-container">
    <div class="payment-card">
      <div v-if="isLoading" class="loader">Ma'lumotlar yuklanmoqda...</div>
      
      <div v-else-if="error" class="error-panel">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <h2>Xatolik Yuz Berdi</h2>
        <p>{{ error }}</p>
        <a href="/" class="home-link">Bosh sahifaga qaytish</a>
      </div>

      <div v-else-if="lease">
        <header class="card-header">
          <h2>Ijara To'lovi</h2>
        </header>
        <div class="card-body">
          <div class="info-row"><span>Tadbirkor:</span><strong>{{ lease.ownerName }}</strong></div>
          <div class="info-row"><span>Obyekt:</span><strong>{{ lease.storeNumber || lease.stallNumber }}</strong></div>
          <div class="info-row" v-if="lease.paymentInterval">
            <span>To'lov Turi:</span>
            <strong>{{ lease.paymentInterval === 'MONTHLY' ? 'Oylik' : 'Kunlik' }}</strong>
          </div>
          <hr />
          <div class="amount-row">
            <span>Kerakli Summa:</span>
            <strong class="total-amount">{{ lease.totalFee.toLocaleString('uz-UZ') }} so'm</strong>
          </div>
          <p class="payment-note" v-if="lease.paymentStatus !== 'PAID'">
            <i class="fas fa-info-circle"></i>
            To'lov summasi aynan {{ lease.totalFee.toLocaleString('uz-UZ') }} so'm bo'lishi kerak.
          </p>
        </div>

        <footer class="card-footer">
          <div v-if="lease.paymentStatus === 'PAID'" class="status-paid-panel">
            <div class="paid-icon">✓</div>
            <h3>To'langan</h3>
            <p>Joriy davr uchun to'lov qilingan.</p>
          </div>
          
          <div v-else class="payment-buttons-container">
            <p class="payment-select-label">To'lov usulini tanlang:</p>
            <button @click="handlePayment('PAYME')" class="pay-button payme" :disabled="isProcessing">
              <span v-if="!isProcessing || selectedProvider !== 'PAYME'">Payme orqali</span>
              <span v-else>Bajarilmoqda...</span>
            </button>
            <button @click="handlePayment('CLICK')" class="pay-button click" :disabled="isProcessing">
              <span v-if="!isProcessing || selectedProvider !== 'CLICK'">Click orqali</span>
              <span v-else>Bajarilmoqda...</span>
            </button>
          </div>
        </footer>
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
    leaseId: {
      type: String,
      required: true,
    },
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
      selectedProvider: null,
      error: null,
    }
  },
  watch: {
    // This watcher correctly handles the prop from the router
    leaseId: {
      handler(newId) {
        if (newId && newId !== 'null' && newId !== 'undefined') {
          this.fetchLeaseInfo(newId);
        } else {
          this.error = 'URL manzilda ijara ID topilmadi.';
          this.isLoading = false;
          this.toast.error(this.error);
        }
      },
      immediate: true, 
    },
  },
  methods: {
    async fetchLeaseInfo(id) {
      this.isLoading = true;
      try {
        const response = await paymentService.getPublicLeaseInfo(id);
        this.lease = response.data;
        if (this.lease.paymentStatus === 'PAID') {
          this.toast.info("Bu ijara uchun to'lov allaqachon amalga oshirilgan.");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Ijara shartnomasi topilmadi yoki yaroqsiz.';
        this.error = errorMessage;
        this.toast.error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    async handlePayment(provider) {
      this.isProcessing = true;
      this.selectedProvider = provider;
      try {
        const leaseIdNum = parseInt(this.leaseId, 10);
        if (isNaN(leaseIdNum) || leaseIdNum <= 0) {
          throw new Error('Ijara ID yaroqsiz');
        }
        if (!this.lease || typeof this.lease.totalFee !== 'number' || this.lease.totalFee < 0) {
          throw new Error("To'lov summasi yaroqsiz");
        }

        const payload = {
          leaseId: leaseIdNum,
          amount: this.lease.totalFee,
          provider: provider.toUpperCase(),
        };

        const response = await paymentService.initiatePayment(payload);
        const checkoutUrl = response.data?.checkoutUrl;
        if (!checkoutUrl) {
          throw new Error("To'lov URL topilmadi");
        }

        this.toast.info("To'lov sahifasiga yo'naltirilmoqda...");
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 1500);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || "To'lovni boshlashda kutilmagan xatolik.";
        this.toast.error(errorMessage);
        this.isProcessing = false;
        this.selectedProvider = null;
      }
    },
  },
  // The created() hook is no longer needed as the watcher replaces it.
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
