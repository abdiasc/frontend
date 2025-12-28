<template>
    <div class="configuracion-admin">
        <!-- Encabezado del panel -->
        <header class="admin-header">
            <div class="header-content">
                <h1><i class="fas fa-cogs"></i> Panel de Configuración</h1>
                <p class="welcome-text">Configura los ajustes generales del sistema, personaliza la apariencia y gestiona las opciones avanzadas.</p>
            </div>
            
            <!-- Acciones rápidas -->
            <div class="header-actions">
                <button class="btn btn-primary" @click="saveAllSettings">
                    <i class="fas fa-save"></i> Guardar Todo
                </button>
                <button class="btn btn-secondary" @click="resetToDefaults">
                    <i class="fas fa-undo"></i> Restaurar Valores
                </button>
            </div>
        </header>

        <!-- Menú lateral de navegación -->
        <div class="config-container">
            <nav class="config-nav">
                <div class="nav-section">
                    <h3><i class="fas fa-sliders-h"></i> Configuración</h3>
                    <ul class="nav-menu">
                        <li 
                            v-for="section in sections" 
                            :key="section.id"
                            :class="{ active: activeSection === section.id }"
                            @click="activeSection = section.id"
                        >
                            <i :class="section.icon"></i>
                            {{ section.name }}
                            <span v-if="section.hasChanges && hasChanges(section.id)" class="change-indicator"></span>
                        </li>
                    </ul>
                </div>
                
                <div class="nav-section">
                    <h3><i class="fas fa-tools"></i> Herramientas</h3>
                    <ul class="nav-menu">
                        <li @click="clearCache">
                            <i class="fas fa-broom"></i>
                            Limpiar Cache
                        </li>
                        <li @click="runBackup">
                            <i class="fas fa-database"></i>
                            Backup de Datos
                        </li>
                        <li @click="viewLogs">
                            <i class="fas fa-clipboard-list"></i>
                            Ver Logs del Sistema
                        </li>
                        <li @click="showSystemInfo">
                            <i class="fas fa-info-circle"></i>
                            Información del Sistema
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Contenido principal -->
            <main class="config-content">
                <!-- Sección General -->
                <section v-show="activeSection === 'general'" class="config-section">
                    <div class="section-header">
                        <h2><i class="fas fa-cog"></i> Configuración General</h2>
                        <button class="btn btn-sm" @click="saveSection('general')">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                    
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h3><i class="fas fa-globe"></i> Información del Sitio</h3>
                            <div class="form-group">
                                <label>Nombre del Sitio *</label>
                                <input 
                                    type="text" 
                                    v-model="settings.general.siteName"
                                    @change="markChanged('general')"
                                    placeholder="Mi Portafolio"
                                >
                            </div>
                            <div class="form-group">
                                <label>Descripción</label>
                                <textarea 
                                    v-model="settings.general.siteDescription"
                                    @change="markChanged('general')"
                                    placeholder="Descripción breve del sitio"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="form-group">
                                <label>URL Base</label>
                                <input 
                                    type="url" 
                                    v-model="settings.general.baseUrl"
                                    @change="markChanged('general')"
                                    placeholder="https://midominio.com"
                                >
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-language"></i> Configuración Regional</h3>
                            <div class="form-group">
                                <label>Idioma Predeterminado</label>
                                <select 
                                    v-model="settings.general.language"
                                    @change="markChanged('general')"
                                >
                                    <option value="es">Español</option>
                                    <option value="en">Inglés</option>
                                    <option value="fr">Francés</option>
                                    <option value="de">Alemán</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Zona Horaria</label>
                                <select 
                                    v-model="settings.general.timezone"
                                    @change="markChanged('general')"
                                >
                                    <option value="America/Mexico_City">CDMX (UTC-6)</option>
                                    <option value="America/New_York">Nueva York (UTC-5)</option>
                                    <option value="Europe/Madrid">Madrid (UTC+1)</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Formato de Fecha</label>
                                <select 
                                    v-model="settings.general.dateFormat"
                                    @change="markChanged('general')"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-user-shield"></i> Acceso y Seguridad</h3>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.general.requireLogin"
                                        @change="markChanged('general')"
                                    >
                                    <span>Requerir inicio de sesión</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.general.enable2FA"
                                        @change="markChanged('general')"
                                    >
                                    <span>Habilitar autenticación de dos factores</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.general.autoLogout"
                                        @change="markChanged('general')"
                                    >
                                    <span>Cerrar sesión automática después de 30 minutos</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label>Intentos de inicio de sesión máximos</label>
                                <input 
                                    type="number" 
                                    v-model.number="settings.general.maxLoginAttempts"
                                    @change="markChanged('general')"
                                    min="1"
                                    max="10"
                                >
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Sección Apariencia -->
                <section v-show="activeSection === 'apariencia'" class="config-section">
                    <div class="section-header">
                        <h2><i class="fas fa-palette"></i> Apariencia y Tema</h2>
                        <button class="btn btn-sm" @click="saveSection('apariencia')">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                    
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h3><i class="fas fa-paint-brush"></i> Tema Visual</h3>
                            <div class="theme-selector">
                                <div 
                                    v-for="theme in themes" 
                                    :key="theme.id"
                                    class="theme-option"
                                    :class="{ selected: settings.appearance.theme === theme.id }"
                                    @click="settings.appearance.theme = theme.id; markChanged('apariencia')"
                                >
                                    <div class="theme-preview" :style="theme.previewStyle"></div>
                                    <div class="theme-info">
                                        <strong>{{ theme.name }}</strong>
                                        <small>{{ theme.description }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-image"></i> Personalización</h3>
                            <div class="form-group">
                                <label>Logo del Sitio</label>
                                <div class="logo-upload">
                                    <div class="logo-preview">
                                        <img v-if="settings.appearance.logo" :src="settings.appearance.logo" alt="Logo">
                                        <div v-else class="logo-placeholder">
                                            <i class="fas fa-image"></i>
                                            <span>Sin logo</span>
                                        </div>
                                    </div>
                                    <div class="upload-controls">
                                        <button class="btn btn-sm" @click="uploadLogo">
                                            <i class="fas fa-upload"></i> Subir
                                        </button>
                                        <button class="btn btn-sm" @click="settings.appearance.logo = ''; markChanged('apariencia')">
                                            <i class="fas fa-trash"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Favicon</label>
                                <div class="favicon-upload">
                                    <div class="favicon-preview" v-if="settings.appearance.favicon">
                                        <img :src="settings.appearance.favicon" alt="Favicon">
                                    </div>
                                    <button class="btn btn-sm" @click="uploadFavicon">
                                        <i class="fas fa-image"></i> Cambiar Favicon
                                    </button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Color Principal</label>
                                <div class="color-picker">
                                    <input 
                                        type="color" 
                                        v-model="settings.appearance.primaryColor"
                                        @change="markChanged('apariencia')"
                                    >
                                    <span>{{ settings.appearance.primaryColor }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-font"></i> Tipografía</h3>
                            <div class="form-group">
                                <label>Fuente Principal</label>
                                <select 
                                    v-model="settings.appearance.fontFamily"
                                    @change="markChanged('apariencia')"
                                >
                                    <option value="'Inter', sans-serif">Inter (Moderno)</option>
                                    <option value="'Roboto', sans-serif">Roboto (Material)</option>
                                    <option value="'Open Sans', sans-serif">Open Sans (Claro)</option>
                                    <option value="'Poppins', sans-serif">Poppins (Elegante)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Tamaño de Fuente Base</label>
                                <div class="slider-container">
                                    <input 
                                        type="range" 
                                        v-model.number="settings.appearance.fontSize"
                                        @change="markChanged('apariencia')"
                                        min="12"
                                        max="18"
                                        step="1"
                                    >
                                    <span>{{ settings.appearance.fontSize }}px</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Modo de Color</label>
                                <div class="mode-selector">
                                    <button 
                                        class="mode-btn"
                                        :class="{ active: settings.appearance.colorMode === 'light' }"
                                        @click="settings.appearance.colorMode = 'light'; markChanged('apariencia')"
                                    >
                                        <i class="fas fa-sun"></i>
                                        <span>Claro</span>
                                    </button>
                                    <button 
                                        class="mode-btn"
                                        :class="{ active: settings.appearance.colorMode === 'dark' }"
                                        @click="settings.appearance.colorMode = 'dark'; markChanged('apariencia')"
                                    >
                                        <i class="fas fa-moon"></i>
                                        <span>Oscuro</span>
                                    </button>
                                    <button 
                                        class="mode-btn"
                                        :class="{ active: settings.appearance.colorMode === 'auto' }"
                                        @click="settings.appearance.colorMode = 'auto'; markChanged('apariencia')"
                                    >
                                        <i class="fas fa-adjust"></i>
                                        <span>Automático</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Sección Usuarios -->
                <section v-show="activeSection === 'usuarios'" class="config-section">
                    <div class="section-header">
                        <h2><i class="fas fa-users-cog"></i> Gestión de Usuarios</h2>
                        <button class="btn btn-primary btn-sm" @click="openAddUserModal">
                            <i class="fas fa-user-plus"></i> Nuevo Usuario
                        </button>
                    </div>
                    
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h3><i class="fas fa-shield-alt"></i> Permisos y Roles</h3>
                            <div class="roles-list">
                                <div 
                                    v-for="role in roles" 
                                    :key="role.id"
                                    class="role-item"
                                >
                                    <div class="role-header">
                                        <div class="role-info">
                                            <h4>{{ role.name }}</h4>
                                            <span class="user-count">{{ role.userCount }} usuarios</span>
                                        </div>
                                        <button class="btn btn-sm" @click="editRole(role)">
                                            <i class="fas fa-edit"></i> Editar
                                        </button>
                                    </div>
                                    <p class="role-description">{{ role.description }}</p>
                                    <div class="role-permissions">
                                        <span 
                                            v-for="permission in role.permissions.slice(0, 3)" 
                                            :key="permission"
                                            class="permission-tag"
                                        >
                                            {{ permission }}
                                        </span>
                                        <span v-if="role.permissions.length > 3" class="more-permissions">
                                            +{{ role.permissions.length - 3 }} más
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-user-check"></i> Configuración de Usuarios</h3>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.users.allowRegistration"
                                        @change="markChanged('usuarios')"
                                    >
                                    <span>Permitir registro público</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.users.emailVerification"
                                        @change="markChanged('usuarios')"
                                    >
                                    <span>Requiere verificación de email</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.users.autoApprove"
                                        @change="markChanged('usuarios')"
                                    >
                                    <span>Aprobación automática de usuarios</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label>Límite de sesiones concurrentes</label>
                                <input 
                                    type="number" 
                                    v-model.number="settings.users.concurrentSessions"
                                    @change="markChanged('usuarios')"
                                    min="1"
                                    max="10"
                                >
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-history"></i> Historial de Usuarios</h3>
                            <div class="user-activity">
                                <div class="activity-filters">
                                    <select v-model="activityFilter">
                                        <option value="all">Todas las actividades</option>
                                        <option value="login">Inicios de sesión</option>
                                        <option value="password">Cambios de contraseña</option>
                                        <option value="profile">Modificaciones de perfil</option>
                                    </select>
                                </div>
                                <div class="activity-list">
                                    <div 
                                        v-for="activity in filteredActivities" 
                                        :key="activity.id"
                                        class="activity-item"
                                    >
                                        <div class="activity-icon" :class="activity.type">
                                            <i :class="getActivityIcon(activity.type)"></i>
                                        </div>
                                        <div class="activity-details">
                                            <p>{{ activity.description }}</p>
                                            <small>
                                                {{ formatDate(activity.timestamp) }} 
                                                por <strong>{{ activity.user }}</strong>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Sección Notificaciones -->
                <section v-show="activeSection === 'notificaciones'" class="config-section">
                    <div class="section-header">
                        <h2><i class="fas fa-bell"></i> Sistema de Notificaciones</h2>
                        <button class="btn btn-sm" @click="saveSection('notificaciones')">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                    
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h3><i class="fas fa-envelope"></i> Configuración de Email</h3>
                            <div class="form-group">
                                <label>SMTP Server</label>
                                <input 
                                    type="text" 
                                    v-model="settings.notifications.smtpServer"
                                    @change="markChanged('notificaciones')"
                                    placeholder="smtp.gmail.com"
                                >
                            </div>
                            <div class="form-group">
                                <label>Puerto SMTP</label>
                                <input 
                                    type="number" 
                                    v-model.number="settings.notifications.smtpPort"
                                    @change="markChanged('notificaciones')"
                                    placeholder="587"
                                >
                            </div>
                            <div class="form-group">
                                <label>Email del Remitente</label>
                                <input 
                                    type="email" 
                                    v-model="settings.notifications.senderEmail"
                                    @change="markChanged('notificaciones')"
                                    placeholder="noreply@tudominio.com"
                                >
                            </div>
                            <div class="form-group">
                                <label>Método de Autenticación</label>
                                <select 
                                    v-model="settings.notifications.authMethod"
                                    @change="markChanged('notificaciones')"
                                >
                                    <option value="none">Ninguna</option>
                                    <option value="password">Contraseña</option>
                                    <option value="oauth2">OAuth 2.0</option>
                                </select>
                            </div>
                            <button class="btn btn-sm" @click="testEmail">
                                <i class="fas fa-paper-plane"></i> Probar Configuración
                            </button>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-bell-slash"></i> Preferencias de Notificaciones</h3>
                            <div class="notification-preferences">
                                <div class="preference-item">
                                    <div class="preference-info">
                                        <strong>Notificaciones por Email</strong>
                                        <small>Recibir notificaciones importantes por correo</small>
                                    </div>
                                    <label class="switch">
                                        <input 
                                            type="checkbox" 
                                            v-model="settings.notifications.emailNotifications"
                                            @change="markChanged('notificaciones')"
                                        >
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                
                                <div class="preference-item">
                                    <div class="preference-info">
                                        <strong>Nuevos Usuarios</strong>
                                        <small>Notificar cuando se registre un nuevo usuario</small>
                                    </div>
                                    <label class="switch">
                                        <input 
                                            type="checkbox" 
                                            v-model="settings.notifications.newUserAlert"
                                            @change="markChanged('notificaciones')"
                                        >
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                
                                <div class="preference-item">
                                    <div class="preference-info">
                                        <strong>Actualizaciones del Sistema</strong>
                                        <small>Notificar sobre actualizaciones disponibles</small>
                                    </div>
                                    <label class="switch">
                                        <input 
                                            type="checkbox" 
                                            v-model="settings.notifications.systemUpdates"
                                            @change="markChanged('notificaciones')"
                                        >
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                
                                <div class="preference-item">
                                    <div class="preference-info">
                                        <strong>Recordatorios de Backup</strong>
                                        <small>Recordatorios automáticos para realizar backups</small>
                                    </div>
                                    <label class="switch">
                                        <input 
                                            type="checkbox" 
                                            v-model="settings.notifications.backupReminders"
                                            @change="markChanged('notificaciones')"
                                        >
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-mobile-alt"></i> Notificaciones Push</h3>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.notifications.pushEnabled"
                                        @change="markChanged('notificaciones')"
                                    >
                                    <span>Habilitar notificaciones push</span>
                                </label>
                            </div>
                            <div v-if="settings.notifications.pushEnabled" class="push-settings">
                                <div class="form-group">
                                    <label>Clave Pública VAPID</label>
                                    <input 
                                        type="text" 
                                        v-model="settings.notifications.vapidKey"
                                        @change="markChanged('notificaciones')"
                                        placeholder="Clave pública para Web Push"
                                    >
                                </div>
                                <div class="form-group">
                                    <label>Frecuencia de Notificaciones</label>
                                    <select 
                                        v-model="settings.notifications.pushFrequency"
                                        @change="markChanged('notificaciones')"
                                    >
                                        <option value="instant">Inmediato</option>
                                        <option value="hourly">Cada hora</option>
                                        <option value="daily">Diario</option>
                                    </select>
                                </div>
                            </div>
                            <button class="btn btn-sm" @click="sendTestNotification">
                                <i class="fas fa-bell"></i> Probar Notificación
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Sección Avanzado -->
                <section v-show="activeSection === 'avanzado'" class="config-section">
                    <div class="section-header">
                        <h2><i class="fas fa-code"></i> Configuración Avanzada</h2>
                        <button class="btn btn-sm" @click="saveSection('avanzado')">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                    
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h3><i class="fas fa-database"></i> Configuración de Base de Datos</h3>
                            <div class="form-group">
                                <label>Tipo de Base de Datos</label>
                                <select 
                                    v-model="settings.advanced.databaseType"
                                    @change="markChanged('avanzado')"
                                >
                                    <option value="mysql">MySQL</option>
                                    <option value="postgresql">PostgreSQL</option>
                                    <option value="sqlite">SQLite</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Host de Base de Datos</label>
                                <input 
                                    type="text" 
                                    v-model="settings.advanced.dbHost"
                                    @change="markChanged('avanzado')"
                                    placeholder="localhost"
                                >
                            </div>
                            <div class="form-group">
                                <label>Nombre de Base de Datos</label>
                                <input 
                                    type="text" 
                                    v-model="settings.advanced.dbName"
                                    @change="markChanged('avanzado')"
                                    placeholder="mi_portafolio"
                                >
                            </div>
                            <div class="form-group">
                                <label>Tiempo de Espera de Conexión (segundos)</label>
                                <input 
                                    type="number" 
                                    v-model.number="settings.advanced.dbTimeout"
                                    @change="markChanged('avanzado')"
                                    min="1"
                                    max="60"
                                >
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-server"></i> Configuración del Servidor</h3>
                            <div class="form-group">
                                <label>Tiempo de Espera de Solicitud (segundos)</label>
                                <input 
                                    type="number" 
                                    v-model.number="settings.advanced.requestTimeout"
                                    @change="markChanged('avanzado')"
                                    min="10"
                                    max="300"
                                >
                            </div>
                            <div class="form-group">
                                <label>Límite de Tamaño de Subida (MB)</label>
                                <input 
                                    type="number" 
                                    v-model.number="settings.advanced.uploadLimit"
                                    @change="markChanged('avanzado')"
                                    min="1"
                                    max="100"
                                >
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.advanced.enableCaching"
                                        @change="markChanged('avanzado')"
                                    >
                                    <span>Habilitar caché</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.advanced.enableCompression"
                                        @change="markChanged('avanzado')"
                                    >
                                    <span>Habilitar compresión GZIP</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="setting-card">
                            <h3><i class="fas fa-bug"></i> Depuración y Logs</h3>
                            <div class="form-group">
                                <label>Nivel de Log</label>
                                <select 
                                    v-model="settings.advanced.logLevel"
                                    @change="markChanged('avanzado')"
                                >
                                    <option value="error">Solo Errores</option>
                                    <option value="warn">Advertencias</option>
                                    <option value="info">Información</option>
                                    <option value="debug">Depuración</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="settings.advanced.enableDebug"
                                        @change="markChanged('avanzado')"
                                    >
                                    <span>Modo de depuración</span>
                                </label>
                                <small v-if="settings.advanced.enableDebug" class="warning-text">
                                    ⚠️ Solo usar en desarrollo
                                </small>
                            </div>
                            <div class="form-group">
                                <label>Ruta de Logs</label>
                                <input 
                                    type="text" 
                                    v-model="settings.advanced.logPath"
                                    @change="markChanged('avanzado')"
                                    placeholder="./logs"
                                >
                            </div>
                            <button class="btn btn-sm" @click="downloadLogs">
                                <i class="fas fa-download"></i> Descargar Logs
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>

        <!-- Modal de información del sistema -->
        <div v-if="showSystemModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> Información del Sistema</h3>
                    <button class="close-modal" @click="showSystemModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="system-info-grid">
                        <div class="info-item">
                            <strong>Versión del Sistema</strong>
                            <span>v2.5.1</span>
                        </div>
                        <div class="info-item">
                            <strong>Última Actualización</strong>
                            <span>2024-01-20</span>
                        </div>
                        <div class="info-item">
                            <strong>Base de Datos</strong>
                            <span>MySQL 8.0</span>
                        </div>
                        <div class="info-item">
                            <strong>Uso de Memoria</strong>
                            <span>{{ systemInfo.memory }} MB</span>
                        </div>
                        <div class="info-item">
                            <strong>Uso de CPU</strong>
                            <span>{{ systemInfo.cpu }}%</span>
                        </div>
                        <div class="info-item">
                            <strong>Espacio en Disco</strong>
                            <span>{{ systemInfo.disk }} GB libres</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfiguracionAdmin',
    data() {
        return {
            activeSection: 'general',
            sections: [
                { id: 'general', name: 'General', icon: 'fas fa-cog', hasChanges: false },
                { id: 'apariencia', name: 'Apariencia', icon: 'fas fa-palette', hasChanges: false },
                { id: 'usuarios', name: 'Usuarios', icon: 'fas fa-users-cog', hasChanges: false },
                { id: 'notificaciones', name: 'Notificaciones', icon: 'fas fa-bell', hasChanges: false },
                { id: 'avanzado', name: 'Avanzado', icon: 'fas fa-code', hasChanges: false }
            ],
            
            // Configuración general
            settings: {
                general: {
                    siteName: 'Mi Portafolio',
                    siteDescription: 'Portafolio profesional de trabajos y proyectos',
                    baseUrl: 'https://midominio.com',
                    language: 'es',
                    timezone: 'America/Mexico_City',
                    dateFormat: 'DD/MM/YYYY',
                    requireLogin: true,
                    enable2FA: false,
                    autoLogout: true,
                    maxLoginAttempts: 5
                },
                appearance: {
                    theme: 'default',
                    logo: '',
                    favicon: '',
                    primaryColor: '#667eea',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    colorMode: 'light'
                },
                users: {
                    allowRegistration: true,
                    emailVerification: true,
                    autoApprove: false,
                    concurrentSessions: 3
                },
                notifications: {
                    smtpServer: 'smtp.gmail.com',
                    smtpPort: 587,
                    senderEmail: 'noreply@midominio.com',
                    authMethod: 'password',
                    emailNotifications: true,
                    newUserAlert: true,
                    systemUpdates: true,
                    backupReminders: true,
                    pushEnabled: false,
                    vapidKey: '',
                    pushFrequency: 'instant'
                },
                advanced: {
                    databaseType: 'mysql',
                    dbHost: 'localhost',
                    dbName: 'portafolio_db',
                    dbTimeout: 30,
                    requestTimeout: 60,
                    uploadLimit: 10,
                    enableCaching: true,
                    enableCompression: true,
                    logLevel: 'info',
                    enableDebug: false,
                    logPath: './logs'
                }
            },
            
            // Temas disponibles
            themes: [
                {
                    id: 'default',
                    name: 'Clásico',
                    description: 'Tema claro con colores primarios',
                    previewStyle: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
                },
                {
                    id: 'dark',
                    name: 'Oscuro',
                    description: 'Tema oscuro para uso nocturno',
                    previewStyle: 'background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);'
                },
                {
                    id: 'minimal',
                    name: 'Minimalista',
                    description: 'Diseño limpio y simple',
                    previewStyle: 'background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 1px solid #e2e8f0;'
                },
                {
                    id: 'modern',
                    name: 'Moderno',
                    description: 'Diseño con gradientes y bordes redondeados',
                    previewStyle: 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);'
                }
            ],
            
            // Roles de usuario
            roles: [
                {
                    id: 1,
                    name: 'Administrador',
                    description: 'Acceso completo a todas las funciones del sistema',
                    userCount: 1,
                    permissions: ['all']
                },
                {
                    id: 2,
                    name: 'Editor',
                    description: 'Puede crear y editar contenido, pero no configuraciones',
                    userCount: 3,
                    permissions: ['create_content', 'edit_content', 'delete_content', 'upload_files']
                },
                {
                    id: 3,
                    name: 'Lector',
                    description: 'Solo puede ver contenido, sin permisos de edición',
                    userCount: 15,
                    permissions: ['read_content']
                }
            ],
            
            // Actividades de usuario
            activities: [
                {
                    id: 1,
                    type: 'login',
                    description: 'Inicio de sesión exitoso',
                    user: 'admin',
                    timestamp: '2024-01-20T10:30:00'
                },
                {
                    id: 2,
                    type: 'password',
                    description: 'Contraseña actualizada',
                    user: 'maria.gonzalez',
                    timestamp: '2024-01-20T09:15:00'
                },
                {
                    id: 3,
                    type: 'profile',
                    description: 'Perfil de usuario actualizado',
                    user: 'carlos.rodriguez',
                    timestamp: '2024-01-19T16:45:00'
                },
                {
                    id: 4,
                    type: 'login',
                    description: 'Intento de inicio de sesión fallido',
                    user: 'usuario.anonimo',
                    timestamp: '2024-01-19T14:20:00'
                }
            ],
            
            // Información del sistema
            systemInfo: {
                memory: 256,
                cpu: 23,
                disk: 15.8
            },
            
            // Filtros y estados
            activityFilter: 'all',
            showSystemModal: false,
            changedSections: new Set()
        }
    },
    computed: {
        filteredActivities() {
            if (this.activityFilter === 'all') {
                return this.activities;
            }
            return this.activities.filter(activity => activity.type === this.activityFilter);
        }
    },
    methods: {
        hasChanges(sectionId) {
            return this.changedSections.has(sectionId);
        },
        
        markChanged(sectionId) {
            this.changedSections.add(sectionId);
            const section = this.sections.find(s => s.id === sectionId);
            if (section) {
                section.hasChanges = true;
            }
        },
        
        saveSection(sectionId) {
            // En una implementación real, aquí se enviaría al backend
            console.log(`Guardando sección ${sectionId}:`, this.settings[sectionId]);
            
            // Marcar como guardado
            this.changedSections.delete(sectionId);
            const section = this.sections.find(s => s.id === sectionId);
            if (section) {
                section.hasChanges = false;
            }
            
            alert(`Configuración de ${this.getSectionName(sectionId)} guardada exitosamente`);
        },
        
        saveAllSettings() {
            if (this.changedSections.size === 0) {
                alert('No hay cambios para guardar');
                return;
            }
            
            // En una implementación real, se enviarían todas las secciones cambiadas
            this.changedSections.forEach(sectionId => {
                console.log(`Guardando ${sectionId}:`, this.settings[sectionId]);
            });
            
            // Limpiar todos los cambios
            this.changedSections.clear();
            this.sections.forEach(section => {
                section.hasChanges = false;
            });
            
            alert('Todas las configuraciones han sido guardadas');
        },
        
        resetToDefaults() {
            if (confirm('¿Estás seguro de restaurar todos los valores por defecto? Se perderán los cambios no guardados.')) {
                // Restaurar valores por defecto
                this.settings = {
                    general: {
                        siteName: 'Mi Portafolio',
                        siteDescription: 'Portafolio profesional de trabajos y proyectos',
                        baseUrl: 'https://midominio.com',
                        language: 'es',
                        timezone: 'America/Mexico_City',
                        dateFormat: 'DD/MM/YYYY',
                        requireLogin: true,
                        enable2FA: false,
                        autoLogout: true,
                        maxLoginAttempts: 5
                    },
                    appearance: {
                        theme: 'default',
                        logo: '',
                        favicon: '',
                        primaryColor: '#667eea',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 16,
                        colorMode: 'light'
                    },
                    users: {
                        allowRegistration: true,
                        emailVerification: true,
                        autoApprove: false,
                        concurrentSessions: 3
                    },
                    notifications: {
                        smtpServer: 'smtp.gmail.com',
                        smtpPort: 587,
                        senderEmail: 'noreply@midominio.com',
                        authMethod: 'password',
                        emailNotifications: true,
                        newUserAlert: true,
                        systemUpdates: true,
                        backupReminders: true,
                        pushEnabled: false,
                        vapidKey: '',
                        pushFrequency: 'instant'
                    },
                    advanced: {
                        databaseType: 'mysql',
                        dbHost: 'localhost',
                        dbName: 'portafolio_db',
                        dbTimeout: 30,
                        requestTimeout: 60,
                        uploadLimit: 10,
                        enableCaching: true,
                        enableCompression: true,
                        logLevel: 'info',
                        enableDebug: false,
                        logPath: './logs'
                    }
                };
                
                this.changedSections.clear();
                this.sections.forEach(section => {
                    section.hasChanges = false;
                });
                
                alert('Valores por defecto restaurados');
            }
        },
        
        getSectionName(sectionId) {
            const section = this.sections.find(s => s.id === sectionId);
            return section ? section.name : sectionId;
        },
        
        getActivityIcon(type) {
            const icons = {
                login: 'fas fa-sign-in-alt',
                password: 'fas fa-key',
                profile: 'fas fa-user-edit'
            };
            return icons[type] || 'fas fa-circle';
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        uploadLogo() {
            // Simulación de subida de archivo
            alert('Funcionalidad de subida de logo. En implementación real, se usaría un input type="file"');
        },
        
        uploadFavicon() {
            // Simulación de subida de favicon
            alert('Funcionalidad de subida de favicon. En implementación real, se usaría un input type="file"');
        },
        
        editRole(role) {
            alert(`Editando rol: ${role.name}`);
            // Implementar lógica de edición de roles
        },
        
        openAddUserModal() {
            alert('Abriendo modal para agregar nuevo usuario');
            // Implementar modal de nuevo usuario
        },
        
        testEmail() {
            alert('Enviando email de prueba...');
            // Implementar prueba de configuración de email
        },
        
        sendTestNotification() {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Prueba de notificación', {
                    body: 'Esta es una notificación de prueba del sistema',
                    icon: '/favicon.ico'
                });
            } else {
                alert('Notificación enviada (simulación)');
            }
        },
        
        downloadLogs() {
            alert('Descargando archivo de logs...');
            // Implementar descarga de logs
        },
        
        clearCache() {
            if (confirm('¿Estás seguro de limpiar la caché del sistema?')) {
                alert('Caché limpiada exitosamente');
                // Implementar limpieza de caché
            }
        },
        
        runBackup() {
            alert('Iniciando proceso de backup...');
            // Implementar sistema de backup
        },
        
        viewLogs() {
            alert('Mostrando logs del sistema...');
            // Implementar visor de logs
        },
        
        showSystemInfo() {
            // Actualizar información del sistema (simulación)
            this.systemInfo = {
                memory: Math.floor(Math.random() * 100) + 200,
                cpu: Math.floor(Math.random() * 50),
                disk: (Math.random() * 5 + 15).toFixed(1)
            };
            this.showSystemModal = true;
        }
    }
}
</script>

