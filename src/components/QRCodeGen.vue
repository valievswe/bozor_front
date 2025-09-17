<template>
  <div class="qr-code-generator">
    <div v-if="lease" class="qr-container">
      <h4>{{ assetName }} uchun to'lov</h4>
      <p><strong>Mulkdor:</strong> {{ lease.owner.fullName }}</p>
      <qrcode-vue :value="paymentUrl" :size="250" level="H" />
      <p class="payment-link-info">
        Ushbu QR kodni telefoningiz orqali skaner qiling.
      </p>
    </div>
    <div v-else class="loading">
      QR kodni yaratish uchun ma'lumotlar yuklanmoqda...
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'QRCodeGenerator',
  components: {
    QrcodeVue
  },
  props: {
    lease: {
      type: Object,
      required: true
    }
  },
  computed: {
    paymentUrl() {
      // Example: http://your-domain.com/pay/lease/123
      return `${window.location.origin}/pay/lease/${this.lease.id}`
    },
    assetName() {
      return (
        this.lease.store?.storeNumber ||
        this.lease.stall?.stallNumber ||
        "Noma'lum Obyekt"
      )
    }
  }
}
</script>

<style scoped>
.qr-code-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.qr-container {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}
h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
p {
  color: #34495e;
  margin-bottom: 1.5rem;
}
.payment-link-info {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}
</style>
