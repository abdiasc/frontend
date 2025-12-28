<template>
  <aside class="admin-menu">
    <!-- Header -->
    <div class="admin-header">
      <h3>Admin</h3>
    </div>

    <!-- Navegación -->
    <nav class="nav">
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
        exact-active-class="router-link-active">
        <component :is="item.iconComponent" class="menu-icon icon-svg "/>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- User Section -->
    <div class="user-section">
      <div class="user-info">
        <div class="avatar">{{ userInitial }}</div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>
      <button class="logout-btn" title="Cerrar sesión" @click="handleLogout">
        <!--<span>🚪</span>-->
      </button>
    </div>
  </aside>
</template>

<script>
import { markRaw } from 'vue'
import DashboardIcon from './icons/dashboard.svg'
import UsersIcon from './icons/users.svg'
import PortafolioIcon from './icons/portafolio.svg'
import ClientIcon from './icons/clients.svg'
import ReportsIcon from './icons/reporte.svg'
import ConfigIcon from './icons/config.svg'
export default {

  name: 'AdminMenu',
  components: {
    DashboardIcon: markRaw(DashboardIcon),
    UsersIcon: markRaw(UsersIcon),
    PortafolioIcon: markRaw(PortafolioIcon),
    ClientIcon: markRaw(ClientIcon),
    ReportsIcon: markRaw(ReportsIcon),
    ConfigIcon: markRaw(ConfigIcon),
    //LogoutIcon: markRaw(LogoutIcon)
  },
  data() {
    return {
      menuItems: [
        { path: '/admin', iconComponent: DashboardIcon, label: 'Dashboard' },
        { path: '/admin/usuarios', iconComponent: UsersIcon, label: 'Usuarios' },
        { path: '/admin/portafolio', iconComponent: PortafolioIcon, label: 'Portafolio' },
        { path: '/admin/clientes', iconComponent: ClientIcon, label: 'Clientes' },
        { path: '/admin/reportes', iconComponent: ReportsIcon, label: 'Reportes' },
        { path: '/admin/configuracion', iconComponent: ConfigIcon, label: 'Configuración' }
      ],
      userName: 'Admin',
      userRole: 'Administrador'
    }
  },
  computed: {
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    }
  },
  methods: {
    handleLogout() {
      // Aquí puedes agregar la lógica de cierre de sesión
      console.log('Cerrando sesión...');
      // Ejemplo: this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.admin-menu {
  width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
}

/* Header */
.admin-header {
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.admin-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* Nav */
.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #6b7280;
  font-size: 0.95rem;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.router-link-active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.icon {
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}

.icon-svg {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

.nav-item.active .icon-svg {
  opacity: 1;
}

/* User Section */
.user-section {

  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: #f3f4f6;
}

.logout-btn span {
  font-size: 1.1rem;
}

/* Scrollbar */
.nav::-webkit-scrollbar {
  width: 4px;
}

.nav::-webkit-scrollbar-track {
  background: transparent;
}

.nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>