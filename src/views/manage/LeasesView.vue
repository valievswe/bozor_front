<template>
  <div class="leases-view">
    <header class="view-header">
      <h1>Ijaralarni Boshqarish</h1>
      <button class="btn btn-primary" @click="openLeaseModal(null)">
        <!-- Simplified open -->
        <span class="icon">+</span> Yangi Ijara Qo'shish
      </button>
    </header>

    <div class="view-tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'active' }]"
        @click="changeTab('active')"
      >
        Faol Ijaralar
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'archived' }]"
        @click="changeTab('archived')"
      >
        Arxiv
      </button>
    </div>

    <div class="search-container">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Mulkdor, Do'kon/Rasta raqami bo'yicha qidirish..."
      />
    </div>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">
        Ma'lumotlar yuklanmoqda...
      </div>
      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
      </div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Obyekt</th>
              <th>Mulkdor</th>
              <th>Ijara Statusi</th>
              <th>To'lov Holati</th>
              <th>Ijara Muddati</th>
              <th>Amallar</th>
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
              <td>
                <span
                  v-if="lease.isActive"
                  :class="[
                    'payment-status-badge',
                    getPaymentStatusClass(lease.paymentStatus)
                  ]"
                >
                  {{ getPaymentStatusText(lease.paymentStatus) }}
                </span>
                <span v-else class="text-muted">--</span>
              </td>
              <td>
                <span
                  :class="['duration-badge', getDurationInfo(lease).class]"
                  >{{ getDurationInfo(lease).text }}</span
                >
              </td>
              <td class="actions">
                <button
                  v-if="lease.isActive"
                  class="btn btn-sm btn-pay"
                  title="To'lov sahifasiga o'tish"
                  @click="goToPaymentPage(lease)"
                >
                  Online to'lash
                </button>
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openLeaseModal(lease)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  v-if="lease.isActive"
                  class="btn-icon btn-archive"
                  title="Arxivga jo'natish"
                  @click="handleArchiveLease(lease)"
                >
                  <i class="fa-solid fa-power-off"></i>
                </button>
                <button
                  v-if="!lease.isActive"
                  class="btn-icon btn-activate"
                  title="Arxivdan chiqarish"
                  @click="handleActivateLease(lease)"
                >
                  <i class="fa-solid fa-arrow-rotate-left"></i>
                </button>
                <button
                  v-if="
                    lease.isActive &&
                    (lease.paymentStatus === 'UNPAID' ||
                      lease.paymentStatus === 'DUE')
                  "
                  @click="openPaymentModal(lease)"
                  class="btn btn-sm btn-pay"
                  title="To'lov kiritish"
                >
                  Boshqa Kirim
                </button>
                <button
                  v-if="lease.isActive && lease.paymentInterval === 'DAILY'"
                  @click="openAttendanceModal(lease)"
                  class="btn-icon btn-calendar"
                  title="Davomatni boshqarish"
                >
                  Davomat
                  <i class="fa-solid fa-calendar-days"></i>
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
      <Pagination :meta="paginationMeta" @page-change="handlePageChange" />
    </div>

    <!-- MODAL FOR LEASE FORM (CREATE/EDIT) -->
    <!-- --- THIS IS THE FIX --- -->
    <Modal v-if="isLeaseModalVisible" @close="closeLeaseModal">
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
        <button class="btn btn-secondary" @click="closeLeaseModal">
          Yopish
        </button>
        <button class="btn btn-primary" @click="submitLeaseForm">
          Saqlash
        </button>
      </template>
    </Modal>
    <!-- --- END OF FIX --- -->

    <!-- MODAL FOR MANUAL PAYMENT -->
    <ManualPaymentModal
      v-if="isPaymentModalVisible"
      :lease="selectedLeaseForPayment"
      @close="closePaymentModal"
      @payment-success="handlePaymentSuccess"
    />

    <AttendanceModal
      v-if="isAttendanceModalVisible"
      :lease="selectedLeaseForAttendance"
      @close="closeAttendanceModal"
      @updated="fetchLeases"
    />
  </div>
</template>

