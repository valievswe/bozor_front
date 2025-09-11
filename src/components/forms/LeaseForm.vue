<template>
  <form @submit.prevent="submitForm" class="lease-form">
    <!-- Owner Selection -->
    <div class="form-group">
      <label for="ownerId">Tadbirkor (Mulkdor) *</label>
      <SearchableSelect
        :api-service="searchOwners"
        placeholder="Tadbirkor ismi yoki STIR bo'yicha qidiring..."
        @select="onOwnerSelect"
        :initial-text="editingOwnerName"
      >
        <template #item="{ item }">
          <div>
            <strong>{{ item.fullName }}</strong>
            <div style="font-size: 0.8em; color: #777">
              STIR: {{ item.tin }}
            </div>
          </div>
        </template>
      </SearchableSelect>
    </div>

    <!-- Asset Type Selection -->
    <div class="form-group">
      <label>Ijara Obyekti *</label>
      <div class="radio-group">
        <label
          ><input type="radio" v-model="assetType" value="store" />
          Do'kon</label
        >
        <label
          ><input type="radio" v-model="assetType" value="stall" /> Rasta</label
        >
      </div>
    </div>

    <!-- Store/Stall Selection -->
    <div v-if="assetType === 'store'" class="form-group">
      <label for="storeId">Bo'sh Do'konni Tanlang *</label>
      <select id="storeId" v-model="form.storeId" required>
        <option :value="null" disabled>Do'konni tanlang...</option>
        <option
          v-for="store in availableStores"
          :key="store.id"
          :value="store.id"
        >
          {{ store.storeNumber }} ({{ store.area }} m²)
        </option>
      </select>
    </div>

    <div v-if="assetType === 'stall'" class="form-group">
      <label for="stallId">Bo'sh Rastani Tanlang *</label>
      <select id="stallId" v-model="form.stallId" required>
        <option :value="null" disabled>Rastani tanlang...</option>
        <option
          v-for="stall in availableStalls"
          :key="stall.id"
          :value="stall.id"
        >
          {{ stall.stallNumber }} ({{ stall.area }} m²)
        </option>
      </select>
    </div>

    <hr class="form-divider" />

    <!-- Lease Details -->
    <div class="form-grid">
      <div class="form-group">
        <label v-if="assetType === 'store'" for="shopMonthlyFee"
          >Do'kon Oylik To'lovi (so'm)</label
        >
        <label v-if="assetType === 'stall'" for="stallMonthlyFee"
          >Rasta Oylik To'lovi (so'm)</label
        >
        <input
          v-if="assetType === 'store'"
          id="shopMonthlyFee"
          v-model.number="form.shopMonthlyFee"
          type="number"
        />
        <input
          v-if="assetType === 'stall'"
          id="stallMonthlyFee"
          v-model.number="form.stallMonthlyFee"
          type="number"
        />
      </div>
      <div class="form-group">
        <label for="guardFee">Qo'riqlash To'lovi (so'm)</label>
        <input id="guardFee" v-model.number="form.guardFee" type="number" />
      </div>
      <div class="form-group">
        <label for="certificateNumber">Guvohnoma Raqami</label>
        <input
          id="certificateNumber"
          v-model="form.certificateNumber"
          type="text"
        />
      </div>
      <div class="form-group">
        <label for="issueDate">Berilgan Sana</label>
        <input id="issueDate" v-model="form.issueDate" type="date" />
      </div>
      <div class="form-group">
        <label for="expiryDate">Amal Qilish Muddati</label>
        <input id="expiryDate" v-model="form.expiryDate" type="date" />
      </div>
    </div>
  </form>
</template>
<script>
import { ownerService, storeService, stallService } from '@/services/api'
import SearchableSelect from './SearchableSelect.vue'

export default {
  name: 'LeaseForm',
  components: { SearchableSelect },
  props: { initialData: { type: Object, default: null } },
  emits: ['submit'],
  data() {
    return {
      form: {
        ownerId: null,
        storeId: null,
        stallId: null,
        shopMonthlyFee: 0,
        stallMonthlyFee: 0,
        guardFee: 0,
        certificateNumber: '',
        issueDate: null,
        expiryDate: null
      },
      assetType: 'store',
      stores: [],
      stalls: [],
      editingOwnerName: ''
    }
  },
  computed: {
    availableStores() {
      return this.stores.filter(s => {
        return s.status === "Bo'sh" || s.id === this.form.storeId
      })
    },
    availableStalls() {
      return this.stalls.filter(s => {
        return s.status === "Bo'sh" || s.id === this.form.stallId
      })
    }
  },
  watch: {
    assetType(newType) {
      if (newType === 'store') {
        this.form.stallId = null
        this.form.stallMonthlyFee = 0
      } else {
        this.form.storeId = null
        this.form.shopMonthlyFee = 0
      }
    },
    initialData: {
      handler(newData) {
        this.resetForm()
        if (newData) {
          this.form = {
            ownerId: newData.ownerId,
            storeId: newData.storeId,
            stallId: newData.stallId,
            shopMonthlyFee: newData.shopMonthlyFee,
            stallMonthlyFee: newData.stallMonthlyFee,
            guardFee: newData.guardFee,
            certificateNumber: newData.certificateNumber,
            paymeKassaId: newData.paymeKassaId,
            issueDate: newData.issueDate
              ? newData.issueDate.split('T')[0]
              : null,
            expiryDate: newData.expiryDate
              ? newData.expiryDate.split('T')[0]
              : null
          }
          if (newData.storeId) this.assetType = 'store'
          if (newData.stallId) this.assetType = 'stall'
          if (newData.owner) {
            this.editingOwnerName = newData.owner.fullName
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    searchOwners(searchTerm) {
      return ownerService.getAllOwners(searchTerm)
    },
    onOwnerSelect(owner) {
      this.form.ownerId = owner.id
      this.editingOwnerName = owner.fullName
    },
    submitForm() {
      const formData = { ...this.form }
      if (!formData.issueDate) formData.issueDate = null
      if (!formData.expiryDate) formData.expiryDate = null
      this.$emit('submit', formData)
    },
    resetForm() {
      this.form = {
        ownerId: null,
        storeId: null,
        stallId: null,
        shopMonthlyFee: 0,
        stallMonthlyFee: 0,
        guardFee: 0,
        certificateNumber: '',
        paymeKassaId: '',
        issueDate: null,
        expiryDate: null
      }
      this.assetType = 'store'
      this.editingOwnerName = ''
    },
    async loadDependencies() {
      try {
        const [storesRes, stallsRes] = await Promise.all([
          storeService.getAllStores(),
          stallService.getAllStalls()
        ])
        this.stores = storesRes.data
        this.stalls = stallsRes.data
      } catch (error) {
        console.error('Failed to load lease form dependencies:', error)
        alert("Formani yuklash uchun kerakli ma'lumotlarni olib bo'lmadi.")
      }
    }
  },
  created() {
    this.loadDependencies()
  }
}
</script>
<style scoped>
/* --- General Form Layout --- */
.lease-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Space between form groups */
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  ); /* Responsive grid */
  gap: 1rem 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

/* --- General Input Styling --- */
input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background-color: #fff;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color, #42b983);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* --- Radio Button Styling --- */
.radio-group {
  display: flex;
  gap: 1.5rem;
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.form-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0;
}

/* --- SearchableSelect Component Specific Styling --- */
/* This targets the component via a deep selector to style its internal elements */
:deep(.searchable-select) {
  position: relative;
}

:deep(.searchable-select input) {
  padding-right: 30px; /* Make space for the spinner */
}

:deep(.searchable-select .spinner) {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color, #42b983);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

:deep(.searchable-select .dropdown),
:deep(.searchable-select .dropdown-empty) {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 5px 5px;
  max-height: 200px;
  overflow-y: auto;
  list-style-type: none;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.searchable-select .dropdown li) {
  padding: 0.75rem;
  cursor: pointer;
}

:deep(.searchable-select .dropdown li:hover) {
  background-color: #f5f5f5;
}

:deep(.searchable-select .dropdown-empty) {
  padding: 0.75rem;
  color: #777;
}

@keyframes spin {
  /* --- Keyframes for Spinner Animation --- */
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
