<template>
    <div class="clientes-admin">
        <!-- Encabezado del panel -->
        <header class="admin-header">
            <div class="header-content">
                <h1><i class="fas fa-users"></i> Gestión de Clientes</h1>
                <p class="welcome-text">Administra la información de tus clientes, segmenta por categorías y realiza seguimiento de sus actividades.</p>
            </div>
            
            <!-- Acciones principales -->
            <div class="header-actions">
                <button class="btn btn-primary" @click="openAddModal">
                    <i class="fas fa-user-plus"></i> Nuevo Cliente
                </button>
                <button class="btn btn-secondary" @click="exportClients">
                    <i class="fas fa-file-export"></i> Exportar
                </button>
                <button class="btn btn-secondary" @click="showImport = true">
                    <i class="fas fa-file-import"></i> Importar
                </button>
            </div>
        </header>

        <!-- Filtros y búsqueda -->
        <div class="filters-section">
            <div class="search-container">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Buscar por nombre, email, empresa..."
                        @input="applyFilters"
                    >
                </div>
                
                <div class="filter-actions">
                    <div class="filter-group">
                        <label><i class="fas fa-filter"></i> Estado:</label>
                        <select v-model="filterStatus" @change="applyFilters">
                            <option value="">Todos</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="prospecto">Prospecto</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label><i class="fas fa-star"></i> Tipo:</label>
                        <select v-model="filterType" @change="applyFilters">
                            <option value="">Todos</option>
                            <option value="empresa">Empresa</option>
                            <option value="individual">Individual</option>
                            <option value="gobierno">Gobierno</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label><i class="fas fa-calendar"></i> Ordenar por:</label>
                        <select v-model="sortBy" @change="applyFilters">
                            <option value="fecha_creacion">Fecha de Registro</option>
                            <option value="nombre">Nombre</option>
                            <option value="valor">Valor Total</option>
                            <option value="ultimo_contacto">Último Contacto</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="client-stats">
            <div class="stat-card">
                <div class="stat-icon total">
                    <i class="fas fa-user-friends"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Clientes</h3>
                    <p class="stat-number">{{ totalClients }}</p>
                    <span class="stat-trend positive">+{{ newThisMonth }} este mes</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon active">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h3>Clientes Activos</h3>
                    <p class="stat-number">{{ activeClients }}</p>
                    <span class="stat-percentage">{{ activePercentage }}% del total</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon value">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>Valor Total</h3>
                    <p class="stat-number">${{ formatCurrency(totalValue) }}</p>
                    <span class="stat-trend positive">+{{ monthlyGrowth }}% vs mes anterior</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pendientes</h3>
                    <p class="stat-number">{{ pendingActions }}</p>
                    <span class="stat-actions">{{ overdueTasks }} vencidas</span>
                </div>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="main-content">
            <!-- Lista de clientes -->
            <div class="clients-section">
                <div class="section-header">
                    <h2><i class="fas fa-list"></i> Lista de Clientes</h2>
                    <div class="section-info">
                        <span class="results-count">{{ filteredClients.length }} clientes encontrados</span>
                        <div class="view-toggle">
                            <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                                <i class="fas fa-th-large"></i>
                            </button>
                            <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                                <i class="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vista de cuadrícula -->
                <div v-if="viewMode === 'grid'" class="clients-grid">
                    <div 
                        v-for="client in filteredClients" 
                        :key="client.id"
                        class="client-card"
                        @click="selectClient(client)"
                        :class="{ selected: selectedClient?.id === client.id }"
                    >
                        <div class="client-card-header">
                            <div class="client-avatar" :style="{ backgroundColor: getAvatarColor(client.nombre) }">
                                {{ getInitials(client.nombre) }}
                            </div>
                            <div class="client-status" :class="client.estado">
                                {{ client.estado }}
                            </div>
                        </div>
                        
                        <div class="client-card-body">
                            <h3>{{ client.nombre }}</h3>
                            <p class="client-empresa">{{ client.empresa }}</p>
                            <p class="client-email">
                                <i class="fas fa-envelope"></i> {{ client.email }}
                            </p>
                            <p class="client-phone">
                                <i class="fas fa-phone"></i> {{ client.telefono }}
                            </p>
                            
                            <div class="client-meta">
                                <div class="meta-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>Desde {{ formatDate(client.fecha_registro) }}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-dollar-sign"></i>
                                    <span>${{ formatCurrency(client.valor_total) }}</span>
                                </div>
                            </div>
                            
                            <div class="client-tags">
                                <span class="client-tag" :class="client.tipo">{{ client.tipo }}</span>
                                <span v-if="client.proyectos_activos" class="project-badge">
                                    <i class="fas fa-project-diagram"></i> {{ client.proyectos_activos }} proyectos
                                </span>
                            </div>
                        </div>
                        
                        <div class="client-card-actions">
                            <button class="action-btn" @click.stop="sendEmail(client)">
                                <i class="fas fa-envelope"></i>
                            </button>
                            <button class="action-btn" @click.stop="callClient(client)">
                                <i class="fas fa-phone"></i>
                            </button>
                            <button class="action-btn" @click.stop="editClient(client)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn danger" @click.stop="deleteClient(client.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vista de tabla -->
                <div v-else class="clients-table-container">
                    <table class="clients-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                                </th>
                                <th @click="sortTable('nombre')">
                                    Cliente
                                    <i class="fas" :class="sortIcon('nombre')"></i>
                                </th>
                                <th @click="sortTable('empresa')">
                                    Empresa
                                    <i class="fas" :class="sortIcon('empresa')"></i>
                                </th>
                                <th @click="sortTable('email')">Contacto</th>
                                <th @click="sortTable('tipo')">Tipo</th>
                                <th @click="sortTable('estado')">Estado</th>
                                <th @click="sortTable('valor_total')">Valor Total</th>
                                <th @click="sortTable('ultimo_contacto')">Último Contacto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="client in filteredClients" 
                                :key="client.id"
                                :class="{ selected: selectedClient?.id === client.id }"
                                @click="selectClient(client)"
                            >
                                <td>
                                    <input 
                                        type="checkbox" 
                                        :value="client.id" 
                                        v-model="selectedIds"
                                        @click.stop
                                    >
                                </td>
                                <td>
                                    <div class="client-cell">
                                        <div class="client-avatar-sm" :style="{ backgroundColor: getAvatarColor(client.nombre) }">
                                            {{ getInitials(client.nombre) }}
                                        </div>
                                        <div class="client-info">
                                            <strong>{{ client.nombre }}</strong>
                                            <small class="text-muted">ID: {{ client.id }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ client.empresa }}</td>
                                <td>
                                    <div class="contact-info">
                                        <div><i class="fas fa-envelope"></i> {{ client.email }}</div>
                                        <div><i class="fas fa-phone"></i> {{ client.telefono }}</div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge" :class="client.tipo">{{ client.tipo }}</span>
                                </td>
                                <td>
                                    <span class="status-badge" :class="client.estado">
                                        {{ client.estado }}
                                    </span>
                                </td>
                                <td class="text-right">
                                    <strong>${{ formatCurrency(client.valor_total) }}</strong>
                                </td>
                                <td>
                                    <div class="last-contact">
                                        {{ formatDate(client.ultimo_contacto) }}
                                        <div class="contact-type" :class="client.tipo_contacto">
                                            <i :class="getContactIcon(client.tipo_contacto)"></i>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="table-actions" @click.stop>
                                        <button class="table-btn" @click="editClient(client)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="table-btn" @click="viewDetails(client)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="table-btn danger" @click="deleteClient(client.id)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Paginación -->
                <div class="pagination" v-if="filteredClients.length > itemsPerPage">
                    <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button 
                        v-for="page in totalPages" 
                        :key="page"
                        class="pagination-btn"
                        :class="{ active: page === currentPage }"
                        @click="currentPage = page"
                    >
                        {{ page }}
                    </button>
                    
                    <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <span class="page-info">
                        Página {{ currentPage }} de {{ totalPages }}
                    </span>
                </div>

                <!-- Acciones masivas -->
                <div class="bulk-actions" v-if="selectedIds.length > 0">
                    <span class="selected-count">{{ selectedIds.length }} clientes seleccionados</span>
                    <button class="btn btn-sm" @click="sendBulkEmail">
                        <i class="fas fa-envelope"></i> Email Masivo
                    </button>
                    <button class="btn btn-sm" @click="updateBulkStatus">
                        <i class="fas fa-tag"></i> Cambiar Estado
                    </button>
                    <button class="btn btn-sm danger" @click="deleteBulk">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>

            <!-- Panel lateral de detalles -->
            <div class="sidebar" v-if="selectedClient">
                <div class="sidebar-header">
                    <h3>Detalles del Cliente</h3>
                    <button class="close-sidebar" @click="selectedClient = null">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="client-details">
                    <div class="client-header">
                        <div class="client-avatar-lg" :style="{ backgroundColor: getAvatarColor(selectedClient.nombre) }">
                            {{ getInitials(selectedClient.nombre) }}
                        </div>
                        <div class="client-title">
                            <h2>{{ selectedClient.nombre }}</h2>
                            <p class="client-subtitle">{{ selectedClient.empresa }}</p>
                            <div class="client-status-lg" :class="selectedClient.estado">
                                {{ selectedClient.estado }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-info-circle"></i> Información de Contacto</h4>
                        <div class="contact-details">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <strong>Email</strong>
                                    <p>{{ selectedClient.email }}</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div>
                                    <strong>Teléfono</strong>
                                    <p>{{ selectedClient.telefono }}</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <strong>Dirección</strong>
                                    <p>{{ selectedClient.direccion }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-chart-bar"></i> Información Comercial</h4>
                        <div class="commercial-info">
                            <div class="info-item">
                                <span>Tipo de Cliente</span>
                                <strong>{{ selectedClient.tipo }}</strong>
                            </div>
                            <div class="info-item">
                                <span>Valor Total</span>
                                <strong>${{ formatCurrency(selectedClient.valor_total) }}</strong>
                            </div>
                            <div class="info-item">
                                <span>Proyectos Activos</span>
                                <strong>{{ selectedClient.proyectos_activos || 0 }}</strong>
                            </div>
                            <div class="info-item">
                                <span>Cliente desde</span>
                                <strong>{{ formatDate(selectedClient.fecha_registro) }}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <h4><i class="fas fa-history"></i> Actividad Reciente</h4>
                        <div class="activity-list">
                            <div v-for="activity in selectedClient.actividades" :key="activity.id" class="activity-item">
                                <div class="activity-icon" :class="activity.tipo">
                                    <i :class="getActivityIcon(activity.tipo)"></i>
                                </div>
                                <div class="activity-content">
                                    <p>{{ activity.descripcion }}</p>
                                    <small>{{ formatDateTime(activity.fecha) }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-actions">
                        <button class="btn btn-primary" @click="editClient(selectedClient)">
                            <i class="fas fa-edit"></i> Editar Cliente
                        </button>
                        <button class="btn btn-secondary" @click="addNote(selectedClient.id)">
                            <i class="fas fa-sticky-note"></i> Agregar Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar cliente -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ editingClient ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
                    <button class="close-modal" @click="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Formulario simplificado para el ejemplo -->
                    <div class="form-group">
                        <label>Nombre Completo *</label>
                        <input type="text" v-model="clientForm.nombre" placeholder="Nombre del cliente">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" v-model="clientForm.email" placeholder="correo@ejemplo.com">
                        </div>
                        <div class="form-group">
                            <label>Teléfono</label>
                            <input type="tel" v-model="clientForm.telefono" placeholder="+1 234 567 8900">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Empresa</label>
                        <input type="text" v-model="clientForm.empresa" placeholder="Nombre de la empresa">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo</label>
                            <select v-model="clientForm.tipo">
                                <option value="empresa">Empresa</option>
                                <option value="individual">Individual</option>
                                <option value="gobierno">Gobierno</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estado</label>
                            <select v-model="clientForm.estado">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="prospecto">Prospecto</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
                    <button class="btn btn-primary" @click="saveClient">
                        {{ editingClient ? 'Actualizar' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ClientesAdmin',
    data() {
        return {
            // Datos de ejemplo
            clients: [
                {
                    id: 1,
                    nombre: 'María González',
                    email: 'maria@techcorp.com',
                    telefono: '+1 234 567 8901',
                    empresa: 'TechCorp Solutions',
                    direccion: 'Av. Principal 123, Ciudad',
                    tipo: 'empresa',
                    estado: 'activo',
                    valor_total: 125000,
                    proyectos_activos: 3,
                    fecha_registro: '2023-01-15',
                    ultimo_contacto: '2024-01-20',
                    tipo_contacto: 'llamada',
                    actividades: [
                        {
                            id: 1,
                            tipo: 'llamada',
                            descripcion: 'Reunión de seguimiento del proyecto',
                            fecha: '2024-01-20T14:30:00'
                        },
                        {
                            id: 2,
                            tipo: 'email',
                            descripcion: 'Enviada cotización #2024-001',
                            fecha: '2024-01-18T10:15:00'
                        }
                    ]
                },
                {
                    id: 2,
                    nombre: 'Carlos Rodríguez',
                    email: 'carlos@innovate.dev',
                    telefono: '+1 234 567 8902',
                    empresa: 'InnovateDev',
                    direccion: 'Calle Secundaria 456',
                    tipo: 'individual',
                    estado: 'prospecto',
                    valor_total: 45000,
                    proyectos_activos: 1,
                    fecha_registro: '2023-11-20',
                    ultimo_contacto: '2024-01-19',
                    tipo_contacto: 'email'
                },
                {
                    id: 3,
                    nombre: 'Laura Martínez',
                    email: 'l.martinez@gobierno.org',
                    telefono: '+1 234 567 8903',
                    empresa: 'Ministerio de Tecnología',
                    direccion: 'Plaza Central 789',
                    tipo: 'gobierno',
                    estado: 'activo',
                    valor_total: 280000,
                    proyectos_activos: 5,
                    fecha_registro: '2022-08-10',
                    ultimo_contacto: '2024-01-18',
                    tipo_contacto: 'reunion'
                }
            ],
            
            // Filtros y búsqueda
            searchQuery: '',
            filterStatus: '',
            filterType: '',
            sortBy: 'fecha_creacion',
            sortDirection: 'desc',
            
            // Vista y selección
            viewMode: 'grid',
            selectedClient: null,
            selectedIds: [],
            selectAll: false,
            
            // Paginación
            currentPage: 1,
            itemsPerPage: 6,
            
            // Modales y formularios
            showModal: false,
            editingClient: null,
            clientForm: {
                nombre: '',
                email: '',
                telefono: '',
                empresa: '',
                tipo: 'empresa',
                estado: 'activo'
            },
            
            // Estadísticas
            newThisMonth: 5,
            activePercentage: 68,
            monthlyGrowth: 12,
            overdueTasks: 3
        }
    },
    computed: {
        filteredClients() {
            let filtered = [...this.clients];
            
            // Aplicar búsqueda
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(client => 
                    client.nombre.toLowerCase().includes(query) ||
                    client.email.toLowerCase().includes(query) ||
                    client.empresa.toLowerCase().includes(query)
                );
            }
            
            // Aplicar filtros
            if (this.filterStatus) {
                filtered = filtered.filter(client => client.estado === this.filterStatus);
            }
            
            if (this.filterType) {
                filtered = filtered.filter(client => client.tipo === this.filterType);
            }
            
            // Ordenar
            filtered.sort((a, b) => {
                let aValue = a[this.sortBy];
                let bValue = b[this.sortBy];
                
                if (this.sortBy === 'valor_total') {
                    return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
                
                if (this.sortBy === 'fecha_creacion' || this.sortBy === 'ultimo_contacto') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }
                
                if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            
            // Paginación
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return filtered.slice(start, end);
        },
        
        totalClients() {
            return this.clients.length;
        },
        
        activeClients() {
            return this.clients.filter(c => c.estado === 'activo').length;
        },
        
        totalValue() {
            return this.clients.reduce((sum, client) => sum + client.valor_total, 0);
        },
        
        pendingActions() {
            return this.clients.length * 2; // Simulado
        },
        
        totalPages() {
            return Math.ceil(this.clients.length / this.itemsPerPage);
        }
    },
    methods: {
        applyFilters() {
            this.currentPage = 1;
        },
        
        sortTable(column) {
            if (this.sortBy === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = column;
                this.sortDirection = 'asc';
            }
        },
        
        sortIcon(column) {
            if (this.sortBy !== column) return 'fa-sort';
            return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        },
        
        getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        },
        
        getAvatarColor(name) {
            const colors = [
                '#667eea', '#764ba2', '#f093fb', '#f5576c',
                '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                '#fa709a', '#ff9a9e', '#a8edea', '#fed6e3'
            ];
            const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return colors[index % colors.length];
        },
        
        formatCurrency(value) {
            return value.toLocaleString('en-US');
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        
        formatDateTime(dateTimeString) {
            const date = new Date(dateTimeString);
            return date.toLocaleString('es-ES', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        getContactIcon(type) {
            const icons = {
                'llamada': 'fa-phone',
                'email': 'fa-envelope',
                'reunion': 'fa-video',
                'visita': 'fa-building'
            };
            return icons[type] || 'fa-comment';
        },
        
        getActivityIcon(type) {
            const icons = {
                'llamada': 'fa-phone',
                'email': 'fa-envelope',
                'reunion': 'fa-video',
                'visita': 'fa-building',
                'documento': 'fa-file-contract',
                'pago': 'fa-dollar-sign'
            };
            return icons[type] || 'fa-check-circle';
        },
        
        selectClient(client) {
            this.selectedClient = this.selectedClient?.id === client.id ? null : client;
        },
        
        openAddModal() {
            this.editingClient = null;
            this.clientForm = {
                nombre: '',
                email: '',
                telefono: '',
                empresa: '',
                tipo: 'empresa',
                estado: 'activo'
            };
            this.showModal = true;
        },
        
        editClient(client) {
            this.editingClient = client;
            this.clientForm = { ...client };
            this.showModal = true;
        },
        
        closeModal() {
            this.showModal = false;
            this.editingClient = null;
            this.clientForm = {
                nombre: '',
                email: '',
                telefono: '',
                empresa: '',
                tipo: 'empresa',
                estado: 'activo'
            };
        },
        
        saveClient() {
            if (this.editingClient) {
                // Actualizar cliente existente
                const index = this.clients.findIndex(c => c.id === this.editingClient.id);
                this.clients[index] = { ...this.editingClient, ...this.clientForm };
            } else {
                // Agregar nuevo cliente
                const newId = Math.max(...this.clients.map(c => c.id)) + 1;
                const newClient = {
                    id: newId,
                    ...this.clientForm,
                    valor_total: 0,
                    proyectos_activos: 0,
                    fecha_registro: new Date().toISOString().split('T')[0],
                    ultimo_contacto: new Date().toISOString().split('T')[0],
                    tipo_contacto: 'email',
                    actividades: []
                };
                this.clients.unshift(newClient);
            }
            this.closeModal();
        },
        
        deleteClient(id) {
            if (confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
                this.clients = this.clients.filter(client => client.id !== id);
                if (this.selectedClient?.id === id) {
                    this.selectedClient = null;
                }
            }
        },
        
        sendEmail(client) {
            alert(`Enviando email a: ${client.email}`);
            // Implementar lógica de envío de email
        },
        
        callClient(client) {
            alert(`Llamando a: ${client.telefono}`);
            // Implementar lógica de llamada
        },
        
        viewDetails(client) {
            this.selectedClient = client;
        },
        
        addNote(clientId) {
            const note = prompt('Agregar nota para el cliente:');
            if (note) {
                const client = this.clients.find(c => c.id === clientId);
                if (client) {
                    if (!client.actividades) client.actividades = [];
                    client.actividades.unshift({
                        id: Date.now(),
                        tipo: 'nota',
                        descripcion: note,
                        fecha: new Date().toISOString()
                    });
                }
            }
        },
        
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedIds = this.filteredClients.map(client => client.id);
            } else {
                this.selectedIds = [];
            }
        },
        
        sendBulkEmail() {
            alert(`Enviando email a ${this.selectedIds.length} clientes seleccionados`);
            // Implementar envío masivo
        },
        
        updateBulkStatus() {
            const newStatus = prompt('Nuevo estado para los clientes seleccionados (activo/inactivo/prospecto):');
            if (newStatus && ['activo', 'inactivo', 'prospecto'].includes(newStatus)) {
                this.clients = this.clients.map(client => 
                    this.selectedIds.includes(client.id) 
                        ? { ...client, estado: newStatus }
                        : client
                );
                this.selectedIds = [];
                this.selectAll = false;
            }
        },
        
        deleteBulk() {
            if (confirm(`¿Estás seguro de eliminar ${this.selectedIds.length} clientes?`)) {
                this.clients = this.clients.filter(client => !this.selectedIds.includes(client.id));
                this.selectedIds = [];
                this.selectAll = false;
            }
        },
        
        exportClients() {
            alert('Exportando datos de clientes...');
            // Implementar exportación a CSV/Excel
        }
    }
}
</script>

<style scoped>
.clientes-admin {
    padding: 2rem;
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

.danger {
    background-color: #fed7d7;
    color: #c53030;
}

.danger:hover {
    background-color: #feb2b2;
}

/* Filtros */
.filters-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.search-box {
    position: relative;
    max-width: 500px;
}

.search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
}

.search-box input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    color: #4a5568;
    transition: border-color 0.3s ease;
}

.search-box input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-actions {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.filter-group label {
    color: #4a5568;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-group select {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #4a5568;
    min-width: 120px;
}

/* Estadísticas */
.client-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.stat-icon.total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.value {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.pending {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info h3 {
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 0.25rem;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0.25rem 0;
}

.stat-trend, .stat-percentage, .stat-actions {
    font-size: 0.75rem;
    font-weight: 600;
}

.stat-trend.positive {
    color: #48bb78;
}

/* Contenido principal */
.main-content {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
}

.clients-section {
    flex: 1;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.section-header h2 {
    color: #1a202c;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.section-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.results-count {
    color: #718096;
    font-size: 0.875rem;
}

.view-toggle {
    display: flex;
    background: #e2e8f0;
    border-radius: 8px;
    padding: 0.25rem;
}

.view-btn {
    background: none;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    color: #718096;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.view-btn.active {
    background: white;
    color: #667eea;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Vista de cuadrícula */
.clients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.client-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
}

.client-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.client-card.selected {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.client-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem 1.5rem 1rem;
}

.client-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.125rem;
}

.client-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.client-status.activo {
    background-color: #c6f6d5;
    color: #22543d;
}

.client-status.inactivo {
    background-color: #fed7d7;
    color: #742a2a;
}

.client-status.prospecto {
    background-color: #feebc8;
    color: #744210;
}

.client-card-body {
    padding: 0 1.5rem;
}

.client-card-body h3 {
    font-size: 1.25rem;
    color: #1a202c;
    margin-bottom: 0.25rem;
}

.client-empresa {
    color: #718096;
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.client-email, .client-phone {
    color: #4a5568;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.client-meta {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    padding: 1rem 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
}

.meta-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: #718096;
    font-size: 0.75rem;
}

.meta-item i {
    color: #667eea;
    font-size: 1rem;
}

.client-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.client-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
}

.client-tag.empresa {
    background-color: #e0f2fe;
    color: #0369a1;
}

.client-tag.individual {
    background-color: #f0f9ff;
    color: #0c4a6e;
}

.client-tag.gobierno {
    background-color: #fef3c7;
    color: #92400e;
}

.project-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    background-color: #f7fafc;
    color: #4a5568;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.client-card-actions {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc;
}

.action-btn {
    background: none;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: #718096;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background-color: white;
    color: #667eea;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn.danger:hover {
    color: #c53030;
}

/* Vista de tabla */
.clients-table-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
}

.clients-table {
    width: 100%;
    border-collapse: collapse;
}

.clients-table th {
    background-color: #f7fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 2px solid #e2e8f0;
    cursor: pointer;
    user-select: none;
}

.clients-table th i {
    margin-left: 0.5rem;
    font-size: 0.75rem;
}

.clients-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #4a5568;
}

.clients-table tbody tr {
    transition: background-color 0.2s ease;
    cursor: pointer;
}

.clients-table tbody tr:hover {
    background-color: #f8fafc;
}

.clients-table tbody tr.selected {
    background-color: #ebf4ff;
}

.client-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.client-avatar-sm {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
}

.contact-info {
    font-size: 0.875rem;
}

.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
}

.badge.empresa {
    background-color: #e0f2fe;
    color: #0369a1;
}

.badge.individual {
    background-color: #f0f9ff;
    color: #0c4a6e;
}

.badge.gobierno {
    background-color: #fef3c7;
    color: #92400e;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.status-badge.activo {
    background-color: #c6f6d5;
    color: #22543d;
}

.status-badge.inactivo {
    background-color: #fed7d7;
    color: #742a2a;
}

.status-badge.prospecto {
    background-color: #feebc8;
    color: #744210;
}

.text-right {
    text-align: right;
}

.last-contact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.contact-type {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
}

.table-actions {
    display: flex;
    gap: 0.5rem;
}

.table-btn {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    color: #718096;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.table-btn:hover {
    background-color: #f7fafc;
    color: #667eea;
}

.table-btn.danger:hover {
    color: #c53030;
}

/* Paginación */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding: 1rem;
}

.pagination-btn {
    background: white;
    border: 1px solid #e2e8f0;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
    background-color: #667eea;
    color: white;
    border-color: #667eea;
}

.pagination-btn.active {
    background-color: #667eea;
    color: white;
    border-color: #667eea;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    margin-left: 1rem;
    color: #718096;
    font-size: 0.875rem;
}

/* Acciones masivas */
.bulk-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-top: 1rem;
}