<script>
import { leaseService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import LeaseForm from '@/components/forms/LeaseForm.vue'
import ManualPaymentModal from '@/components/ManualPaymentModal.vue'
import AuthService from '@/services/auth'
import { useToast } from 'vue-toastification'
import Pagination from '@/components/Pagination.vue'
import AttendanceModal from '@/components/AttendanceModal.vue'

export default {
  name: 'LeasesView',
  components: {
    Modal,
    LeaseForm,
    Pagination,
    ManualPaymentModal,
    AttendanceModal
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      leases: [],
      isLoading: false,
      error: null,
      isLeaseModalVisible: false, // For the LeaseForm
      isPaymentModalVisible: false, // For the ManualPaymentModal
      isAttendanceModalVisible: false,
      selectedLeaseForAttendance: null,
      editingLease: null,
      selectedLeaseForPayment: null,
      userRole: null,
      searchTerm: '',
      debounceTimer: null,
      activeTab: 'active',
      paginationMeta: { total: 0, page: 1, limit: 10, totalPages: 1 }
    }
  },
  watch: {
    searchTerm() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.paginationMeta.page = 1
        this.fetchLeases()
      }, 500)
    }
  },
  methods: {
    async fetchLeases() {
      this.isLoading = true
      this.error = null
      try {
        const params = {
          search: this.searchTerm,
          status: this.activeTab,
          page: this.paginationMeta.page,
          limit: this.paginationMeta.limit
        }
        const response = await leaseService.getAllLeases(params)

        this.leases = response.data.data
        this.paginationMeta = response.data.meta
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
      } finally {
        this.isLoading = false
      }
    },
    getPaymentStatusClass(status) {
      const classMap = {
        PAID: 'status-paid',
        DUE: 'status-due',
        UNPAID: 'status-unpaid'
      }
      return classMap[status] || ''
    },
    getPaymentStatusText(status) {
      const textMap = {
        PAID: "To'langan",
        DUE: 'Yaqinlashmoqda',
        UNPAID: "To'lanmagan"
      }
      return textMap[status] || "Noma'lum"
    },
    handlePageChange(newPage) {
      this.paginationMeta.page = newPage
      this.fetchLeases()
    },
    goToPaymentPage(lease) {
      const paymentUrl = `/pay/lease/${lease.id}`
      window.open(this.$router.resolve(paymentUrl).href, '_blank')
    },
    changeTab(tabName) {
      this.activeTab = tabName
      this.paginationMeta.page = 1
      this.fetchLeases()
    },
    getAssetName(lease) {
      return lease.store?.storeNumber || lease.stall?.stallNumber || "Noma'lum"
    },
    getDurationInfo(lease) {
      if (!lease.expiryDate)
        return { text: 'Muddatsiz', class: 'duration-indefinite' }
      const now = new Date()
      const expiryDate = new Date(lease.expiryDate)
      now.setHours(0, 0, 0, 0)
      expiryDate.setHours(0, 0, 0, 0)
      const diffTime = expiryDate - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (!lease.isActive)
        return { text: 'Arxivlangan', class: 'duration-archived' }
      if (diffDays < 0)
        return {
          text: `Muddati o'tgan (${Math.abs(diffDays)} kun)`,
          class: 'duration-expired'
        }
      if (diffDays === 0)
        return { text: 'Bugun tugaydi', class: 'duration-ending-soon' }
      if (diffDays <= 30)
        return { text: `${diffDays} kun qoldi`, class: 'duration-ending-soon' }
      return { text: `${diffDays} kun qoldi`, class: 'duration-normal' }
    },

    // --- MODAL CONTROL METHODS ---
    openLeaseModal(lease) {
      // Handles both Add and Edit
      this.editingLease = lease ? { ...lease } : null
      this.isLeaseModalVisible = true
    },
    closeLeaseModal() {
      this.isLeaseModalVisible = false
      this.editingLease = null
    },
    openPaymentModal(lease) {
      this.selectedLeaseForPayment = lease
      this.isPaymentModalVisible = true
    },
    closePaymentModal() {
      this.isPaymentModalVisible = false
      this.selectedLeaseForPayment = null
    },
    handlePaymentSuccess() {
      this.closePaymentModal()
      this.toast.success("To'lov muvaffaqiyatli saqlandi!")
      this.fetchLeases()
    },

    openAttendanceModal(lease) {
      this.selectedLeaseForAttendance = lease
      this.isAttendanceModalVisible = true
    },

    closeAttendanceModal() {
      this.isAttendanceModalVisible = false
      this.selectedLeaseForAttendance = null
    },

    // --- FORM SUBMISSION ---
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

    // --- CRUD METHODS ---
    async handleCreateLease(formData) {
      try {
        await leaseService.createLease(formData)
        this.closeLeaseModal()
        await this.fetchLeases()
        this.toast.success("Ijara muvaffaqiyatli qo'shildi!")
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || 'Ijara yaratishda xatolik yuz berdi.'
        this.toast.error(errorMessage)
      }
    },
    async handleUpdateLease(formData) {
      try {
        await leaseService.updateLease(this.editingLease.id, formData)
        this.closeLeaseModal()
        await this.fetchLeases()
        this.toast.success("Ijara ma'lumotlari muvaffaqiyatli yangilandi!")
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || 'Ijarani yangilashda xatolik yuz berdi.'
        this.toast.error(errorMessage)
      }
    },
    async handleArchiveLease(lease) {
      if (
        confirm(
          `Haqiqatan ham "${this.getAssetName(
            lease
          )}" shartnomasini arxivga jo'natmoqchimisiz?`
        )
      ) {
        try {
          await leaseService.archiveLease(lease.id)
          await this.fetchLeases()
          this.toast.success("Ijara arxivga jo'natildi.")
        } catch (err) {
          this.toast.error(
            err.response?.data?.error || 'Ijarani arxivlashda xatolik.'
          )
        }
      }
    },
    async handleActivateLease(lease) {
      if (
        confirm(
          `Haqiqatan ham "${this.getAssetName(
            lease
          )}" shartnomasini arxivdan chiqarmoqchimisiz?`
        )
      ) {
        try {
          await leaseService.activateLease(lease.id)
          await this.fetchLeases()
          this.toast.success('Ijara qayta aktivlashtirildi.')
        } catch (err) {
          this.toast.error(
            err.response?.data?.error || 'Ijarani aktivlashtirishda xatolik.'
          )
        }
      }
    }
  },
  created() {
    const user = AuthService.getUser()
    if (user) {
      this.userRole = user.role.name // Assuming role is an object with a name property
    }
    this.fetchLeases()
  }
}
</script>

