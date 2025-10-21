<template>
  <form @submit.prevent="submitForm" class="section-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="name">Bo'lim Nomi *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Masalan, Sharqiy Bo'lim"
        />
      </div>

      <div class="form-group full-width">
        <label for="description">Qo'shimcha Ma'lumot</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          placeholder="Bo'lim haqida qo'shimcha ma'lumot..."
        ></textarea>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SectionForm',
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
        name: '',
        description: ''
      }
    }
  }
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
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
