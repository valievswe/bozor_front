<template>
  <div class="sale-types-view">
    <header class="view-header">
      <h1>Savdo Turlarini Boshqarish</h1>
      <button class="btn btn-primary" @click="openAddModal">
        <span class="icon">+</span> Yangi Savdo Turi Qo'shish
      </button>
    </header>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
        <button @click="fetchSaleTypes" class="btn btn-secondary">
          Qaytadan Urinish
        </button>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Preskurant narxi</th>
              <th>Tavsif</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="saleTypes.length > 0">
            <tr v-for="saleType in saleTypes" :key="saleType.id">
              <td>{{ saleType.name }}</td>
              <td>{{ saleType.tax }} so'm</td>
              <td>{{ saleType.description || '-' }}</td>
              <td class="actions">
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(saleType)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteSaleType(saleType)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">Savdo turlari topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header>
        <h2>
          {{
            editingSaleType
              ? 'Savdo Turini Tahrirlash'
              : "Yangi Savdo Turi Qo'shish"
          }}
        </h2>
      </template>
      <template #body>
        <SaleTypeForm
          ref="saleTypeForm"
          :initial-data="editingSaleType"
          @submit="handleFormSubmit"
        />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Yopish</button>
        <button class="btn btn-primary" @click="submitSaleTypeForm">
          Saqlash
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { saleTypeService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import SaleTypeForm from '@/components/forms/SaleTypeForm.vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'SaleTypesView',
  components: { Modal, SaleTypeForm },
  data() {
    return {
      saleTypes: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      editingSaleType: null
    }
  },

  setup() {
    const toast = useToast()
    return { toast }
  },

  methods: {
    async fetchSaleTypes() {
      this.isLoading = true
      this.error = null
      try {
        const response = await saleTypeService.getAll()
        this.saleTypes = response.data
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
        this.toast.error("Ma'lumotlarni yuklab bo'lmadi.")
      } finally {
        this.isLoading = false
      }
    },

    openAddModal() {
      this.editingSaleType = null
      this.isModalVisible = true
    },

    openEditModal(saleType) {
      this.editingSaleType = { ...saleType }
      this.isModalVisible = true
    },

    closeModal() {
      this.isModalVisible = false
      this.editingSaleType = null
    },

    submitSaleTypeForm() {
      this.$refs.saleTypeForm.submitForm()
    },

    handleFormSubmit(formData) {
      if (this.editingSaleType) {
        this.handleUpdateSaleType(formData)
      } else {
        this.handleCreateSaleType(formData)
      }
    },

    async handleCreateSaleType(formData) {
      try {
        await saleTypeService.create(formData)
        this.closeModal()
        this.fetchSaleTypes()
        this.toast.success("Savdo turi muvaffaqiyatli qo'shildi!")
      } catch (err) {
        let errorMessage = 'Savdo turini yaratishda xatolik yuz berdi.'
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.error
        ) {
          errorMessage = err.response.data.error
        } else if (err.message) {
          errorMessage = err.message
        }
        this.toast.error(errorMessage)
      }
    },

    async handleUpdateSaleType(formData) {
      try {
        await saleTypeService.update(this.editingSaleType.id, formData)
        this.closeModal()
        await this.fetchSaleTypes()
        this.toast.success("Savdo turi ma'lumotlari yangilandi!")
      } catch (err) {
        let errorMessage = 'Savdo turini yangilashda xatolik yuz berdi.'
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.error
        ) {
          errorMessage = err.response.data.error
        } else if (err.message) {
          errorMessage = err.message
        }
        this.toast.error(errorMessage)
      }
    },

    async handleDeleteSaleType(saleType) {
      if (
        confirm(
          `Haqiqatan ham "${saleType.name}" savdo turini o'chirmoqchimisiz?`
        )
      ) {
        try {
          await saleTypeService.remove(saleType.id)
          await this.fetchSaleTypes()
          this.toast.success("Savdo turi o'chirildi!")
        } catch (err) {
          let errorMessage = "Savdo turini o'chirishda xatolik yuz berdi."
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message
          } else if (
            err.response &&
            err.response.data &&
            err.response.data.error
          ) {
            errorMessage = err.response.data.error
          } else if (err.message) {
            errorMessage = err.message
          }
          this.toast.error(errorMessage)
        }
      }
    }
  },

  created() {
    this.fetchSaleTypes()
  }
}
</script>

<style scoped>
.sale-types-view {
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
