<template>
  <form @submit.prevent="submitForm" class="owner-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="fullName">To'liq Ism *</label>
        <input id="fullName" v-model="form.fullName" type="text" required />
      </div>

      <div class="form-group">
        <label for="tin">STIR (INN) *</label>
        <input id="tin" v-model="form.tin" type="text" required />
      </div>

      <div class="form-group">
        <label for="phoneNumber">Telefon Raqami</label>
        <input id="phoneNumber" v-model="form.phoneNumber" type="tel" />
      </div>

      <div class="form-group">
        <label for="activityType">Faoliyat Turi</label>
        <input id="activityType" v-model="form.activityType" type="text" />
      </div>

      <div class="form-group full-width">
        <label for="address">Manzil</label>
        <textarea id="address" v-model="form.address" rows="3"></textarea>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'OwnerForm',
  props: {
    // This prop will receive the owner's data when editing
    initialData: {
      type: Object,
      default: null
    }
  },
  emits: ['submit'],
  data() {
    return {
      // Initialize the form with empty values
      form: {
        fullName: '',
        tin: '',
        phoneNumber: '',
        activityType: '',
        address: ''
      }
    }
  },
  watch: {
    // Watch for changes in the initialData prop
    initialData: {
      handler(newData) {
        if (newData) {
          // If new data is provided, populate the form
          this.form = { ...newData }
        } else {
          // If no data (i.e., we are creating), reset the form
          this.resetForm()
        }
      },
      immediate: true, // This makes the watcher run immediately when the component is created
      deep: true // Necessary for objects
    }
  },
  methods: {
    submitForm() {
      // The submit logic remains the same
      this.$emit('submit', this.form)
    },
    resetForm() {
      // A helper method to clear the form fields
      this.form = {
        fullName: '',
        tin: '',
        phoneNumber: '',
        activityType: '',
        address: ''
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
