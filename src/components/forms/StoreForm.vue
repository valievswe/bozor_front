<template>
  <form @submit.prevent="submitForm" class="store-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="storeNumber">Do'kon Raqami *</label>
        <input
          id="storeNumber"
          v-model="form.storeNumber"
          type="text"
          required
          placeholder="Masalan, A-101"
        />
      </div>

      <div class="form-group">
        <label for="area">Maydoni (m²) *</label>
        <input
          id="area"
          v-model.number="form.area"
          type="number"
          step="0.1"
          required
          placeholder="Masalan, 25.5"
        />
      </div>

      <!-- NEW FIELD: Payme Kassa ID -->
      <div class="form-group">
        <label for="kassaID">Payme Kassa ID *</label>
        <input
          id="kassaID"
          v-model="form.kassaID"
          type="text"
          required
          placeholder="Payme Business'dan olingan ID"
        />
      </div>

      <div class="form-group">
        <label for="type">Do'kon Turi *</label>
        <select id="type" v-model="form.type" required>
          <option value="SHOP">Do'kon</option>
          <option value="WAREHOUSE">Ombor</option>
          <option value="CONTAINER">Konteyner</option>
          <option value="OTHER">Boshqa</option>
        </select>
      </div>

      <div class="form-group full-width">
        <label for="description">Qo'shimcha Ma'lumot</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          placeholder="Masalan, burchakdagi do'kon..."
        ></textarea>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'StoreForm',
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
        storeNumber: '',
        area: null,
        description: '',
        kassaID: '',
        type: 'SHOP'
      }
    }
  },
  watch: {
    initialData: {
      handler(newData) {
        this.resetForm()
        if (newData) {
          this.form = { ...this.form, ...newData }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    submitForm() {
      const formData = {
        storeNumber: this.form.storeNumber,
        area: this.form.area,
        kassaID: this.form.kassaID,
        type: this.form.type,
        description: this.form.description
      }
      this.$emit('submit', formData)
    },
    resetForm() {
      this.form = {
        storeNumber: '',
        area: null,
        description: '',
        kassaID: '',
        type: 'SHOP'
      }
    }
  }
}
</script>

<style scoped>
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
textarea {
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
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}
</style>
