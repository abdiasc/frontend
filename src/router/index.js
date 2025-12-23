import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Mission from '@/views/Mission.vue'
import Vision from '@/views/Vision.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/sobre-nosotros',
    name: 'about',
    component: About
  },
  {
    path: '/mision',
    name: 'mission',
    component: Mission
  },
  {
    path: '/vision',
    name: 'vision',
    component: Vision
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
