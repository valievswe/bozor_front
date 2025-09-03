<template>
  <form @submit.prevent="submitForm" class="lease-form">
    <!-- Owner Selection -->
    <div class="form-group">
      <label for="ownerId">Tadbirkor (Mulkdor) *</label>
      <select id="ownerId" v-model="form.ownerId" required>
        <option :value="null" disabled>Tadbirkorni tanlang...</option>
        <option v-for="owner in owners" :key="owner.id" :value="owner.id">
          {{ owner.fullName }} (STIR: {{ owner.tin }})
        </option>
      </select>
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
        <label for="shopMonthlyFee" v-if="assetType === 'store'"
          >Do'kon Oylik To'lovi (so'm)</label
        >
        <label for="stallMonthlyFee" v-if="assetType === 'stall'"
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
        <label for="paymeKassaId">Payme Kassa ID *</label>
        <input
          id="paymeKassaId"
          v-model="form.paymeKassaId"
          type="text"
          required
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

export default {
  name: 'LeaseForm',
  props: { initialData: { type: Object, default: null } },
  emits: ['submit'],
  data() {
    return {
      form: {
        ownerId: null,
        storeId: null,
        stallId: null,
        shopMonthlyFee: null,
        stallMonthlyFee: null,
        guardFee: null,
        certificateNumber: '',
        paymeKassaId: '',
        issueDate: null,
        expiryDate: null
      },
      assetType: 'store', // Default selection
      owners: [],
      stores: [],
      stalls: []
    }
  },
  computed: {
    // Only show stores that are 'Bo'sh' (vacant)
    availableStores() {
      if (this.editingStoreNumber) {
        return this.stores // If editing, show all stores
      }
      return this.stores.filter(s => s.status === "Bo'sh")
    },
    // Only show stalls that are 'Bo'sh' (vacant)
    availableStalls() {
      if (this.editingStallNumber) {
        return this.stalls
      }
      return this.stalls.filter(s => s.status === "Bo'sh")
    },
    editingStoreNumber() {
      return this.initialData?.store?.storeNumber
    },
    editingStallNumber() {
      return this.initialData?.stall?.stallNumber
    }
  },
  watch: {
    // When switching between Store and Stall, clear the other's ID and fee
    assetType(newType) {
      if (newType === 'store') {
        this.form.stallId = null
        this.form.stallMonthlyFee = null
      } else {
        this.form.storeId = null
        this.form.shopMonthlyFee = null
      }
    },
    initialData: {
      handler(newData) {
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
            // Format dates for the date input field
            issueDate: newData.issueDate
              ? newData.issueDate.split('T')[0]
              : null,
            expiryDate: newData.expiryDate
              ? newData.expiryDate.split('T')[0]
              : null
          }
          if (newData.storeId) this.assetType = 'store'
          if (newData.stallId) this.assetType = 'stall'
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
      const formData = { ...this.form }
      // Ensure empty date strings are sent as null
      if (!formData.issueDate) formData.issueDate = null
      if (!formData.expiryDate) formData.expiryDate = null
      this.$emit('submit', formData)
    },
    resetForm() {
      this.form = {}
      this.assetType = 'store'
    },
    async loadDependencies() {
      try {
        const [ownersRes, storesRes, stallsRes] = await Promise.all([
          ownerService.getAllOwners(),
          storeService.getAllStores(),
          stallService.getAllStalls()
        ])
        this.owners = ownersRes.data
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
.lease-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}
input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}
input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}
.radio-group {
  display: flex;
  gap: 1.5rem;
}
.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}
.form-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0;
}
</style>
