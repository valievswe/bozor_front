<template>
  <form @submit.prevent="submitForm" class="sale-type-form">
    <div class="form-grid">
      <div class="form-group full-width">
        <label for="name">Nomi *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Masalan, Chakana savdo"
        />
      </div>

      <div class="form-group full-width">
        <label for="tax">Preskurant narxi *</label>
        <input
          id="tax"
          v-model.number="form.tax"
          type="number"
          step="0.1"
          required
          placeholder="Masalan, 2.5"
        />
      </div>

      <div class="form-group full-width">
        <label for="description">Tavsif</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          placeholder="Savdo turi haqida qo'shimcha ma'lumot..."
        ></textarea>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SaleTypeForm',
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
        name: '',
        tax: null,
        description: ''
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
        name: this.form.name,
        tax: this.form.tax,
        description: this.form.description
      }
      this.$emit('submit', formData)
    },
    resetForm() {
      this.form = {
        name: '',
        tax: null,
        description: ''
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
textarea,
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
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}
</style>
