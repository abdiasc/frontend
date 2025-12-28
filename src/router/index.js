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
          path: "usuarios",
          component: () => import("@/views/admin/Usuarios.vue"),
        },
        {
          path: "productos",
          component: () => import("@/views/admin/Products.vue"),
        },
        {
          path: "ordenes",
          component: () => import("@/views/admin/Orders.vue"),
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
