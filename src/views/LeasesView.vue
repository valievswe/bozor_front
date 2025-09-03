<template>
  <div class="leases-view">
    <header class="view-header">
      <h1>Ijaralarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        v-if="userRole === 'ADMIN'"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Ijara Qo'shish
      </button>
    </header>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">...</div>
      <div v-else-if="error" class="error-message">...</div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Obyekt</th>
              <th>Mulkdor</th>
              <th>Status</th>
              <th>Amal Qilish Muddati</th>
              <th class="text-center">QR Kod</th>
              <th v-if="userRole === 'ADMIN'">Amallar</th>
            </tr>
          </thead>
          <tbody v-if="leases.length > 0">
            <tr v-for="lease in leases" :key="lease.id">
              <td>
                <strong>{{ getAssetName(lease) }}</strong>
              </td>
              <td>{{ lease.owner.fullName }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    lease.isActive ? 'status-active' : 'status-inactive'
                  ]"
                >
                  {{ lease.isActive ? 'Aktiv' : 'Aktiv Emas' }}
                </span>
              </td>
              <td>{{ formatDate(lease.expiryDate) }}</td>

              <td class="text-center">
                <button
                  v-if="lease.isActive"
                  class="btn-icon btn-qr"
                  title="QR Kodni Ko'rish"
                  @click="showQrCodeModal(lease)"
                >
                  <i class="fa-solid fa-qrcode"></i>
                </button>
              </td>

              <td v-if="userRole === 'ADMIN'" class="actions">
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(lease)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  v-if="lease.isActive"
                  class="btn-icon btn-deactivate"
                  title="Deaktivatsiya"
                  @click="handleDeactivateLease(lease)"
                >
                  <i class="fa-solid fa-power-off"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">Ijaralar topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header
        ><h2>
          {{ editingLease ? 'Ijarani Tahrirlash' : "Yangi Ijara Qo'shish" }}
        </h2></template
      >
      <template #body
        ><LeaseForm
          ref="leaseForm"
          :initial-data="editingLease"
          @submit="handleFormSubmit"
      /></template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Yopish</button>
        <button class="btn btn-primary" @click="submitLeaseForm">
          Saqlash
        </button>
      </template>
    </Modal>

    <Modal v-if="isQrModalVisible" @close="closeQrCodeModal">
      <template #header>
        <h2>To'lov uchun QR Kod</h2>
      </template>
      <template #body>
        <!-- The QRCodeGenerator component needs the selected lease object -->
        <QRCodeGenerator v-if="selectedLease" :lease="selectedLease" />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeQrCodeModal">
          Yopish
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { leaseService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import LeaseForm from '@/components/LeaseForm.vue'
import AuthService from '@/services/auth'
import QRCodeGenerator from '@/components/QRCodeGen.vue'

export default {
  name: 'LeasesView',
  components: { Modal, LeaseForm, QRCodeGenerator },
  data() {
    return {
      leases: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      editingLease: null,
      userRole: null,

      isQrModalVisible: false,
      selectedLease: null
    }
  },
  methods: {
    async fetchLeases() {
      this.isLoading = true
      this.error = null
      try {
        const response = await leaseService.getAllLeases()
        this.leases = response.data
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
      } finally {
        this.isLoading = false
      }
    },
    getAssetName(lease) {
      return lease.store?.storeNumber || lease.stall?.stallNumber || "Noma'lum"
    },
    formatDate(dateString) {
      if (!dateString) return "Noma'lum"
      return new Date(dateString).toLocaleDateString()
    },
    openAddModal() {
      this.editingLease = null
      this.isModalVisible = true
    },
    openEditModal(lease) {
      this.editingLease = { ...lease }
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.editingLease = null
    },
    submitLeaseForm() {
      this.$refs.leaseForm.submitForm()
    },
    handleFormSubmit(formData) {
      if (this.editingLease) {
        this.handleUpdateLease(formData)
      } else {
        this.handleCreateLease(formData)
      }
    },
    async handleCreateLease(formData) {
      try {
        await leaseService.createLease(formData)
        this.closeModal()
        await this.fetchLeases()
        alert("Ijara muvaffaqiyatli qo'shildi!")
      } catch (err) {
        alert(err.response?.data?.error || 'Ijara yaratishda xatolik.')
      }
    },
    async handleUpdateLease(formData) {
      try {
        await leaseService.updateLease(this.editingLease.id, formData)
        this.closeModal()
        await this.fetchLeases()
        alert("Ijara ma'lumotlari yangilandi!")
      } catch (err) {
        alert(err.response?.data?.error || 'Ijarani yangilashda xatolik.')
      }
    },
    async handleDeactivateLease(lease) {
      if (
        confirm(
          `Haqiqatan ham "${this.getAssetName(lease)}" obyekti ijara shartnomasini bekor qilmoqchimisiz?`
        )
      ) {
        try {
          await leaseService.deactivateLease(lease.id)
          await this.fetchLeases()
          alert('Ijara bekor qilindi.')
        } catch (err) {
          alert(err.response?.data?.error || 'Ijarani bekor qilishda xatolik.')
        }
      }
    },

    showQrCodeModal(lease) {
      this.selectedLease = lease
      this.isQrModalVisible = true
    },

    closeQrCodeModal() {
      this.isQrModalVisible = false
      this.selectedLease = null
    }
  },

  created() {
    const user = AuthService.getUser()
    if (user) {
      this.userRole = user.role
    }
    this.fetchLeases()
  }
}
</script>

<style scoped>
.btn-deactivate {
  color: #e74c3c;
}
.btn-deactivate:hover {
  background-color: #fbeae5;
}
.status-active {
  background-color: #27ae60;
}
.status-inactive {
  background-color: #7f8c8d;
}
/* Add all other common styles */
.leases-view {
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
.btn-primary {
  background-color: var(--primary-color);
  color: white;
}
.btn-secondary {
  background-color: #7f8c8d;
  color: white;
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
.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
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
.btn-edit:hover {
  background-color: #e9f5ee;
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

.btn-qr {
  color: #2c3e50;
  font-size: 1.3rem; /* Make it a bit bigger */
}
.btn-qr:hover {
  background-color: #ecf0f1;
}
.text-center {
  text-align: center;
}
</style>
