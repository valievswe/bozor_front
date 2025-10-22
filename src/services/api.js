import axios from 'axios'

// Validate API base URL in production
const baseURL = import.meta.env.VITE_API_BASE_URL
if (import.meta.env.PROD && baseURL && !baseURL.startsWith('https://')) {
  console.warn('WARNING: API base URL should use HTTPS in production:', baseURL)
}

// Create a base instance of axios with common configuration
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// --- AUTHENTICATION SERVICE ---
export const authService = {
  login(email, password) {
    return apiClient.post('/auth/login', { email, password })
  },

  register(userData) {
    // userData should be an object like { firstName, lastName, email, password, roleName }
    return apiClient.post('/auth/register', userData)
  }
}

// --- OWNER SERVICE ---
// All functions related to owners
export const ownerService = {
  // GET /api/owners
  getAllOwners(searchTerm, page = 1, limit = 10) {
    const params = { page, limit }
    if (searchTerm) {
      params.search = searchTerm
    }
    return apiClient.get('/owners', { params })
  },

  searchPublicOwners(searchTerm) {
    return apiClient.get('/payments/public/search-owners', {
      params: { search: searchTerm }
    })
  },

  // GET /api/owners/{id}
  getOwnerById(id) {
    return apiClient.get(`/owners/${id}`)
  },

  // POST /api/owners
  createOwner(ownerData) {
    return apiClient.post('/owners', ownerData)
  },

  // PUT /api/owners/{id}
  updateOwner(id, ownerData) {
    return apiClient.put(`/owners/${id}`, ownerData)
  },

  // DELETE /api/owners/{id} (Assuming you have a DELETE endpoint)
  deleteOwner(id) {
    return apiClient.delete(`/owners/${id}`)
  }
}

// --- STORE SERVICE ---
// All functions related to stores
export const storeService = {
  // GET /api/stores
  getAllStores(searchTerm, page = 1, limit = 10) {
    const params = { page, limit }
    if (searchTerm) {
      params.search = searchTerm
    }
    return apiClient.get('/stores', { params })
  },

  // POST /api/stores
  createStore(storeData) {
    return apiClient.post('/stores', storeData)
  },

  // PUT /api/stores/:id
  updateStore(id, storeData) {
    return apiClient.put(`/stores/${id}`, storeData)
  },

  // DELETE /api/stores/:id
  deleteStore(id) {
    return apiClient.delete(`/stores/${id}`)
  }
}

// --- STALL SERVICE ---
export const stallService = {
  // GET /api/stalls
  getAllStalls(searchTerm) {
    return apiClient.get('/stalls', { params: { search: searchTerm } })
  },

  // POST /api/stalls
  createStall(stallData) {
    return apiClient.post('/stalls', stallData)
  },

  // PUT /api/stalls/:id
  updateStall(id, stallData) {
    return apiClient.put(`/stalls/${id}`, stallData)
  },

  // DELETE /api/stalls/:id
  deleteStall(id) {
    return apiClient.delete(`/stalls/${id}`)
  }
}

// --- SECTION SERVICE ---
export const sectionService = {
  // GET /api/sections
  getAllSections() {
    return apiClient.get('/sections')
  },

  // GET /api/sections/:id
  getSectionById(id) {
    return apiClient.get(`/sections/${id}`)
  },

  // POST /api/sections
  createSection(sectionData) {
    return apiClient.post('/sections', sectionData)
  },

  // PATCH /api/sections/:id
  updateSection(id, sectionData) {
    return apiClient.patch(`/sections/${id}`, sectionData)
  },

  // DELETE /api/sections/:id
  deleteSection(id) {
    return apiClient.delete(`/sections/${id}`)
  }
}

// --- LEASE SERVICE ---
export const leaseService = {
  // GET /api/leases
  getAllLeases(params) {
    // It passes this object directly to the API client
    return apiClient.get('/leases', { params })
  },
  // POST /api/leases
  createLease(leaseData) {
    return apiClient.post('/leases', leaseData)
  },

  // PUT /api/leases/:id
  updateLease(id, leaseData) {
    return apiClient.put(`/leases/${id}`, leaseData)
  },

  // PATCH /api/leases/:id/archive
  archiveLease(id) {
    return apiClient.patch(`/leases/${id}/archive`)
  },

  activateLease(id) {
    return apiClient.patch(`/leases/${id}/activate`)
  }
}

// --- USER SERVICE ---
export const userService = {
  // GET /api/users
  getAllUsers() {
    return apiClient.get('/users')
  },

  // POST /api/users
  createUser(userData) {
    return apiClient.post('/users', userData)
  },

  // PUT /api/users/:id
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData)
  },

  // DELETE /api/users/:id
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
  }
}

