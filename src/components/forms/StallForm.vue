<template>
  <form @submit.prevent="submitForm" class="stall-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="stallNumber">Rasta Raqami *</label>
        <input
          id="stallNumber"
          v-model="form.stallNumber"
          type="text"
          required
          placeholder="Masalan, R-15"
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
          placeholder="Masalan, 4.0"
        />
      </div>

      <div class="form-group">
        <label for="dailyFee">Kunlik To'lov (so'm) *</label>
        <input
          id="dailyFee"
          v-model.number="form.dailyFee"
          type="number"
          step="1000"
          required
          placeholder="Masalan, 50000"
        />
      </div>

      <div class="form-group">
        <label for="section">Bo'lim (Section)</label>
        <select id="section" v-model="form.sectionId" :disabled="loadingSections">
          <option :value="null">Tayinlanmagan</option>
          <option v-for="section in sections" :key="section.id" :value="section.id">
            {{ section.name }}
          </option>
        </select>
      </div>

      <div class="form-group full-width">
        <label for="description">Qo'shimcha Ma'lumot</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          placeholder="Qo'shimcha ma'lumot kiriting..."
        ></textarea>
      </div>
    </div>
  </form>
</template>

<script>
import { sectionService } from '@/services/api'

export default {
  name: 'StallForm',
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
        stallNumber: '',
        area: null,
        dailyFee: null,
        sectionId: null,
        description: ''
      },
      sections: [],
      loadingSections: false
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
    async fetchSections() {
      this.loadingSections = true
      try {
        const response = await sectionService.getAllSections()
        this.sections = response.data || []
      } catch (err) {
        console.error('Failed to load sections:', err)
      } finally {
        this.loadingSections = false
      }
    },
    submitForm() {
      this.$emit('submit', this.form)
    },
    resetForm() {
      this.form = {
        stallNumber: '',
        area: null,
        dailyFee: null,
        sectionId: null,
        description: ''
      }
    }
  },
  mounted() {
    this.fetchSections()
  }
}
</script>

<style scoped>
/* These styles can be identical to StoreForm.vue */
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
select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
