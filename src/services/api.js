import axios from 'axios'

// Create a base instance of axios with common configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
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
  getAllOwners(searchTerm) {
    return apiClient.get('/owners', { params: { search: searchTerm } })
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
  getAllStores(searchTerm) {
    return apiClient.get('/stores', { params: { search: searchTerm } })
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

// --- LEASE SERVICE ---
export const leaseService = {
  // GET /api/leases
  getAllLeases(searchTerm, status = 'active', page = 1, limit = 10) {
    const params = {
      status,
      page,
      limit
    }
    if (searchTerm) {
      params.search = searchTerm
    }
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

// --- TRANSACTION SERVICE ---
export const transactionService = {
  // GET /api/payments/transactions
  getAllTransactions() {
    return apiClient.get('/payments/transactions')
  },

  // GET /api/payments/transactions/{id}
  getTransactionById(id) {
    return apiClient.get(`/payments/transactions/${id}`)
  }
}

export const paymentService = {
  getPublicLeaseInfo(leaseId) {
    return apiClient.get(`/payments/public/leases/${leaseId}`)
  },
  initiatePayment(data) {
    return apiClient.post('/payments/public/initiate', data)
  },
  getTransactionHistory(leaseId) {
    return apiClient.get(`/payments/transactions/${leaseId}`)
  }
}
