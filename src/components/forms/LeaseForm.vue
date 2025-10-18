<template>
  <form @submit.prevent="submitForm" class="lease-form">
    <!-- Owner Selection -->
    <div class="form-group">
      <label for="ownerId">Tadbirkor (Mulkdor) *</label>
      <SearchableSelect
        :items="availableOwners"
        :is-loading="isSearchingOwners"
        placeholder="Tadbirkor ismi yoki STIR bo'yicha qidiring..."
        @select="onOwnerSelect"
        @search="searchOwners"
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

    <!-- Store Selection -->
    <div v-if="assetType === 'store'" class="form-group">
      <label for="storeId">Bo'sh Do'konni Tanlang *</label>
      <SearchableSelect
        :items="availableStores"
        :is-loading="isSearchingStores"
        placeholder="Do'kon raqami bo'yicha qidiring..."
        @select="onStoreSelect"
        @search="searchAvailableStores"
        :initial-text="editingStoreName"
        ref="storeSearchableSelect"
      >
        <template #item="{ item }">
          <div>{{ item.storeNumber }} ({{ item.area }} m²)</div>
        </template>
      </SearchableSelect>
    </div>

    <!-- Stall Selection -->
    <div v-if="assetType === 'stall'" class="form-group">
      <label for="stallId">Bo'sh Rastani Tanlang *</label>
      <SearchableSelect
        :items="availableStalls"
        :is-loading="isSearchingStalls"
        placeholder="Rasta raqami bo'yicha qidiring..."
        @select="onStallSelect"
        @search="searchAvailableStalls"
        :initial-text="editingStallName"
        ref="stallSearchableSelect"
      >
        <template #item="{ item }">
          <div>{{ item.stallNumber }} ({{ item.area }} m²)</div>
        </template>
      </SearchableSelect>
    </div>

    <hr class="form-divider" />

    <!-- Lease Details -->
    <div class="form-grid">
      <div class="form-group">
        <label for="paymentInterval">To'lov Jadvali *</label>
        <select id="paymentInterval" v-model="form.paymentInterval">
          <option value="MONTHLY">Oylik</option>
          <option value="DAILY">Kunlik</option>
        </select>
      </div>

      <div class="form-group">
        <label v-if="assetType === 'store'" for="shopMonthlyFee"
          >Do'kon To'lovi (so'm)</label
        >
        <label v-if="assetType === 'stall'" for="stallMonthlyFee"
          >Rasta To'lovi (so'm)</label
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
        ownerId: null,
        storeId: null,
        stallId: null,
        shopMonthlyFee: 0,
        stallMonthlyFee: 0,
        guardFee: 0,
        certificateNumber: '',
        issueDate: null,
        expiryDate: null,
        paymentInterval: 'MONTHLY'
      },
      assetType: 'store',
      availableOwners: [],
      isSearchingOwners: false,
      availableStores: [],
      isSearchingStores: false,
      availableStalls: [],
      isSearchingStalls: false,
      editingOwnerName: '',
      editingStoreName: '',
      editingStallName: ''
    }
  },

  watch: {
    assetType(newType) {
      if (newType === 'store') {
        this.form.stallId = null
        this.editingStallName = ''
        if (this.$refs.stallSearchableSelect) {
          this.$refs.stallSearchableSelect.searchTerm = ''
        }
      } else {
        this.form.storeId = null
        this.editingStoreName = ''
        if (this.$refs.storeSearchableSelect) {
          this.$refs.storeSearchableSelect.searchTerm = ''
        }
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
            issueDate: newData.issueDate
              ? newData.issueDate.split('T')[0]
              : null,
            expiryDate: newData.expiryDate
              ? newData.expiryDate.split('T')[0]
              : null,
            // --- THIS IS THE FIX ---
            paymentInterval: newData.paymentInterval || 'MONTHLY'
          }

          if (newData.owner) this.editingOwnerName = newData.owner.fullName
          if (newData.store) this.editingStoreName = newData.store.storeNumber
          if (newData.stall) this.editingStallName = newData.stall.stallNumber
          if (newData.storeId) this.assetType = 'store'
          if (newData.stallId) this.assetType = 'stall'
        }
      },
      immediate: true
    }
  },
  methods: {
    // --- OWNER SEARCH ---
    async searchOwners(searchTerm) {
      if (!searchTerm) {
        this.availableOwners = []
        return
      }
      this.isSearchingOwners = true
      try {
        const response = await ownerService.getAllOwners(searchTerm)
        this.availableOwners = response.data.data || []
      } catch (error) {
        this.availableOwners = []
      } finally {
        this.isSearchingOwners = false
      }
    },

    onOwnerSelect(owner) {
      this.form.ownerId = owner.id
      this.editingOwnerName = owner.fullName
      this.availableOwners = []
    },

    // --- STORE SEARCH ---
    async searchAvailableStores(searchTerm) {
      if (!searchTerm) {
        this.availableStores = []
        return
      }
      this.isSearchingStores = true
      try {
        const response = await storeService.getAllStores(searchTerm, 1, 50)
        const allStores = response.data.data

        if (Array.isArray(allStores)) {
          this.availableStores = allStores.filter(
            s => s.status === "Bo'sh" || s.id === this.form.storeId
          )
        } else {
          this.availableStores = []
        }
      } catch (error) {
        this.availableStores = []
      } finally {
        this.isSearchingStores = false
      }
    },
    onStoreSelect(store) {
      this.form.storeId = store.id
      this.editingStoreName = store.storeNumber
      this.availableStores = []
    },

    // --- STALL SEARCH ---
    async searchAvailableStalls(searchTerm) {
      if (!searchTerm) {
        this.availableStalls = []
        return
      }
      this.isSearchingStalls = true
      try {
        const response = await stallService.getAllStalls(searchTerm)
        const allStalls = response.data.data
        if (Array.isArray(allStalls)) {
          this.availableStalls = allStalls.filter(
            s => s.status === "Bo'sh" || s.id === this.form.stallId
          )
        } else {
          this.availableStalls = []
        }
      } catch (error) {
        this.availableStalls = []
      } finally {
        this.isSearchingStalls = false
      }
    },
    onStallSelect(stall) {
      this.form.stallId = stall.id
      this.editingStallName = stall.stallNumber
      this.availableStalls = []
    },

    // --- FORM SUBMISSION & RESET ---
    submitForm() {
      const formData = { ...this.form }
      if (!formData.issueDate) formData.issueDate = null
      if (!formData.expiryDate) formData.expiryDate = null
      if (!this.form.ownerId) {
        alert('Iltimos, tadbirkorni tanlang.')
        return
      }
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
        issueDate: null,
        expiryDate: null,
        // --- THIS IS THE FIX ---
        paymentInterval: 'MONTHLY'
      }
      this.assetType = 'store'
      this.editingOwnerName = ''
      this.editingStoreName = ''
      this.editingStallName = ''
    }
  }
}
</script>

<style scoped>
.lease-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.searchable-select {
  position: relative;
}

.searchable-select input {
  padding-right: 30px;
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
