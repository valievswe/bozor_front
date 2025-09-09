<template>
  <div class="transactions-view">
    <header class="view-header">
      <h1>To'lovlar Tarixi</h1>
      <!-- Optional: Add filters for date range or status -->
    </header>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">
        Ma'lumotlar yuklanmoqda...
      </div>
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ijara Obyekti</th>
              <th>Mulkdor</th>
              <th>Summa</th>
              <th>Status</th>
              <th>Sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="transactions.length > 0">
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td>#{{ transaction.id }}</td>
              <td>
                <strong>{{ getAssetName(transaction.lease) }}</strong>
              </td>
              <td>{{ transaction.lease.owner.fullName }}</td>
              <td>{{ formatCurrency(transaction.amount) }}</td>
              <td>
                <span
                  :class="['status-badge', getStatusClass(transaction.status)]"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td>{{ formatDate(transaction.createdAt) }}</td>
              <td class="actions">
                <button
                  class="btn-icon btn-view"
                  title="Ko'rish"
                  @click="openDetailsModal(transaction)"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  class="btn-icon btn-qr"
                  title="QR Kodni Ko'rish"
                  @click="openQrModal(transaction.lease)"
                >
                  <i class="fa-solid fa-qrcode"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7" class="text-center">Tranzaksiyalar topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal v-if="isDetailsModalVisible" @close="closeDetailsModal">
      <template #header><h2>Tranzaksiya Tafsilotlari</h2></template>
      <template #body>
        <TransactionDetails :transaction="selectedTransaction" />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeDetailsModal">
          Yopish
        </button>
      </template>
    </Modal>

    <!-- QR Code Modal -->
    <Modal v-if="isQrModalVisible" @close="closeQrModal">
      <template #header><h2>To'lov uchun QR Kod</h2></template>
      <template #body>
        <QRCodeGenerator :lease="selectedLease" />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeQrModal">Yopish</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { transactionService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import TransactionDetails from '@/components/TransactionDetails.vue'
import QRCodeGenerator from '@/components/QRCodeGen.vue'

export default {
  name: 'TransactionsView',
  components: {
    Modal
  },
  data() {
    return {
      transactions: [],
      isLoading: false,
      error: null,
      isDetailsModalVisible: false,
      isQrModalVisible: false,
      selectedTransaction: null,
      selectedLease: null
    }
  },
  methods: {
    async fetchTransactions() {
      this.isLoading = true
      this.error = null
      try {
        // This endpoint needs to be created in your backend.
        // It should return transactions with their related lease and owner.
        const response = await transactionService.getAllTransactions()
        this.transactions = response.data
      } catch (err) {
        this.error = "Tranzaksiyalarni yuklab bo'lmadi. Serverda xatolik."
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    getAssetName(lease) {
      if (!lease) return "Noma'lum"
      return lease.store?.storeNumber || lease.stall?.stallNumber || "Noma'lum"
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS'
      }).format(amount)
    },
    formatDate(dateString) {
      if (!dateString) return "Noma'lum"
      return new Date(dateString).toLocaleString('uz-UZ')
    },
    getStatusClass(status) {
      switch (status) {
        case 'PAID':
          return 'status-paid'
        case 'PENDING':
          return 'status-pending'
        case 'FAILED':
        case 'CANCELLED':
          return 'status-failed'
        default:
          return ''
      }
    },
    openDetailsModal(transaction) {
      this.selectedTransaction = transaction
      this.isDetailsModalVisible = true
    },
    closeDetailsModal() {
      this.isDetailsModalVisible = false
      this.selectedTransaction = null
    },
    openQrModal(lease) {
      this.selectedLease = lease
      this.isQrModalVisible = true
    },
    closeQrModal() {
      this.isQrModalVisible = false
      this.selectedLease = null
    }
  },
  created() {
    this.fetchTransactions()
  }
}
</script>

<style scoped>
/* Reusing common styles from your other views */
.transactions-view {
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
  vertical-align: middle;
}
.data-table th {
  background-color: #f8f9fa;
  color: #34495e;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}
.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: background-color 0.2s;
}
.btn-view {
  color: #3498db;
}
.btn-view:hover {
  background-color: #eaf5fb;
}
.btn-qr {
  color: #2c3e50;
}
.btn-qr:hover {
  background-color: #ecf0f1;
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

/* Status Colors */
.status-paid {
  background-color: #27ae60;
} /* Green */
.status-pending {
  background-color: #f39c12;
} /* Orange */
.status-failed {
  background-color: #e74c3c;
} /* Red */

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
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}
</style>
