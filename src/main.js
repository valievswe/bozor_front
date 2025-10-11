import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const options = {
  position: 'top-right',
  timeout: 5000
}

app.use(createPinia())
app.use(router)
app.use(Toast, options)

// Global error handler for Vue components
app.config.errorHandler = (err, instance, info) => {
  if (import.meta.env.DEV) {
    console.error('Vue Error:', err)
    console.error('Component:', instance)
    console.error('Error Info:', info)
  }

  const toast = useToast()
  toast.error('Kutilmagan xatolik yuz berdi')
}

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  if (import.meta.env.DEV) {
    console.error('Unhandled Promise Rejection:', event.reason)
  }

  const toast = useToast()
  toast.error('Kutilmagan xatolik yuz berdi')
  event.preventDefault()
})

app.mount('#app')