<style scoped>
.configuracion-admin {
    padding: 1.5rem;
    max-width: 1600px;
    margin: 0 auto;
    background-color: #f8fafc;
    min-height: 100vh;
}

/* Encabezado */
.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.header-content h1 {
    color: #1a202c;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.welcome-text {
    color: #718096;
    font-size: 1.1rem;
    max-width: 600px;
}

.header-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Botones */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-secondary {
    background-color: #e2e8f0;
    color: #4a5568;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

/* Contenedor principal */
.config-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    min-height: calc(100vh - 200px);
}

/* Navegación lateral */
.config-nav {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    height: fit-content;
    position: sticky;
    top: 2rem;
}

.nav-section {
    margin-bottom: 2rem;
}

.nav-section:last-child {
    margin-bottom: 0;
}

.nav-section h3 {
    color: #4a5568;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-menu li {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
    margin-bottom: 0.25rem;
    position: relative;
}

.nav-menu li:hover {
    background-color: #f7fafc;
    color: #667eea;
}

.nav-menu li.active {
    background-color: #ebf4ff;
    color: #667eea;
    font-weight: 600;
}

.nav-menu li i {
    width: 20px;
    text-align: center;
}

.change-indicator {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background-color: #48bb78;
    border-radius: 50%;
}

/* Contenido principal */
.config-content {
    flex: 1;
}

