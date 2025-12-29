<template>
  <div class="profile-container">
    <!-- Header del perfil -->
    <div class="profile-header">
      <h1 class="profile-title">Mi Perfil</h1>
      <p class="profile-subtitle">Gestiona tu información personal y preferencias</p>
    </div>

    <div class="profile-content">
      <!-- Panel izquierdo: Avatar y información básica -->
      <div class="profile-sidebar">
        <div class="avatar-card">
          <div class="avatar-wrapper">
            <div class="avatar-container">
              <img
                :src="preview || userStore.avatarUrl || defaultAvatar"
                :class="['avatar-image', { 'uploading': uploading }]"
                alt="Avatar del usuario"
              />
              <div v-if="uploading" class="upload-overlay">
                <div class="spinner"></div>
              </div>
            </div>
            
            <div class="avatar-actions">
              <label class="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  class="file-input"
                  :disabled="uploading"
                />
                <span class="button button-outline">
                  <i class="icon-upload"></i> Cambiar foto
                </span>
              </label>
              
              <button
                v-if="file"
                @click="uploadAvatar"
                :disabled="uploading"
                class="button button-primary"
              >
                <span v-if="!uploading">Guardar cambios</span>
                <span v-else>Subiendo...</span>
              </button>
              
              <button
                v-if="preview"
                @click="cancelUpload"
                :disabled="uploading"
                class="button button-text"
              >
                Cancelar
              </button>
            </div>
            
            <p class="avatar-hint">
              Formatos permitidos: JPG, PNG, GIF. Máx. 2MB
            </p>
          </div>
        </div>

        <!-- Información de cuenta -->
        <div class="account-info">
          <h3>Información de cuenta</h3>
          <div class="info-item">
            <span class="info-label">Miembro desde:</span>
            <span class="info-value"><p v-if="userStore.user">{{ userStore.user.fechaRegistro}}</p></span>
            
          </div>
          <div class="info-item">
            <span class="info-label">Rol:</span>
            <span class="info-badge">{{ userStore.role }}</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho: Información del usuario -->
      <div class="profile-main">
        <!-- Sección de información personal -->
        <div class="info-section">
          <div class="section-header">
            <h2>Información personal</h2>
            <button class="button button-text" @click="editPersonalInfo">
              <i class="icon-edit"></i> Editar
            </button>
          </div>
          
          <div class="info-grid">
            <div class="info-field">
              <label>Nombre completo</label>
              <p v-if="userStore.user">{{ userStore.user.nombre }}</p>
            </div>
            <div class="info-field">
              <label>Correo electrónico</label>
              <p v-if="userStore.user">{{ userStore.user.email }}</p>
            </div>
            <div class="info-field">
              <label>Teléfono</label>
              <p class="info-value">{{ userStore.phone || 'No especificado' }}</p>
            </div>
            <div class="info-field">
              <label>Ubicación</label>
              <p class="info-value">{{ userStore.location || 'No especificada' }}</p>
            </div>
          </div>
        </div>

        <!-- Sección de preferencias -->
        <div class="info-section">
          <div class="section-header">
            <h2>Preferencias</h2>
          </div>
          
          <div class="preferences">
            <div class="preference-item">
              <div class="preference-info">
                <h4>Notificaciones por correo</h4>
                <p>Recibir actualizaciones y notificaciones importantes</p>
              </div>
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  id="email-notifications"
                  v-model="preferences.emailNotifications"
                  @change="updatePreferences"
                />
                <label for="email-notifications" class="toggle-slider"></label>
              </div>
            </div>
            
            <div class="preference-item">
              <div class="preference-info">
                <h4>Tema oscuro</h4>
                <p>Interfaz con colores oscuros</p>
              </div>
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  id="dark-mode"
                  v-model="preferences.darkMode"
                  @change="updatePreferences"
                />
                <label for="dark-mode" class="toggle-slider"></label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de acciones de cuenta -->
        <div class="info-section danger-zone">
          <div class="section-header">
            <h2>Zona de peligro</h2>
          </div>
          
          <div class="danger-actions">
            <button class="button button-danger" @click="confirmDeleteAccount">
              <i class="icon-trash"></i> Eliminar cuenta
            </button>
            <p class="danger-hint">
              Esta acción no se puede deshacer. Se perderán todos tus datos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      <i :class="notification.icon"></i>
      <span>{{ notification.message }}</span>
      <button @click="notification.show = false" class="notification-close">
        &times;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user.store';

const userStore = useUserStore();
const defaultAvatar = 'https://via.placeholder.com/150/cccccc/969696?text=USER';

const file = ref(null);
const preview = ref(null);
const uploading = ref(false);

