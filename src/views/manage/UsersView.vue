<template>
  <div class="users-view">
    <header class="view-header">
      <h1>Foydalanuvchilarni Boshqarish</h1>
      <button
        class="btn btn-primary"
        v-if="userRole === 'ADMIN'"
        @click="openAddModal"
      >
        <span class="icon">+</span> Yangi Foydalanuvchi
      </button>
    </header>

    <div class="card">
      <div v-if="isLoading" class="loading-indicator">...</div>
      <div v-else-if="error" class="error-message">...</div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>To'liq Ism</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge">{{ user.role.name }}</span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    user.isActive ? 'status-active' : 'status-inactive'
                  ]"
                >
                  {{ user.isActive ? 'Aktiv' : 'Aktiv Emas' }}
                </span>
              </td>
              <td class="actions">
                <button
                  class="btn-icon btn-edit"
                  title="Tahrirlash"
                  @click="openEditModal(user)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="btn-icon btn-delete"
                  title="O'chirish"
                  @click="handleDeleteUser(user)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalVisible" @close="closeModal">
      <template #header
        ><h2>
          {{
            editingUser
              ? 'Foydalanuvchini Tahrirlash'
              : 'Yangi Foydalanuvchi Yaratish'
          }}
        </h2></template
      >
      <template #body
        ><UserForm
          ref="userForm"
          :initial-data="editingUser"
          @submit="handleFormSubmit"
      /></template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Yopish</button>
        <button class="btn btn-primary" @click="submitUserForm">Saqlash</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { userService } from '@/services/api'
import Modal from '@/components/Modal.vue'
import UserForm from '@/components/forms/UserForm.vue'
import AuthService from '@/services/auth'

export default {
  name: 'UsersView',
  components: { Modal, UserForm },
  data() {
    return {
      users: [],
      isLoading: false,
      error: null,
      isModalVisible: false,
      editingUser: null,
      userRole: null
    }
  },
  methods: {
    // --- Data Fetching ---
    async fetchUsers() {
      this.isLoading = true
      this.error = null
      try {
        const response = await userService.getAllUsers()
        this.users = response.data
      } catch (err) {
        this.error = "Foydalanuvchilarni yuklab bo'lmadi."
        console.error('Failed to fetch users:', err)
      } finally {
        this.isLoading = false
      }
    },

    // --- Modal Controls ---
    openAddModal() {
      this.editingUser = null
      this.isModalVisible = true
    },
    openEditModal(user) {
      this.editingUser = { ...user }
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.editingUser = null
    },

    // --- Form Submission Logic ---
    submitUserForm() {
      this.$refs.userForm.submitForm()
    },
    handleFormSubmit(formData) {
      if (this.editingUser) {
        this.handleUpdateUser(formData)
      } else {
        this.handleCreateUser(formData)
      }
    },

    // --- CRUD API Calls ---
    async handleCreateUser(formData) {
      try {
        await userService.createUser(formData)
        this.closeModal()
        await this.fetchUsers()
        alert('Foydalanuvchi muvaffaqiyatli yaratildi!')
      } catch (err) {
        alert(
          err.response?.data?.message || 'Foydalanuvchi yaratishda xatolik.'
        )
      }
    },
    async handleUpdateUser(formData) {
      try {
        await userService.updateUser(this.editingUser.id, formData)
        this.closeModal()
        await this.fetchUsers()
        alert("Foydalanuvchi ma'lumotlari yangilandi!")
      } catch (err) {
        alert(
          err.response?.data?.message || 'Foydalanuvchini yangilashda xatolik.'
        )
      }
    },
    async handleDeleteUser(user) {
      if (
        confirm(
          `Haqiqatan ham "${user.email}" foydalanuvchisini o'chirmoqchimisiz?`
        )
      ) {
        try {
          await userService.deleteUser(user.id)
          await this.fetchUsers()
          alert("Foydalanuvchi o'chirildi.")
        } catch (err) {
          alert(
            err.response?.data?.message ||
              "Foydalanuvchini o'chirishda xatolik."
          )
        }
      }
    }
  },
  created() {
    const user = AuthService.getUser()
    if (user) {
      this.userRole = user.role
    }
    this.fetchUsers()
  }
}
</script>
<style scoped>
/* General View Styles */
.users-view {
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
  vertical-align: middle;
}
.data-table th {
  background-color: #203c5a;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}
.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Role & Status Badges */
.role-badge,
.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #14163d;
  display: inline-block;
}

.role-admin {
  background-color: #9b59b6;
} /* Purple */
.role-accountant {
  background-color: #3498db;
} /* Blue */
.role-cashier {
  background-color: #f1c40f;
  color: #333;
} /* Yellow */

.status-active {
  background-color: #27ae60;
} /* Green */
.status-inactive {
  background-color: #e74c3c;
} /* Red */

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
</style>
