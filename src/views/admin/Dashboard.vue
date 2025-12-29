<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1>Panel de Administración</h1>
        <p>Bienvenido al panel de administración. Aquí puedes gestionar usuarios, configurar ajustes y más.</p>
      </div>
      <div class="header-date">
        <span class="date">{{ currentDate }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- Banner Completar Perfil -->
    <div v-if="!userStore.user?.hasProfileImage" class="profile-banner">
      <div>
        <strong>Completa tu perfil</strong>
        <p>Agrega una imagen de perfil para personalizar tu cuenta.</p>
      </div>
      <button @click="goToProfile">
        Completar ahora
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-info">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-change" :class="stat.trend">
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <button v-for="action in quickActions" :key="action.label" class="action-btn"
          @click="handleAction(action.action)">
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-label">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="section">
      <h2>Actividad Reciente</h2>
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivity" :key="activity.id">
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <span class="activity-text">{{ activity.text }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/user.store';

export default {
  name: 'DashboardHome',
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },

  data() {
    return {
      currentDate: '',
      currentTime: '',
      user: {
        nombre: '',
        email: '',
        fotoPerfil: null,
        hasProfileImage: false
      },

      stats: [
        { icon: '👥', label: 'Usuarios Totales', value: '1,234', change: '+12%', trend: 'positive' },
        { icon: '📦', label: 'Productos', value: '567', change: '+8%', trend: 'positive' },
        { icon: '🛒', label: 'Órdenes', value: '89', change: '-3%', trend: 'negative' },
        { icon: '💰', label: 'Ingresos', value: '$45,678', change: '+15%', trend: 'positive' }
      ],

      quickActions: [
        { icon: '➕', label: 'Nuevo Usuario', action: 'newUser' },
        { icon: '📦', label: 'Agregar Producto', action: 'newProduct' },
        { icon: '📊', label: 'Ver Reportes', action: 'viewReports' },
        { icon: '⚙️', label: 'Configuración', action: 'settings' }
      ],

      recentActivity: [
        { id: 1, icon: '👤', text: 'Nuevo usuario registrado', time: 'Hace 5 minutos' },
        { id: 2, icon: '📦', text: 'Producto actualizado', time: 'Hace 15 minutos' },
        { id: 3, icon: '🛒', text: 'Nueva orden recibida', time: 'Hace 1 hora' },
        { id: 4, icon: '⚙️', text: 'Configuración modificada', time: 'Hace 2 horas' }
      ]
    };
  },

  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
    this.fetchUser();
    this.userStore.fetchUser();
  },

  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      this.currentTime = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async fetchUser() {
      try {
        const token = localStorage.getItem('token');

        const { data } = await axios.get(
          'http://localhost:3000/api/user/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        this.user = data;

      } catch (error) {
        console.error('Error al obtener usuario', error);

        // Token inválido o expirado
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      }
    },

    goToProfile() {
      this.$router.push('/admin/profile');
    },

    handleAction(action) {
      console.log('Acción:', action);
    }
  }
};
</script>


<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.dashboard-header p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.header-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.date {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}

.time {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111827;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

/* Section */
.section {
  margin-bottom: 2rem;
}

.section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #374151;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.action-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
}

.action-label {
  font-weight: 500;
}

/* Activity List */
.activity-list {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-icon {
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.activity-text {
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
}

.activity-time {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .header-date {
    width: 100%;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}

.profile-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
}

.profile-banner button {
  background: #f59e0b;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
</style>