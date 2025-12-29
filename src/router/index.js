import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'


const routes = [
  {
    path: '/',
    name: 'Public',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/sobre-nosotros',
        name: 'about',
        component: About
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue')
      }
    ]
  },
  {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          component: () => import("@/views/admin/Dashboard.vue"),
        },
        {
          path: "",
          component: () => import("@/views/admin/Dashboard.vue"),
        },
        {
          path: "profile",
          component: () => import("@/views/admin/Profile.vue"),
        },
        {
          path: "usuarios",
          component: () => import("@/views/admin/Usuarios.vue"),
        },
        {
          path: "portafolio",
          component: () => import("@/views/admin/Portafolio.vue"),
        },
        {
          path: "clientes",
          component: () => import("@/views/admin/Clientes.vue"),
        },
        {
          path: "reportes",
          component: () => import("@/views/admin/Reports.vue"),
        },
        {
          path: "configuracion",
          component: () => import("@/views/admin/Configurations.vue"),
        }

      ],
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
