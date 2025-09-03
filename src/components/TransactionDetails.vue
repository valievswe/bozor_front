<template>
  <div v-if="transaction" class="transaction-details">
    <div class="detail-item">
      <span class="label">Tranzaksiya ID:</span>
      <span class="value">#{{ transaction.id }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Payme ID:</span>
      <span class="value">{{
        transaction.paymeTransactionId || 'Mavjud Emas'
      }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Summa:</span>
      <span class="value">{{ formatCurrency(transaction.amount) }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Status:</span>
      <span class="value">{{ transaction.status }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Yaratilgan Sana:</span>
      <span class="value">{{ formatDate(transaction.createdAt) }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Yangilangan Sana:</span>
      <span class="value">{{ formatDate(transaction.updatedAt) }}</span>
    </div>

    <hr />

    <h4>Ijara Ma'lumotlari</h4>
    <div class="detail-item">
      <span class="label">Obyekt:</span>
      <span class="value">{{ getAssetName(transaction.lease) }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Mulkdor:</span>
      <span class="value">{{ transaction.lease.owner.fullName }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Ijara ID:</span>
      <span class="value">#{{ transaction.lease.id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionDetails',
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS'
      }).format(amount)
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleString('uz-UZ')
    },
    getAssetName(lease) {
      if (!lease) return "Noma'lum"
      return lease.store?.storeNumber || lease.stall?.stallNumber || "Noma'lum"
    }
  }
}
</script>

<style scoped>
.transaction-details {
  font-size: 1rem;
  color: #34495e;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ecf0f1;
}
.detail-item:last-child {
  border-bottom: none;
}
.label {
  font-weight: 600;
  color: #7f8c8d;
}
.value {
  font-weight: 500;
}
hr {
  border: none;
  border-top: 1px solid #ecf0f1;
  margin: 1rem 0;
}
h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
</style>
