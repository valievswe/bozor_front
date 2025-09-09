<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Ro'yxatdan o'tish</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="fullName">Ism Familiya</label>
          <input
            type="text"
            id="fullName"
            v-model="fullName"
            required
            placeholder="Ism va familiyangizni kiriting"
          />
        </div>
        <div class="form-group">
          <label for="stir">STIR (INN)</label>
          <input
            type="text"
            id="stir"
            v-model="stir"
            required
            placeholder="STIR raqamini kiriting"
          />
        </div>
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
          <label for="phone">Telefon raqam</label>
          <input
            type="tel"
            id="phone"
            v-model="phone"
            required
            placeholder="+998 (__) ___-____"
          />
        </div>
        <div class="form-group">
          <label for="password">Parol</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Kamida 8 ta belgidan iborat parol"
            minlength="8"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Parolni tasdiqlang</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Parolni qayta kiriting"
            minlength="8"
          />
        </div>
        <div class="form-group terms">
          <input type="checkbox" id="terms" v-model="agreedToTerms" required />
          <label for="terms">
            <a href="#" @click.prevent="showTerms">Foydalanish shartlari</a> va
            <a href="#" @click.prevent="showPrivacy">maxfiylik siyosati</a>ga
            roziman
          </label>
        </div>
        <button type="submit" class="register-button" :disabled="!isFormValid">
          Ro'yxatdan o'tish
        </button>
      </form>
      <p class="login-link">
        Akkauntingiz bormi?
        <router-link to="/login">Kirish</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      fullName: '',
      stir: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false
    }
  },
  computed: {
    isFormValid() {
      return (
        this.fullName &&
        this.stir &&
        this.email &&
        this.phone &&
        this.password &&
        this.password === this.confirmPassword &&
        this.agreedToTerms
      )
    }
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Parollar mos kelmadi!')
        return
      }

      try {
        const nameParts = this.fullName.trim().split(' ')
        const firstName = nameParts.shift() || ''
        const lastName = nameParts.join(' ') || ''

        // 2. Prepare the data and call the service function
        const userData = {
          firstName,
          lastName,
          email: this.email,
          password: this.password,
          roleName: 'CASHIER' // As required by your backend
        }

        await authService.register(userData)

        alert("Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi!")
        this.$router.push('/login')
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message
          : "Ro'yxatdan o'tishda xatolik"
        alert(errorMessage)
        console.error('Registration error:', error.response || error)
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.register-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
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

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='password'] {
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

.terms {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin: 1.5rem 0;
}

.terms input[type='checkbox'] {
  width: auto;
  margin-top: 0.25rem;
}

.terms a {
  color: #42b983;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

.register-button {
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

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-button:not(:disabled):hover {
  background-color: #3aa876;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #2c3e50;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-box {
    padding: 1.5rem;
  }

  .terms {
    font-size: 0.8rem;
  }
}
</style>
