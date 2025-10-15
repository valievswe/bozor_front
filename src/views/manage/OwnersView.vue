<template>
  <div class="owners-view">
    <header class="view-header">
      <h1>Mulkdorlarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        v-if="userRole === 'ADMIN'"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Mulkdor Qo'shish
      </button>
    </header>

    <div
      v-if="notification.message"
      :class="['notification', notification.type]"
    >
      <p>{{ notification.message }}</p>
      <button @click="notification.message = ''" class="close-btn">
        &times;
      </button>
    </div>

    <div class="card">
      <div class="table-toolbar">
        <input
          type="text"
          class="search-input"
          v-model="searchQuery"
          placeholder="Ism, STIR yoki telefon bo'yicha qidirish..."
        />
      </div>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="loading-indicator">
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
        <button @click="fetchOwners" class="btn btn-secondary">
          Qaytadan Urinish
        </button>
      </div>

      <!-- Data Table -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>To'liq Ism</th>
              <th>STIR (INN)</th>
              <th>Telefon Raqami</th>
              <th>Manzil</th>
              <th>Status</th>
              <th v-if="userRole === 'ADMIN'">Amallar</th>
            </tr>
          </thead>
          <tbody v-if="owners.length > 0">
            <tr v-for="owner in owners" :key="owner.id">
              <td>{{ owner.fullName }}</td>
              <td>{{ owner.tin }}</td>
              <td>{{ owner.phoneNumber || 'Kiritilmagan' }}</td>
              <td>{{ owner.address }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    owner.isActive ? 'status-active' : 'status-inactive'
                  ]"
                >
                  {{ owner.isActive ? 'Aktiv' : 'Aktiv Emas' }}
                </span>
              </td>

              <td class="actions" v-if="userRole === 'ADMIN'">
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(owner)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteOwner(owner)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">Mulkdorlar topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :meta="paginationMeta" @page-change="handlePageChange" />
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header>
        <h2>
          {{ editingOwner ? 'Mulkdorni Tahrirlash' : "Yangi Mulkdor Qo'shish" }}
        </h2>
      </template>
      <template #body>
        <OwnerForm
          ref="ownerForm"
          @submit="handleFormSubmit"
          :initialData="editingOwner"
        />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Yopish</button>
        <button class="btn btn-primary" @click="submitOwnerForm">
          {{ editingOwner ? 'Saqlash' : "Qo'shish" }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ownerService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import OwnerForm from '@/components/forms/OwnerForm.vue'
import AuthService from '@/services/auth'
import { useToast } from 'vue-toastification'
import Pagination from '@/components/Pagination.vue'

export default {
  setup() {
    const toast = useToast()
    return { toast }
  },

  name: 'OwnersView',
  components: {
    Modal,
    OwnerForm,
    Pagination
  },
  data() {
    return {
      owners: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      editingOwner: null,
      userRole: null,
      searchQuery: '',
      debounceTimer: null,
      notification: {
        message: '',
        type: 'error'
      },
      paginationMeta: { total: 0, page: 1, limit: 10, totalPages: 1 }
    }
  },
  watch: {
    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.paginationMeta.page = 1
        this.fetchOwners()
      }, 300) // 300ms after user stops typing
    }
  },
  methods: {
    async fetchOwners() {
      this.isLoading = true
      this.error = null
      try {
        const response = await ownerService.getAllOwners(
          this.searchQuery,
          this.paginationMeta.page,
          this.paginationMeta.limit
        )
        this.owners = response.data.data
        this.paginationMeta = response.data.meta
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
      } finally {
        this.isLoading = false
      }
    },
    openAddModal() {
      this.editingOwner = null
      this.isModalVisible = true
    },
    openEditModal(owner) {
      this.editingOwner = { ...owner }
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.editingOwner = null
    },
    submitOwnerForm() {
      this.$refs.ownerForm.submitForm()
    },

    handleFormSubmit(formData) {
      if (this.editingOwner) {
        this.handleUpdateOwner(formData)
      } else {
        this.handleCreateOwner(formData)
      }
    },

    async handleCreateOwner(formData) {
      try {
        await ownerService.createOwner(formData)
        this.closeModal()
        await this.fetchOwners()
        alert("Mulkdor muvaffaqiyatli qo'shildi!")
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Mulkdor yaratishda xatolik yuz berdi.'
        console.error('Failed to create owner:', err)
        alert(errorMessage)
      }
    },

    async handleUpdateOwner(formData) {
      try {
        await ownerService.updateOwner(this.editingOwner.id, formData)
        this.closeModal()
        await this.fetchOwners()
        this.toast.success('Mulkdor muvaffaqiyatli yangilandi.')
      } catch (err) {
        console.error('Failed to update owner:', err)
        this.toast.error('Mulkdor yangilashda xatolik yuz berdi.')
      }
    },

    async handleDeleteOwner(owner) {
      if (confirm(`Haqiqatan ham "${owner.fullName}"ni o'chirmoqchimisiz?`)) {
        try {
          await ownerService.deleteOwner(owner.id)
          this.toast.success(`"${owner.fullName}" muvaffaqiyatli o'chirildi.`)
          await this.fetchOwners()
        } catch (err) {
          const errorMessage =
            err.response?.data?.error ||
            "O'chirishda noma'lum xatolik yuz berdi."

          this.toast.error(errorMessage)
        }
      }
    },
    handlePageChange(newPage) {
      this.paginationMeta.page = newPage
      this.fetchOwners()
    }
  },

  created() {
    const user = AuthService.getUser()
    console.log('User data from token in OwnersView:', user)

    if (user) {
      this.userRole = user.role
    }
    this.fetchOwners()
  }
}
</script>

<style scoped>
/* General View Styles */
.owners-view {
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

/* Card for table container */
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow-x: auto;
}

.table-toolbar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}
.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* Generic Button Styles */
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

/* Table Styles */
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

/* Status Badge */
.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}
.status-active {
  background-color: #27ae60; /* Green */
}
.status-inactive {
  background-color: #e74c3c; /* Red */
}

/* Action Buttons */
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
.btn-delete:hover {
  background-color: #fbeae5;
}

/* Utility & States */
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
.notification {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}
.notification.error {
  background-color: #fbeae5;
  color: #c0392b;
  border: 1px solid #e74c3c;
}
.notification.success {
  background-color: #e9f5ee;
  color: #27ae60;
  border: 1px solid #27ae60;
}
.notification .close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
}
</style>