const preferences = reactive({
  emailNotifications: true,
  darkMode: false
});

const notification = reactive({
  show: false,
  type: 'success', // 'success' | 'error' | 'warning'
  message: '',
  icon: ''
});

const onFileChange = (e) => {
  const selectedFile = e.target.files[0];
  
  if (!selectedFile) return;
  
  // Validar tamaño máximo (2MB)
  if (selectedFile.size > 2 * 1024 * 1024) {
    showNotification('error', 'La imagen no debe superar los 2MB');
    e.target.value = '';
    return;
  }
  
  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(selectedFile.type)) {
    showNotification('error', 'Formato de imagen no válido');
    e.target.value = '';
    return;
  }
  
  file.value = selectedFile;
  preview.value = URL.createObjectURL(selectedFile);
};

const uploadAvatar = async () => {
  if (!file.value) return;
  
  uploading.value = true;
  
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file.value);
    
    await axios.post(
      'http://localhost:3000/api/user/avatar',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    await userStore.fetchUser();
    showNotification('success', 'Avatar actualizado correctamente');
    
    // Limpiar estado
    cancelUpload();
    
  } catch (error) {
    console.error('Error uploading avatar:', error);
    showNotification('error', 'Error al subir la imagen');
  } finally {
    uploading.value = false;
  }
};

const cancelUpload = () => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value);
  }
  preview.value = null;
  file.value = null;
  // Limpiar input file
  const fileInput = document.querySelector('.file-input');
  if (fileInput) fileInput.value = '';
};

const updatePreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      'http://localhost:3000/api/user/preferences',
      preferences,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    showNotification('success', 'Preferencias actualizadas');
  } catch (error) {
    console.error('Error updating preferences:', error);
    showNotification('error', 'Error al actualizar preferencias');
  }
};

const editPersonalInfo = () => {
  // Lógica para abrir modal de edición
  showNotification('info', 'Funcionalidad en desarrollo');
};

const confirmDeleteAccount = () => {
  if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
    // Lógica para eliminar cuenta
    showNotification('warning', 'Eliminar cuenta - Funcionalidad en desarrollo');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const showNotification = (type, message) => {
  const icons = {
    success: 'icon-check',
    error: 'icon-error',
    warning: 'icon-warning',
    info: 'icon-info'
  };
  
  notification.type = type;
  notification.message = message;
  notification.icon = icons[type];
  notification.show = true;
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    notification.show = false;
  }, 5000);
};

// Cargar preferencias al montar el componente
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await userStore.fetchUser(); // <-- carga los datos del usuario
      // Opcional: si tienes preferencias en tu API:
      const { data } = await axios.get('http://localhost:3000/api/user/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      Object.assign(preferences, data);
    }
  } catch (error) {
    console.error('Error loading user or preferences:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

.profile-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.profile-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* Panel izquierdo */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.avatar-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-image.uploading {
  opacity: 0.7;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.avatar-hint {
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  margin-top: 1rem;
}

.account-info {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-info h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.info-label {
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  color: #1a1a1a;
  font-weight: 500;
}

.info-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Panel derecho */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #1a1a1a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-field label {
  display: block;
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.info-field .info-value {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 1rem;
}

/* Preferencias */
.preferences {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.preference-info h4 {
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.preference-info p {
  color: #666;
  font-size: 0.875rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #2196F3;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* Zona de peligro */
.danger-zone {
  border: 2px solid #f44336;
}

.danger-zone .section-header h2 {
  color: #f44336;
}

.danger-actions {
  text-align: center;
}

.danger-hint {
  margin-top: 1rem;
  color: #666;
  font-size: 0.875rem;
}

/* Botones */
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-primary {
  background: #2196F3;
  color: white;
}

.button-primary:hover:not(:disabled) {
  background: #1976d2;
}

.button-outline {
  background: transparent;
  border: 2px solid #2196F3;
  color: #2196F3;
}

.button-outline:hover:not(:disabled) {
  background: #e3f2fd;
}

.button-text {
  background: transparent;
  color: #666;
}

.button-text:hover:not(:disabled) {
  color: #1a1a1a;
  background: #f5f5f5;
}

.button-danger {
  background: #f44336;
  color: white;
}

.button-danger:hover:not(:disabled) {
  background: #d32f2f;
}

.file-input-label {
  display: block;
  cursor: pointer;
}

.file-input {
  display: none;
}

/* Notificación */
.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification.success {
  background: #4caf50;
  color: white;
}

.notification.error {
  background: #f44336;
  color: white;
}

.notification.warning {
  background: #ff9800;
  color: white;
}

.notification.info {
  background: #2196f3;
  color: white;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-container {
    padding: 1rem;
  }
}
</style>