// --- PAYMENT SERVICE ---
export const paymentService = {
  // PUBLIC: Get lease info for the final confirmation page
  getPublicLeaseInfo(leaseId) {
    return apiClient.get(`/payments/public/leases/${leaseId}`)
  },
  // PUBLIC: Initiate payment and get a Payme URL
  initiatePayment(data) {
    return apiClient.post('/payments/public/initiate', data)
  },
  findLeasesByOwner(identifier) {
    return apiClient.post('/payments/public/find-leases', { identifier })
  },
  searchPublicLeases(term) {
    return apiClient.get('/payments/public/search', { params: { term } })
  }
}

// --- TRANSACTION SERVICE ---
export const transactionService = {
  getAllTransactions(searchTerm, status, page) {
    const params = { page }
    if (searchTerm) params.search = searchTerm
    if (status) params.status = status
    return apiClient.get('/transactions', { params })
  },

  getTransactionById(id) {
    return apiClient.get(`/transactions/${id}`)
  },

  createManual(transactionData) {
    return apiClient.post('/transactions/manual', transactionData)
  }
}

// ----- REPORT SERVICE -----
export const reportService = {
  getDailyReport(date) {
    return apiClient.get('/reports/daily', { params: { date } })
  },
  getMonthlyReport(year, month) {
    return apiClient.get('/reports/monthly', { params: { year, month } })
  },

  getDashboardStats() {
    return apiClient.get('/reports/stats')
  }
}

// ----- EXPORT SERVICE -----
export const exportService = {
  exportLeases() {
    return apiClient.get('/export/leases', { responseType: 'blob' })
  }
}

// --- SALE TYPE SERVICE ---
export const saleTypeService = {
  // GET /api/sale-types
  getAll() {
    return apiClient.get('/sale-types')
  },

  // GET /api/sale-types/:id
  getById(id) {
    return apiClient.get(`/sale-types/${id}`)
  },

  // POST /api/sale-types
  create(saleTypeData) {
    return apiClient.post('/sale-types', saleTypeData)
  },

  // PUT /api/sale-types/:id
  update(id, saleTypeData) {
    return apiClient.put(`/sale-types/${id}`, saleTypeData)
  },

  // DELETE /api/sale-types/:id
  remove(id) {
    return apiClient.delete(`/sale-types/${id}`)
  }
}

// --- ATTENDANCE SERVICE ---
export const attendanceService = {
  // GET /api/attendance - Get all attendance records with optional filters
  getAll(filters = {}) {
    return apiClient.get('/attendance', { params: filters })
  },

  /**
   * @description Gets all absence records for a lease in a given month.
   * @param {number} leaseId
   * @param {number} year
   * @param {number} month (1-12)
   */
  getAbsences(stallId, startDate, endDate, status) {
    const params = {}
    if (stallId) params.stallId = stallId
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (status) params.status = status
    return apiClient.get('/attendance', { params })
  },

  /**
   * @description Sets the attendance status for a lease on a specific date.
   * @param {number} leaseId
   * @param {string} date ('YYYY-MM-DD')
   * @param {boolean} isPresent
   */
  setStatus(leaseId, date, isPresent) {
    return apiClient.post('/attendance', { leaseId, date, isPresent })
  },

  // POST /api/attendance/:stallId - Create attendance for stall
  createAttendance(stallId) {
    return apiClient.post(`/attendance/${stallId}`)
  },

  // PUT /api/attendance/:attendanceId - Update attendance
  updateAttendance(attendanceId, data) {
    return apiClient.put(`/attendance/${attendanceId}`, data)
  },

  // DELETE /api/attendance/:attendanceId - Delete attendance
  deleteAttendance(attendanceId) {
    return apiClient.delete(`/attendance/${attendanceId}`)
  },

  // GET /api/attendance/by-date - Get all stalls with attendance for a specific date
  getByDate(date) {
    return apiClient.get('/attendance/by-date', { params: { date } })
  },

  // POST /api/attendance/bulk - Create attendance for all stalls on a date
  bulkCreate(date) {
    return apiClient.post('/attendance/bulk', { date })
  },

  // PUT /api/attendance/bulk-update - Update multiple attendance records
  bulkUpdate(updates) {
    return apiClient.put('/attendance/bulk-update', { updates })
  },

  // POST /api/attendance/mark-all-paid - Mark all as paid for a date
  markAllPaid(date) {
    return apiClient.post('/attendance/mark-all-paid', { date })
  }
}

// --- STALL PAYMENT SERVICE ---
export const stallPaymentService = {
  // GET /api/payments/public/stalls/:id - Get stall info for payment
  getStallForPayment(stallId) {
    return apiClient.get(`/payments/public/stalls/${stallId}`)
  },

  // POST /api/payments/public/stalls/:id/pay - Initiate stall payment
  initiatePayment(stallId, paymentMethod = 'CLICK') {
    return apiClient.post(`/payments/public/stalls/${stallId}/pay`, {
      payment_method: paymentMethod
    })
  },

  // GET /api/payments/public/stalls/:id/attendance-today - Get today's attendance
  getTodayAttendance(stallId) {
    return apiClient.get(`/payments/public/stalls/${stallId}/attendance-today`)
  }
}
