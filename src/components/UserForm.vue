<template>
  <form @submit.prevent="submitForm" class="user-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="firstName">Ism</label>
        <input id="firstName" v-model="form.firstName" type="text" />
      </div>

      <div class="form-group">
        <label for="lastName">Familiya</label>
        <input id="lastName" v-model="form.lastName" type="text" />
      </div>

      <div class="form-group">
        <label for="email">Elektron Pochta *</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>

      <div class="form-group">
        <label for="roleName">Rol *</label>
        <select id="roleName" v-model="form.roleName" required>
          <option value="ADMIN">Admin</option>
          <option value="CASHIER">Kassir</option>
          <option value="ACCOUNTANT">Hisobchi</option>
        </select>
      </div>

      <div class="form-group full-width">
        <label for="password">Yangi Parol</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          :placeholder="passwordPlaceholder"
        />
        <small v-if="isEditing"
          >Parolni o'zgartirish uchun to'ldiring, aks holda bo'sh
          qoldiring.</small
        >
      </div>

      <div class="form-group full-width">
        <label>
          <input type="checkbox" v-model="form.isActive" />
          Foydalanuvchi aktiv
        </label>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'UserForm',
  props: {
    initialData: {
      type: Object,
      default: null
    }
  },
  emits: ['submit'],
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        roleName: 'CASHIER',
        password: '',
        isActive: true
      }
    }
  },
  computed: {
    isEditing() {
      return !!this.initialData
    },
    passwordPlaceholder() {
      return this.isEditing
        ? "O'zgartirish uchun yangi parol kiriting"
        : 'Yangi parol kiriting'
    }
  },
  watch: {
    initialData: {
      handler(newData) {
        if (newData) {
          this.form = {
            firstName: newData.firstName,
            lastName: newData.lastName,
            email: newData.email,
            roleName: newData.role.name,
            password: '',
            isActive: newData.isActive
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    submitForm() {
      const dataToSubmit = { ...this.form }

      if (this.isEditing && !dataToSubmit.password) {
        delete dataToSubmit.password
      }

      this.$emit('submit', dataToSubmit)
    },
    resetForm() {
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        roleName: 'CASHIER',
        password: '',
        isActive: true
      }
    }
  }
}
</script>

<style scoped>
.user-form {
  padding-top: 0.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.form-group label input[type='checkbox'] {
  width: auto;
  margin-right: 0.75rem;
  transform: translateY(2px);
}

.form-group label[for='isActive'] {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: normal;
  margin-top: 0.5rem;
}

small {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}
</style>
