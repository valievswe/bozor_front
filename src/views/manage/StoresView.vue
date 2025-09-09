<template>
  <div class="stores-view">
    <header class="view-header">
      <h1>Do'konlarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        v-if="userRole === 'ADMIN'"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Do'kon Qo'shish
      </button>
    </header>

    <div class="card">
      <div class="table-toolbar">
        <input
          type="text"
          class="search-input"
          v-model="searchQuery"
          placeholder="Raqam yoki tavsif bo'yicha qidirish..."
        />
      </div>

      <div v-if="isLoading" class="loading-indicator">
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
        <button @click="fetchStores" class="btn btn-secondary">
          Qaytadan Urinish
        </button>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Do'kon Raqami</th>
              <th>Maydoni (m²)</th>
              <th>Holati</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="stores.length > 0">
            <tr v-for="store in stores" :key="store.id">
              <td>{{ store.storeNumber }}</td>
              <td>{{ store.area }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    store.status === 'Band'
                      ? 'status-occupied'
                      : 'status-vacant'
                  ]"
                >
                  {{ store.status }}
                </span>
              </td>
              <td class="actions">
                <button
                  v-if="userRole === 'ADMIN'"
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(store)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  v-if="userRole === 'ADMIN'"
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteStore(store)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">Do'konlar topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header>
        <h2>
          {{ editingStore ? "Do'konni Tahrirlash" : "Yangi Do'kon Qo'shish" }}
        </h2>
      </template>
      <template #body>
        <StoreForm
          ref="storeForm"
          :initial-data="editingStore"
          @submit="handleFormSubmit"
        />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Yopish</button>
        <button class="btn btn-primary" @click="submitStoreForm">
          Saqlash
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { storeService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import StoreForm from '@/components/forms/StoreForm.vue'
import authService from '@/services/auth'

export default {
  name: 'StoresView',
  components: { Modal, StoreForm },
  data() {
    return {
      stores: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      editingStore: null,
      searchQuery: '',
      debounceTimer: null,
      userRole: null
    }
  },
  watch: {
    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchStores()
      }, 300)
    }
  },
  methods: {
    async fetchStores() {
      this.isLoading = true
      this.error = null
      try {
        const response = await storeService.getAllStores(this.searchQuery)
        this.stores = response.data
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
      } finally {
        this.isLoading = false
      }
    },
    openAddModal() {
      this.editingStore = null
      this.isModalVisible = true
    },
    openEditModal(store) {
      this.editingStore = { ...store }
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.editingStore = null
    },
    submitStoreForm() {
      this.$refs.storeForm.submitForm()
    },
    handleFormSubmit(formData) {
      if (this.editingStore) {
        this.handleUpdateStore(formData)
      } else {
        this.handleCreateStore(formData)
      }
    },
    async handleCreateStore(formData) {
      try {
        await storeService.createStore(formData)
        this.closeModal()
        await this.fetchStores()
        alert("Do'kon muvaffaqiyatli qo'shildi!")
      } catch (err) {
        alert(err.response?.data?.error || "Do'kon yaratishda xatolik.")
      }
    },
    async handleUpdateStore(formData) {
      try {
        await storeService.updateStore(this.editingStore.id, formData)
        this.closeModal()
        await this.fetchStores()
        alert("Do'kon ma'lumotlari yangilandi!")
      } catch (err) {
        alert(err.response?.data?.error || "Do'konni yangilashda xatolik.")
      }
    },
    async handleDeleteStore(store) {
      if (
        confirm(
          `Haqiqatan ham "${store.storeNumber}" raqamli do'konni o'chirmoqchimisiz?`
        )
      ) {
        try {
          await storeService.deleteStore(store.id)
          await this.fetchStores()
          alert("Do'kon o'chirildi.")
        } catch (err) {
          alert(err.response?.data?.error || "Do'konni o'chirishda xatolik.")
        }
      }
    }
  },
  created() {
    const user = authService.getUser()
    if (user) {
      this.userRole = user.role
    }
    this.fetchStores()
  }
}
</script>

<style scoped>
/* You can copy the styles from OwnersView.vue and reuse them */
.stores-view {
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
