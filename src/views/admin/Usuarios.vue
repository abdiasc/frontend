<template>
  <div class="usuarios">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Usuarios</h1>
        <p>Gestiona los usuarios del sistema</p>
      </div>
      <button class="btn-primary" @click="showAddModal = true">
        <span class="btn-icon">➕</span>
        Nuevo Usuario
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-box">
        <span class="search-icon">
          <img style="width: 22px; height: 22px;" src="../../../public/images/icons/search.svg" alt="Buscar">
        </span>
        <input 
          type="text" 
          placeholder="Buscar usuario..." 
          v-model="searchQuery"
        >
      </div>
      <select class="filter-select" v-model="filterRole">
        <option value="">Todos los roles</option>
        <option value="admin">Administrador</option>
        <option value="usuario">Usuario</option>
        <option value="editor">Editor</option>
      </select>
      <select class="filter-select" v-model="filterStatus">
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">Total Usuarios</span>
        <span class="stat-value">{{ filteredUsers.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Activos</span>
        <span class="stat-value">{{ activeUsers }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Inactivos</span>
        <span class="stat-value">{{ inactiveUsers }}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                <span class="user-name">{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ user.status === 'activo' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ user.date }}</td>
            <td>
              <div class="actions">
                <button class="action-btn" title="Editar" @click="editUser(user)">
                  <img style="width: 22px; height: 22px;" src="../../../public/images/icons/edit.svg" alt="Editar">
                </button>
                <button class="action-btn" title="Eliminar" @click="deleteUser(user)">
                  <img style="width: 22px; height: 22px;" src="../../../public/images/icons/trash.svg" alt="Eliminar">
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Agregar/Editar -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <button class="modal-close" @click="showAddModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" v-model="formData.name" placeholder="Nombre completo">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="formData.email" placeholder="correo@ejemplo.com">
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="formData.role">
              <option value="usuario">Usuario</option>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="formData.status">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showAddModal = false">Cancelar</button>
          <button class="btn-primary" @click="saveUser">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsuariosDashboard',
  data() {
    return {
      searchQuery: '',
      filterRole: '',
      filterStatus: '',
      showAddModal: false,
      editingUser: null,
      formData: {
        name: '',
        email: '',
        role: 'usuario',
        status: 'activo'
      },
      users: [
        { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'admin', status: 'activo', date: '15/01/2024' },
        { id: 2, name: 'María García', email: 'maria@ejemplo.com', role: 'usuario', status: 'activo', date: '20/01/2024' },
        { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'editor', status: 'inactivo', date: '10/01/2024' },
        { id: 4, name: 'Ana Martínez', email: 'ana@ejemplo.com', role: 'usuario', status: 'activo', date: '25/01/2024' },
        { id: 5, name: 'Pedro Sánchez', email: 'pedro@ejemplo.com', role: 'admin', status: 'activo', date: '05/01/2024' }
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesRole = !this.filterRole || user.role === this.filterRole;
        const matchesStatus = !this.filterStatus || user.status === this.filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
      });
    },
    activeUsers() {
      return this.users.filter(u => u.status === 'activo').length;
    },
    inactiveUsers() {
      return this.users.filter(u => u.status === 'inactivo').length;
    }
  },
  methods: {
    getRoleLabel(role) {
      const labels = {
        admin: 'Administrador',
        usuario: 'Usuario',
        editor: 'Editor'
      };
      return labels[role] || role;
    },
    editUser(user) {
      this.editingUser = user;
      this.formData = { ...user };
      this.showAddModal = true;
    },
    deleteUser(user) {
      if (confirm(`¿Eliminar a ${user.name}?`)) {
        this.users = this.users.filter(u => u.id !== user.id);
      }
    },
    saveUser() {
      if (this.editingUser) {
        const index = this.users.findIndex(u => u.id === this.editingUser.id);
        this.users[index] = { ...this.formData };
      } else {
        this.users.push({
          id: Date.now(),
          ...this.formData,
          date: new Date().toLocaleDateString('es-ES')
        });
      }
      this.showAddModal = false;
      this.resetForm();
    },
    resetForm() {
      this.editingUser = null;
      this.formData = {
        name: '',
        email: '',
        role: 'usuario',
        status: 'activo'
      };
    }
  }
}
</script>

<style scoped>
.usuarios {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

/* Buttons */
.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: #111827;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1f2937;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-icon {
  font-size: 1rem;
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.search-box input {
  width: 90%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.search-box input:focus {
  outline: none;
  border-color: #9ca3af;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background: #ffffff;
  cursor: pointer;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

/* Table */
.table-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f9fafb;
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.95rem;
  color: #374151;
}

.users-table tbody tr:hover {
  background: #f9fafb;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
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
}

.user-name {
  font-weight: 500;
  color: #111827;
}

/* Badges */
.role-badge, .status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.usuario {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.editor {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.activo {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactivo {
  background: #fee2e2;
  color: #991b1b;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.action-btn:hover {
  background: #f3f4f6;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background 0.15s ease;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #9ca3af;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .users-table {
    min-width: 800px;
  }
}
</style>