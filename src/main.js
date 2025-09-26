import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const options = {
  position: 'top-right',
  timeout: 5000
}

app.use(createPinia())
app.use(router)
app.use(Toast, options)

app.mount('#app')
