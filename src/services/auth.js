import { jwtDecode } from 'jwt-decode'

class AuthService {
  getUser() {
    const token = localStorage.getItem('authToken')
    if (!token) {
      return null
    }
    try {
      const decoded = jwtDecode(token)
      return decoded
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('authToken')
      return null
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('authToken')
  }
}

export default new AuthService()
