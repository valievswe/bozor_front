<template>
  <div class="stalls-view">
    <header class="view-header">
      <h1>Rastalarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        v-if="userRole === 'ADMIN'"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Rasta Qo'shish
      </button>
    </header>

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
              <th>Holati</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="stalls.length > 0">
            <tr v-for="stall in stalls" :key="stall.id">
              <td>{{ stall.stallNumber }}</td>
              <td>{{ stall.area }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    stall.status === 'Band'
                      ? 'status-occupied'
                      : 'status-vacant'
                  ]"
                >
                  {{ stall.status }}
                </span>
              </td>
              <td class="actions">
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(stall)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteStall(stall)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">Rastalar topilmadi.</td>
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
          v-if="userRole === 'ADMIN'"
          @click="closeModal"
        >
          Yopish
        </button>
        <button
          class="btn btn-primary"
          v-if="userRole === 'ADMIN'"
          @click="submitStallForm"
        >
          Saqlash
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { stallService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import StallForm from '@/components/forms/StallForm.vue'

export default {
  name: 'StallsView',
  components: { Modal, StallForm },
  data() {
    return {
      stalls: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      userRole: localStorage.getItem('userRole'),
      editingStall: null
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
.btn-edit:hover {
  background-color: #e9f5ee;
}
.btn-delete:hover {
  background-color: #fbeae5;
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