.config-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.section-header h2 {
    color: #1a202c;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

/* Grid de configuraciones */
.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
}

.setting-card {
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.setting-card:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.setting-card h3 {
    color: #2d3748;
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Formularios */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
    font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #4a5568;
    transition: all 0.3s ease;
    background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.form-group input[type="number"] {
    width: 100px;
}

/* Checkboxes */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

/* Selector de temas */
.theme-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.theme-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.theme-option:hover {
    border-color: #cbd5e0;
}

.theme-option.selected {
    border-color: #667eea;
    background-color: #ebf4ff;
}

.theme-preview {
    width: 60px;
    height: 40px;
    border-radius: 6px;
    flex-shrink: 0;
}

.theme-info {
    flex: 1;
}

.theme-info strong {
    display: block;
    color: #2d3748;
    font-size: 0.875rem;
}

.theme-info small {
    color: #718096;
    font-size: 0.75rem;
}

/* Subida de archivos */
.logo-upload {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.logo-preview {
    width: 120px;
    height: 60px;
    border: 2px dashed #e2e8f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #f7fafc;
}

.logo-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.logo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #a0aec0;
}

.logo-placeholder i {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
}

.upload-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.favicon-upload {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.favicon-preview {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    overflow: hidden;
}

.favicon-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Selector de color */
.color-picker {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.color-picker input[type="color"] {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding: 0;
}

/* Slider */
.slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.slider-container input[type="range"] {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #e2e8f0;
    outline: none;
    -webkit-appearance: none;
}

.slider-container input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
}

/* Selector de modo */
.mode-selector {
    display: flex;
    gap: 0.5rem;
}

.mode-btn {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.mode-btn:hover {
    border-color: #cbd5e0;
}

.mode-btn.active {
    border-color: #667eea;
    background-color: #ebf4ff;
    color: #667eea;
}

.mode-btn i {
    font-size: 1.25rem;
}

/* Roles */
.roles-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.role-item {
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #f8fafc;
}

.role-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.role-info h4 {
    margin: 0;
    color: #2d3748;
    font-size: 1rem;
}

.user-count {
    color: #718096;
    font-size: 0.75rem;
}

.role-description {
    color: #718096;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
}

.role-permissions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.permission-tag {
    padding: 0.25rem 0.5rem;
    background-color: #e2e8f0;
    color: #4a5568;
    border-radius: 4px;
    font-size: 0.75rem;
}

.more-permissions {
    color: #a0aec0;
    font-size: 0.75rem;
    align-self: center;
}

/* Actividades de usuario */
.user-activity {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.activity-filters select {
    width: 100%;
}

.activity-list {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.activity-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.activity-icon.login {
    background-color: #48bb78;
}

.activity-icon.password {
    background-color: #4299e1;
}

.activity-icon.profile {
    background-color: #ed8936;
}

.activity-details {
    flex: 1;
}

.activity-details p {
    margin: 0 0 0.25rem;
    color: #4a5568;
    font-size: 0.875rem;
}

.activity-details small {
    color: #a0aec0;
    font-size: 0.75rem;
}

/* Preferencias de notificaciones */
.notification-preferences {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.preference-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.preference-info {
    flex: 1;
}

.preference-info strong {
    display: block;
    color: #4a5568;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

.preference-info small {
    color: #718096;
    font-size: 0.75rem;
}

/* Switch */
.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e0;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #667eea;
}

input:checked + .slider:before {
    transform: translateX(26px);
}

/* Configuración push */
.push-settings {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.warning-text {
    display: block;
    color: #ed8936;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
    margin: 0;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #a0aec0;
    cursor: pointer;
    line-height: 1;
}

.modal-body {
    padding: 1.5rem;
}

.system-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-item strong {
    color: #718096;
    font-size: 0.875rem;
}

.info-item span {
    color: #2d3748;
    font-size: 0.875rem;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
    .config-container {
        grid-template-columns: 1fr;
    }
    
    .config-nav {
        position: static;
        margin-bottom: 2rem;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .configuracion-admin {
        padding: 1rem;
    }
    
    .admin-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .header-actions {
        width: 100%;
        justify-content: center;
    }
    
    .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    
    .section-header h2 {
        text-align: center;
    }
    
    .theme-option {
        flex-direction: column;
        text-align: center;
    }
    
    .logo-upload {
        flex-direction: column;
        align-items: stretch;
    }
    
    .preference-item {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }
    
    .mode-selector {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .header-content h1 {
        font-size: 1.5rem;
    }
    
    .config-section {
        padding: 1rem;
    }
    
    .system-info-grid {
        grid-template-columns: 1fr;
    }
}
</style>