<style scoped>
/* --- Main View Layout --- */
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

/* --- Tabs and Search --- */
.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  color: #7f8c8d;
  border-bottom: 2px solid transparent;
  transform: translateY(2px);
}

.tab-btn.active {
  color: var(--primary-color, #42b983);
  border-bottom-color: var(--primary-color, #42b983);
  font-weight: 600;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-container input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* --- Data Table --- */
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

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.duration-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.duration-normal {
  background-color: #ecf0f1;
  color: #34495e;
}

.duration-ending-soon {
  background-color: #f39c12; /* Orange */
  color: #fff;
}

.duration-expired {
  background-color: #e74c3c; /* Red */
  color: #fff;
}

.duration-archived,
.duration-indefinite {
  background-color: #bdc3c7; /* Gray */
  color: #fff;
}

/* --- Status Badges --- */
.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.status-active {
  background-color: #27ae60; /* Green */
}

.status-inactive {
  background-color: #7f8c8d; /* Gray */
}
.payment-status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}
.status-paid {
  background-color: #27ae60; /* Green */
}
.status-due {
  background-color: #f39c12; /* Yellow/Orange */
}
.status-unpaid {
  background-color: #e74c3c; /* Red */
}
.text-muted {
  color: #95a5a6;
}

/* --- Action Buttons --- */
.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: background-color 0.2s;
  line-height: 1;
}

.btn-edit {
  color: #3498db; /* Blue */
}
.btn-edit:hover {
  background-color: #eaf2f8;
}

.btn-pay {
  color: #16a085; /* A teal color */
}
.btn-pay:hover {
  background-color: #d1f2eb;
}

.btn-archive {
  color: #e74c3c; /* Red */
}
.btn-archive:hover {
  background-color: #fbeae5;
}

.btn-activate {
  color: #27ae60; /* Green */
}
.btn-activate:hover {
  background-color: #e9f5ee;
}

/* --- Generic Buttons & States --- */
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
  background-color: var(--primary-color, #42b983);
  color: white;
  display: flex;
  align-items: center;
}

.btn-primary:hover {
  background-color: #3aa876;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.2);
}

.btn-primary .icon {
  margin-right: 0.5rem;
}

.text-center {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
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
