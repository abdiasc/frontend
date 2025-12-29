// main.js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())  // 🔑 registrar Pinia antes de usar stores
app.use(router)
app.mount('#app')