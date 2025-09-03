<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Kirish</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Elektron pochta</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Elektron pochtangizni kiriting"
          />
        </div>
        <div class="form-group">
          <label for="password">Parol</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Parolingizni kiriting"
          />
        </div>
        <button type="submit" class="login-button">Kirish</button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/api'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        // 2. Call the service function instead of axios directly
        const response = await authService.login(this.email, this.password)

        const token = response.data.token
        localStorage.setItem('authToken', token)

        this.$router.push('/dashboard')
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message
          : 'Login xatosi yuz berdi'
        alert(errorMessage)
        console.error('Login error:', error.response || error)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #3aa876;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #2c3e50;
}

.register-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
