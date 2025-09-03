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

      <div class="form-group full-width">
        <label for="description">Qo'shimcha Ma'lumot</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
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
        description: ''
      }
    }
  },
  watch: {
    initialData: {
      handler(newData) {
        if (newData) {
          this.form = { ...newData }
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
      this.$emit('submit', this.form)
    },
    resetForm() {
      this.form = {
        storeNumber: '',
        area: null,
        description: ''
      }
    }
  }
}
</script>

<style scoped>
/* You can reuse the styles from OwnerForm.vue or create new ones */
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
