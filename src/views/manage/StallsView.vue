<template>
  <div class="stalls-view">
    <header class="view-header">
      <h1>Rastalarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Rasta Qo'shish
      </button>
    </header>

    <div class="filters-section">
      <div class="filter-group">
        <label for="sectionFilter">Bo'lim bo'yicha filtr:</label>
        <select id="sectionFilter" v-model="selectedSectionId" @change="filterStalls">
          <option :value="null">Barcha rastalar</option>
          <option :value="'unassigned'">Tayinlanmagan</option>
          <option v-for="section in sections" :key="section.id" :value="section.id">
            {{ section.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
        <button @click="fetchStalls" class="btn btn-secondary">
          Qaytadan Urinish
        </button>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rasta Raqami</th>
              <th>Maydoni (m²)</th>
              <th>Kunlik To'lov</th>
              <th>Bo'lim</th>
              <th>Holati</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="filteredStalls.length > 0">
            <tr v-for="stall in filteredStalls" :key="stall.id">
              <td>{{ stall.stallNumber }}</td>
              <td>{{ stall.area }}</td>
              <td>
                <span class="daily-fee-display">
                  {{ stall.dailyFee ? Number(stall.dailyFee).toLocaleString() + ' so\'m' : '-' }}
                </span>
              </td>
              <td>
                <span class="section-name">
                  {{ getSectionName(stall.sectionId) }}
                </span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    getStallStatus(stall) === 'Band'
                      ? 'status-occupied'
                      : 'status-vacant'
                  ]"
                >
                  {{ getStallStatus(stall) }}
                </span>
              </td>
              <td class="actions">
                <button
                  class="btn-icon btn-qr"
                  title="QR Kod"
                  @click="openQRModal(stall)"
                >
                  <i class="fa-solid fa-qrcode"></i>
                </button>
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(stall)"
                  v-if="userRole === 'ADMIN'"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteStall(stall)"
                  v-if="userRole === 'ADMIN'"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">Rastalar topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header>
        <h2>
          {{ editingStall ? 'Rastani Tahrirlash' : "Yangi Rasta Qo'shish" }}
        </h2>
      </template>
      <template #body>
        <StallForm
          ref="stallForm"
          :initial-data="editingStall"
          @submit="handleFormSubmit"
        />
      </template>
      <template #footer>
        <button
          class="btn btn-secondary"
          @click="closeModal"
        >
          Yopish
        </button>
        <button
          class="btn btn-primary"
          @click="submitStallForm"
        >
          Saqlash
        </button>
      </template>
    </Modal>

    <Modal v-if="isQRModalVisible" @close="closeQRModal">
      <template #header>
        <h2>Rasta {{ selectedStall?.stallNumber }} - QR Kod</h2>
      </template>
      <template #body>
        <div class="qr-modal-content">
          <div class="stall-payment-info">
            <p class="info-title">
              <i class="fa-solid fa-calendar-day"></i> Kunlik To'lov
            </p>
            <p class="info-description">
              Ushbu QR kod orqali bugungi kun uchun rasta to'lovini amalga oshirishingiz mumkin.
            </p>
            <div v-if="selectedStall?.dailyFee" class="daily-fee">
              <span class="fee-label">Kunlik to'lov:</span>
              <span class="fee-amount">{{ Number(selectedStall.dailyFee).toLocaleString() }} so'm</span>
            </div>
            <p v-else class="fee-warning">
              <i class="fa-solid fa-exclamation-triangle"></i> Kunlik to'lov miqdori belgilanmagan
            </p>
          </div>

          <qrcode-vue
            v-if="selectedStall"
            :value="getStallPaymentUrl(selectedStall)"
            :size="300"
            level="H"
          />
          <p class="qr-info">
            QR kodni skaner qiling yoki quyidagi havoladan foydalaning:
          </p>
          <div class="payment-url">
            <input
              type="text"
              readonly
              :value="getStallPaymentUrl(selectedStall)"
              @click="copyToClipboard"
              ref="urlInput"
            />
            <button class="btn btn-secondary" @click="copyToClipboard">
              <i class="fa-solid fa-copy"></i> Nusxalash
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeQRModal">
          Yopish
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { stallService, sectionService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import StallForm from '@/components/forms/StallForm.vue'
import QrcodeVue from 'qrcode.vue'
import authService from '@/services/auth'

export default {
  name: 'StallsView',
  components: { Modal, StallForm, QrcodeVue },
  data() {
    return {
      stalls: [],
      sections: [],
      selectedSectionId: null,
      isLoading: false,
      error: null,
      isModalVisible: false,
      isQRModalVisible: false,
      selectedStall: null,
      userRole: authService.getUser()?.role || null,
      editingStall: null
    }
  },
  computed: {
    filteredStalls() {
      if (!this.selectedSectionId) {
        return this.stalls
      }
      if (this.selectedSectionId === 'unassigned') {
        return this.stalls.filter(stall => !stall.sectionId)
      }
      return this.stalls.filter(stall => stall.sectionId === this.selectedSectionId)
    }
  },
  methods: {
    async fetchStalls() {
      this.isLoading = true
      this.error = null
      try {
        const response = await stallService.getAllStalls()
        this.stalls = response.data
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
      } finally {
        this.isLoading = false
      }
    },
    async fetchSections() {
      try {
        const response = await sectionService.getAllSections()
        this.sections = response.data || []
      } catch (err) {
        console.error('Failed to load sections:', err)
      }
    },
    getSectionName(sectionId) {
      if (!sectionId) return 'Tayinlanmagan'
      const section = this.sections.find(s => s.id === sectionId)
      return section ? section.name : 'Noma\'lum'
    },
    getStallStatus(stall) {
      // Check if stall has an active lease
      if (stall.activeLease) {
        return 'Band' // Occupied
      }
      return "Bo'sh" // Vacant
    },
    filterStalls() {
      // This method is called when filter changes
      // The actual filtering is done by the computed property
    },
    openAddModal() {
      this.editingStall = null
      this.isModalVisible = true
    },
    openEditModal(stall) {
      this.editingStall = { ...stall }
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.editingStall = null
    },
    openQRModal(stall) {
      this.selectedStall = stall
      this.isQRModalVisible = true
    },
    closeQRModal() {
      this.isQRModalVisible = false
      this.selectedStall = null
    },
    getStallPaymentUrl(stall) {
      if (!stall) return ''

      // Stalls use attendance-based daily payment (no lease required)
      return `${window.location.origin}/pay/stall/${stall.id}`
    },
    copyToClipboard() {
      const input = this.$refs.urlInput
      if (input) {
        input.select()
        document.execCommand('copy')
        alert('Havola nusxalandi!')
      }
    },
    submitStallForm() {
      this.$refs.stallForm.submitForm()
    },
    handleFormSubmit(formData) {
      if (this.editingStall) {
        this.handleUpdateStall(formData)
      } else {
        this.handleCreateStall(formData)
      }
    },
    async handleCreateStall(formData) {
      try {
        await stallService.createStall(formData)
        this.closeModal()
        await this.fetchStalls()
        alert("Rasta muvaffaqiyatli qo'shildi!")
      } catch (err) {
        alert(err.response?.data?.error || 'Rasta yaratishda xatolik.')
      }
    },
    async handleUpdateStall(formData) {
      try {
        await stallService.updateStall(this.editingStall.id, formData)
        this.closeModal()
        await this.fetchStalls()
        alert("Rasta ma'lumotlari yangilandi!")
      } catch (err) {
        alert(err.response?.data?.error || 'Rastani yangilashda xatolik.')
      }
    },
    async handleDeleteStall(stall) {
      if (
        confirm(
          `Haqiqatan ham "${stall.stallNumber}" raqamli rastani o'chirmoqchimisiz?`
        )
      ) {
        try {
          await stallService.deleteStall(stall.id)
          await this.fetchStalls()
          alert("Rasta o'chirildi.")
        } catch (err) {
          alert(err.response?.data?.error || "Rastani o'chirishda xatolik.")
        }
      }
    }
  },
  created() {
    this.fetchStalls()
    this.fetchSections()
  }
}
</script>

<style scoped>
/* These styles can be identical to StoresView.vue */
.stalls-view {
  width: 100%;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.filters-section {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filter-group label {
  font-weight: 500;
  color: #34495e;
  white-space: nowrap;
}
.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.95rem;
  min-width: 200px;
  cursor: pointer;
}
.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}
.section-name {
  color: #7f8c8d;
  font-size: 0.9rem;
}
.daily-fee-display {
  color: #1b5e20;
  font-weight: 600;
  font-size: 0.95rem;
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
.btn-primary:hover {
  background-color: #3aa876;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.2);
}
.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}
.btn .icon {
  margin-right: 0.5rem;
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
.status-occupied {
  background-color: #e74c3c;
} /* Red for Band */
.status-vacant {
  background-color: #27ae60;
} /* Green for Bo'sh */
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
.btn-qr {
  color: #3498db;
}
.btn-qr:hover {
  background-color: #e3f2fd;
}
.btn-edit {
  color: var(--primary-color);
}
.btn-edit:hover {
  background-color: #e9f5ee;
}
.btn-delete {
  color: #e74c3c;
}
.btn-delete:hover {
  background-color: #fbeae5;
}
.qr-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
.stall-payment-info {
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
}
.info-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2e7d32;
  font-size: 1.1rem;
}
.info-description {
  color: #558b2f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.daily-fee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #a5d6a7;
}
.fee-label {
  color: #2c3e50;
  font-weight: 500;
}
.fee-amount {
  color: #1b5e20;
  font-size: 1.2rem;
  font-weight: 700;
}
.fee-warning {
  color: #e67e22;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.qr-info {
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #7f8c8d;
}
.payment-url {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 500px;
}
.payment-url input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9rem;
}
.payment-url button {
  white-space: nowrap;
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
</style>