.selected-count {
    color: #667eea;
    font-weight: 600;
    margin-right: auto;
}

/* Sidebar de detalles */
.sidebar {
    width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    height: fit-content;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
}

.sidebar-header h3 {
    margin: 0;
    color: #1a202c;
}

.close-sidebar {
    background: none;
    border: none;
    color: #a0aec0;
    cursor: pointer;
    font-size: 1.25rem;
}

.client-details {
    padding: 1.5rem;
}

.client-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.client-avatar-lg {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
}

.client-title h2 {
    margin: 0;
    color: #1a202c;
    font-size: 1.5rem;
}

.client-subtitle {
    color: #718096;
    margin: 0.25rem 0 0.75rem;
}

.client-status-lg {
    padding: 0.375rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: capitalize;
    display: inline-block;
}

.details-section {
    margin-bottom: 2rem;
}

.details-section h4 {
    color: #4a5568;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.contact-details, .commercial-info {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
}

.contact-item:last-child {
    margin-bottom: 0;
}

.contact-item i {
    color: #667eea;
    margin-top: 0.25rem;
}

.contact-item strong {
    display: block;
    color: #4a5568;
    font-size: 0.875rem;
}

.contact-item p {
    margin: 0.25rem 0 0;
    color: #718096;
    font-size: 0.875rem;
}

