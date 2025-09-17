<template>
  <div class="public-view-container">
    <div class="service-card">
      <header class="card-header">
        <h2>Ijarani Tanlang</h2>
      </header>
      <div class="card-body">
        <p class="prompt-text">
          Qaysi ijara shartnomasi uchun to'lov qilmoqchisiz?
        </p>
        <div class="lease-list">
          <div
            v-for="lease in leases"
            :key="lease.id"
            class="lease-item"
            @click="selectLease(lease.id)"
          >
            <div class="item-info">
              <i class="fas fa-file-contract"></i>
              <strong>{{ getAssetName(lease) }}</strong>
            </div>
            <span class="item-amount"
              >{{ calculateTotalFee(lease).toLocaleString('uz-UZ') }} so'm</span
            >
          </div>
        </div>
        <div class="back-link-container">
          <router-link to="/pay" class="back-link"
            >&larr; Qaytadan qidirish</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePaymentStore } from '@/stores/paymentStore'

export default {
  name: 'PaymentSelectView',
  setup() {
    const paymentStore = usePaymentStore()
    // Get the list of leases from the store
    return { leases: paymentStore.foundLeases }
  },
  methods: {
    getAssetName(lease) {
      return lease.store?.storeNumber || lease.stall?.stallNumber || "Noma'lum"
    },
    calculateTotalFee(lease) {
      return (
        (Number(lease.shopMonthlyFee) || 0) +
        (Number(lease.stallMonthlyFee) || 0) +
        (Number(lease.guardFee) || 0)
      )
    },
    selectLease(leaseId) {
      // Navigate to the final confirmation page that you have already built
      this.$router.push({ name: 'PublicPayment', params: { leaseId } })
    }
  },
  beforeRouteEnter(to, from, next) {
    const paymentStore = usePaymentStore()
    // This is a security measure. It prevents users from directly accessing
    // this page without first finding leases on the previous page.
    if (paymentStore.foundLeases && paymentStore.foundLeases.length > 0) {
      next()
    } else {
      // If no leases were found, redirect back to the search page.
      next({ name: 'PaymentId' })
    }
  }
}
</script>

<style scoped>
.public-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7fa;
  padding: 1rem;
}
.service-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.card-header h2 {
  margin: 0;
}
.card-body {
  padding: 1.5rem 2rem 2rem;
}
.prompt-text {
  text-align: center;
  color: #555;
  margin-bottom: 1.5rem;
}
.lease-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.lease-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.lease-item:hover {
  border-color: #27ae60;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
.item-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #2c3e50;
}
.item-info i {
  color: #27ae60;
  font-size: 1.2rem;
}
.item-amount {
  font-weight: 600;
  color: #333;
}
.back-link-container {
  text-align: center;
  margin-top: 2rem;
}
.back-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
</style>
