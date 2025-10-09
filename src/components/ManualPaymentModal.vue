<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit">
        <div class="modal-header">
          <h3>Qo'lda To'lov Kiritish</h3>
          <button type="button" class="close-button" @click="$emit('close')">
            &times;
          </button>
        </div>

        <div class="modal-body">
          <p v-if="lease">
            Ijara:
            <strong
              >{{ lease.owner.fullName }} -
              {{ lease.store?.storeNumber || lease.stall?.stallNumber }}</strong
            >
          </p>

          <div class="form-group" v-if="expectedAmount">
            <div class="expected-amount-info">
              <i class="fas fa-info-circle"></i>
              <span>Kerakli summa: <strong>{{ expectedAmount.toLocaleString('uz-UZ') }} so'm</strong></span>
            </div>
          </div>

          <div class="form-group">
            <label for="amount">Summa *</label>
            <input
              type="number"
              id="amount"
              v-model="formData.amount"
              required
              :min="expectedAmount || 0"
            />
            <small class="form-hint" v-if="expectedAmount && formData.amount < expectedAmount">
              ⚠️ To'lov summasi kerakli summadan kam
            </small>
          </div>

          <div class="form-group">
            <label for="paymentMethod">To'lov Usuli *</label>
            <select
              id="paymentMethod"
              v-model="formData.paymentMethod"
              required
            >
              <option value="BANK_TRANSFER">Bank O'tkazmasi</option>
              <option value="CASH">Naqd Pul</option>
              <option value="OTHER">Boshqa</option>
            </select>
          </div>

          <div class="form-group">
            <label for="paymentDate">To'lov Sanasi (ixtiyoriy)</label>
            <input
              type="date"
              id="paymentDate"
              v-model="formData.paymentDate"
            />
          </div>

          <div class="form-group">
            <label for="notes">Izoh (ixtiyoriy)</label>
            <textarea id="notes" v-model="formData.notes" rows="2"></textarea>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { transactionService } from '@/services/api' // Make sure you have this service exported from api.js

export default {
  name: 'ManualPaymentModal',
  props: {
    lease: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'payment-success'],
  data() {
    return {
      formData: {
        leaseId: null,
        amount: 0,
        paymentMethod: 'BANK_TRANSFER',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
      },
      isSubmitting: false,
      error: null,
      expectedAmount: 0
    }
  },
  watch: {
    lease: {
      handler(newLease) {
        if (newLease) {
          this.formData.leaseId = newLease.id
          // Pre-fill amount from monthly fees
          const totalFee =
            parseFloat(newLease.shopMonthlyFee || 0) +
            parseFloat(newLease.stallMonthlyFee || 0) +
            parseFloat(newLease.guardFee || 0)
          this.expectedAmount = totalFee
          this.formData.amount = totalFee > 0 ? totalFee : ''
        }
      },
      immediate: true
    }
  },
  methods: {
    async handleSubmit() {
      this.error = null
      this.isSubmitting = true
      try {
        await transactionService.createManual(this.formData)
        this.$emit('payment-success')
        this.$emit('close')
      } catch (err) {
        this.error = err.response?.data?.error || 'Xatolik yuz berdi.'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

/* --- Modal Content --- */
/* This is the main white box of the modal */
.modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px; /* Prevents the modal from being too wide on large screens */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensures the border-radius is respected by child elements */
  animation: slide-down 0.3s ease-out;
}

/* --- Modal Sections (Header, Body, Footer) --- */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.close-button:hover {
  color: #34495e;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-body p {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #34495e;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  background-color: #f8f9fa;
}

/* --- Form Elements --- */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

input[type='number'],
input[type='date'],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit; /* Ensures the font is consistent */
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background-color: #fff;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color, #42b983);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

textarea {
  resize: vertical; /* Allow users to resize the notes field vertically */
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: -0.75rem; /* Reduce space above the error message */
}

.expected-amount-info {
  padding: 0.75rem;
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1565c0;
  font-size: 0.95rem;
}

.expected-amount-info i {
  font-size: 1.1rem;
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #f39c12;
}

/* --- Button Styling (reusing classes from your main view) --- */
.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color, #42b983);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3aa876;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.2);
}

.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #34495e;
  border: 1px solid #bdc3c7;
}

.btn-secondary:hover {
  background-color: #e0e6e8;
}

/* --- Animation --- */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
