<template>
  <div class="sections-view">
    <header class="view-header">
      <h1>Bo'limlarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Bo'lim Qo'shish
      </button>
    </header>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>Xatolik yuz berdi: {{ error }}</p>
        <button @click="fetchSections" class="btn btn-secondary">
          Qaytadan Urinish
        </button>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Bo'lim Nomi</th>
              <th>Tavsif</th>
              <th>Rastalar Soni</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody v-if="sections.length > 0">
            <tr v-for="section in sections" :key="section.id">
              <td class="section-name-cell">{{ section.name }}</td>
              <td class="description-cell">{{ section.description || '-' }}</td>
              <td>
                <span class="stall-count">
                  {{ section.stalls ? section.stalls.length : 0 }}
                </span>
              </td>
              <td class="actions">
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(section)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteSection(section)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">Bo'limlar topilmadi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header>
        <h2>
          {{ editingSection ? "Bo'limni Tahrirlash" : "Yangi Bo'lim Qo'shish" }}
        </h2>
      </template>
      <template #body>
        <SectionForm
          ref="sectionForm"
          :initial-data="editingSection"
          @submit="handleFormSubmit"
        />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Yopish</button>
        <button
          class="btn btn-primary"
          @click="submitSectionForm"
        >
          Saqlash
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { sectionService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import SectionForm from '@/components/forms/SectionForm.vue'

export default {
  name: 'SectionsView',
  components: { Modal, SectionForm },
  data() {
    return {
      sections: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      userRole: localStorage.getItem('userRole'),
      editingSection: null
    }
  },
  methods: {
    async fetchSections() {
      this.isLoading = true
      this.error = null
      try {
        const response = await sectionService.getAllSections()
        this.sections = response.data || []
      } catch (err) {
        this.error = "Ma'lumotlarni yuklab bo'lmadi."
        console.error('Error fetching sections:', err)
      } finally {
        this.isLoading = false
      }
    },
    openAddModal() {
      this.editingSection = null
      this.isModalVisible = true
    },
    openEditModal(section) {
      this.editingSection = { ...section }
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.editingSection = null
    },
    submitSectionForm() {
      this.$refs.sectionForm.submitForm()
    },
    handleFormSubmit(formData) {
      if (this.editingSection) {
        this.handleUpdateSection(formData)
      } else {
        this.handleCreateSection(formData)
      }
    },
    async handleCreateSection(formData) {
      try {
        await sectionService.createSection(formData)
        this.closeModal()
        await this.fetchSections()
        alert("Bo'lim muvaffaqiyatli qo'shildi!")
      } catch (err) {
        alert(err.response?.data?.error || "Bo'lim yaratishda xatolik.")
      }
    },
    async handleUpdateSection(formData) {
      try {
        await sectionService.updateSection(this.editingSection.id, formData)
        this.closeModal()
        await this.fetchSections()
        alert("Bo'lim ma'lumotlari yangilandi!")
      } catch (err) {
        alert(err.response?.data?.error || "Bo'limni yangilashda xatolik.")
      }
    },
    async handleDeleteSection(section) {
      const stallCount = section.stalls ? section.stalls.length : 0

      let confirmMessage = `Haqiqatan ham "${section.name}" bo'limini o'chirmoqchimisiz?`
      if (stallCount > 0) {
        confirmMessage += `\n\nDiqqat: Ushbu bo'limda ${stallCount} ta rasta mavjud. Bo'limni o'chirganingizda, bu rastalar "Tayinlanmagan" holatiga o'tadi.`
      }

      if (confirm(confirmMessage)) {
        try {
          await sectionService.deleteSection(section.id)
          await this.fetchSections()
          alert("Bo'lim o'chirildi.")
        } catch (err) {
          alert(err.response?.data?.error || "Bo'limni o'chirishda xatolik.")
        }
      }
    }
  },
  created() {
    this.fetchSections()
  }
}
</script>

<style scoped>
.sections-view {
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
.section-name-cell {
  font-weight: 600;
  color: #2c3e50;
}
.description-cell {
  color: #7f8c8d;
  font-size: 0.9rem;
  max-width: 300px;
}
.stall-count {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: #3498db;
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
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