.commercial-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-item span {
    color: #718096;
    font-size: 0.75rem;
}

.info-item strong {
    color: #1a202c;
    font-size: 0.875rem;
}

.activity-list {
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
}

.activity-icon.llamada {
    background-color: #48bb78;
}

.activity-icon.email {
    background-color: #4299e1;
}

.activity-icon.reunion {
    background-color: #ed8936;
}

.activity-icon.visita {
    background-color: #9f7aea;
}

.activity-content {
    flex: 1;
}

.activity-content p {
    margin: 0 0 0.25rem;
    color: #4a5568;
    font-size: 0.875rem;
}

.activity-content small {
    color: #a0aec0;
    font-size: 0.75rem;
}

.sidebar-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.sidebar-actions .btn {
    flex: 1;
    justify-content: center;
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
    max-width: 600px;
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

.form-group {
    margin-bottom: 1.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    color: #4a5568;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

/* Responsive */
@media (max-width: 1200px) {
    .main-content {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        width: 100%;
        margin-top: 2rem;
    }
}

@media (max-width: 768px) {
    .clientes-admin {
        padding: 1rem;
    }
    
    .admin-header {
        flex-direction: column;
    }
    
    .header-actions {
        width: 100%;
        justify-content: center;
    }
    
    .filter-actions {
        flex-direction: column;
        gap: 1rem;
    }
    
    .filter-group {
        width: 100%;
    }
    
    .clients-grid {
        grid-template-columns: 1fr;
    }
    
    .clients-table {
        display: block;
        overflow-x: auto;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .client-stats {
        grid-template-columns: 1fr;
    }
    
    .header-content h1 {
        font-size: 1.5rem;
    }
    
    .sidebar-actions {
        flex-direction: column;
    }
}
</style>