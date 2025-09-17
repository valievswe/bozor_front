// src/stores/paymentStore.js
import { defineStore } from 'pinia'
import { paymentService } from '@/services/api'

export const usePaymentStore = defineStore('publicPayment', {
  state: () => ({
    // This will hold the list of leases found for a specific owner
    foundLeases: [],
    // We can also store the identifier for display purposes
    ownerIdentifier: null
  }),
  actions: {
    /**
     * Finds active leases for an owner based on their TIN or phone number.
     * @param {string} identifier - The owner's TIN or phone number.
     */
    async findLeasesByOwner(identifier) {
      this.ownerIdentifier = identifier
      try {
        const response = await paymentService.findLeasesByOwner(identifier)
        this.foundLeases = response.data

        if (!this.foundLeases || this.foundLeases.length === 0) {
          throw new Error(
            "Bu ma'lumotlarga ega faol ijara shartnomalari topilmadi."
          )
        }
        return true // Success
      } catch (error) {
        this.foundLeases = [] // Clear any old results
        // Re-throw the specific error message from the backend
        throw new Error(
          error.response?.data?.message ||
            "Qidiruvda noma'lum xatolik yuz berdi."
        )
      }
    },
    // Action to clear the store when the flow is complete or cancelled
    clearLeaseData() {
      this.foundLeases = []
      this.ownerIdentifier = null
    }
  }
})
