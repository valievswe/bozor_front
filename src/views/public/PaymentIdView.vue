<template>
  <div class="public-view-container">
    <div class="card">
      <header class="card-header">
        <h2>To'lovni Boshlash</h2>
      </header>
      <div class="card-body">
        <p class="prompt-text">
          Ijaralaringizni topish uchun STIR (INN) yoki telefon raqamingizni
          kiriting.
        </p>
        <form @submit.prevent="findLeases" class="form">
          <div class="form-group">
            <input
              v-model="identifier"
              type="text"
              placeholder="STIR (INN) yoki Telefon Raqami"
              required
              class="form-input"
              autofocus
            />
          </div>
          <button type="submit" class="action-button" :disabled="isLoading">
            <i v-if="!isLoading" class="fas fa-search"></i>
            <span v-if="!isLoading">Ijaralarni Qidirish</span>
            <span v-else>Qidirilmoqda...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { usePaymentStore } from '@/stores/paymentStore'
import { useToast } from 'vue-toastification'

export default {
  name: 'PaymentIdView',
  setup() {
    const paymentStore = usePaymentStore()
    const toast = useToast()
    return { paymentStore, toast }
  },
  data() {
    return {
      identifier: '',
      isLoading: false
    }
  },
  methods: {
    async findLeases() {
      if (!this.identifier.trim()) {
        this.toast.warning("Iltimos, ma'lumot kiriting.")
        return
      }
      this.isLoading = true
      try {
        await this.paymentStore.findLeasesByOwner(this.identifier)
        // On success, navigate to the selection page
        this.$router.push({ name: 'PaymentSelect' })
      } catch (error) {
        this.toast.error(error.message)
      } finally {
        this.isLoading = false
      }
    }
  },
  created() {
    // Clear any previous data when the user starts the flow over
    this.paymentStore.clearLeaseData()
  }
}
</script>

<style scoped>
/* You can create a shared CSS file for these public views */
.public-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7fa;
  padding: 1rem;
}
.card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}
.card-header {
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}
.card-body {
  padding: 2rem;
}
.prompt-text {
  text-align: center;
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.action-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: #27ae60;
  border: none;
  color: white;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.action-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
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
</style>
