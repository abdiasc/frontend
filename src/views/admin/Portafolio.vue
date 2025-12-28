<template>
    <div class="portafolio-admin">
        <!-- Encabezado del panel -->
        <header class="admin-header">
            <div class="header-content">
                <h1><i class="fas fa-folder-open"></i> Panel de Administración - Portafolio</h1>
                <p class="welcome-text">Bienvenido al panel de administración. Aquí puedes gestionar proyectos, categorías, usuarios y configurar ajustes.</p>
            </div>
            
            <!-- Acciones rápidas -->
            <div class="header-actions">
                <button class="btn btn-primary" @click="openAddModal">
                    <i class="fas fa-plus"></i> Agregar Proyecto
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-cog"></i> Configuración
                </button>
            </div>
        </header>

        <!-- Estadísticas rápidas -->
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="stat-info">
                    <h3>Proyectos Activos</h3>
                    <p class="stat-number">{{ stats.activeProjects }}</p>
                    <span class="stat-change positive">+{{ stats.newProjects }} este mes</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="stat-info">
                    <h3>Vistas Totales</h3>
                    <p class="stat-number">{{ stats.totalViews.toLocaleString() }}</p>
                    <span class="stat-change positive">+{{ stats.weeklyViews }} esta semana</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-code"></i>
                </div>
                <div class="stat-info">
                    <h3>Tecnologías Usadas</h3>
                    <p class="stat-number">{{ stats.technologies }}</p>
                    <span class="stat-change neutral">Última: {{ stats.lastTech }}</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-info">
                    <h3>Porcentaje Completado</h3>
                    <p class="stat-number">{{ stats.completionRate }}%</p>
                    <div class="progress-bar">
                        <div class="progress" :style="{ width: stats.completionRate + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="main-content">
            <!-- Sección de proyectos -->
            <section class="projects-section">
                <div class="section-header">
                    <h2><i class="fas fa-th-list"></i> Proyectos del Portafolio</h2>
                    <div class="section-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input 
                                type="text" 
                                v-model="searchQuery" 
                                placeholder="Buscar proyectos..."
                                @input="filterProjects"
                            >
                        </div>
                        <select v-model="filterCategory" @change="filterProjects" class="category-filter">
                            <option value="">Todas las categorías</option>
                            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="projects-grid" v-if="filteredProjects.length > 0">
                    <div 
                        class="project-card" 
                        v-for="project in filteredProjects" 
                        :key="project.id"
                        @click="editProject(project)"
                    >
                        <div class="project-image">
                            <img :src="project.image" :alt="project.title">
                            <div class="project-status" :class="project.status">
                                {{ project.status === 'published' ? 'Publicado' : 'Borrador' }}
                            </div>
                        </div>
                        <div class="project-content">
                            <div class="project-header">
                                <h3>{{ project.title }}</h3>
                                <div class="project-actions">
                                    <button class="icon-btn" @click.stop="toggleProjectStatus(project.id)">
                                        <i class="fas" :class="project.status === 'published' ? 'fa-eye-slash' : 'fa-eye'"></i>
                                    </button>
                                    <button class="icon-btn" @click.stop="deleteProject(project.id)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="project-description">{{ project.description }}</p>
                            <div class="project-meta">
                                <span class="project-category">{{ getCategoryName(project.category) }}</span>
                                <span class="project-date">
                                    <i class="far fa-calendar"></i> {{ formatDate(project.date) }}
                                </span>
                            </div>
                            <div class="project-tech">
                                <span 
                                    v-for="tech in project.technologies.slice(0, 3)" 
                                    class="tech-tag"
                                    :style="{ backgroundColor: tech.color }"
                                >
                                    {{ tech.name }}
                                </span>
                                <span v-if="project.technologies.length > 3" class="tech-more">
                                    +{{ project.technologies.length - 3 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="empty-state" v-else>
                    <i class="fas fa-folder-open"></i>
                    <h3>No se encontraron proyectos</h3>
                    <p>Intenta con otros términos de búsqueda o crea un nuevo proyecto.</p>
                    <button class="btn btn-primary" @click="openAddModal">
                        <i class="fas fa-plus"></i> Crear Primer Proyecto
                    </button>
                </div>
            </section>

            <!-- Sección de categorías -->
            <aside class="categories-section">
                <div class="section-header">
                    <h2><i class="fas fa-tags"></i> Categorías</h2>
                    <button class="btn btn-sm" @click="addCategory">
                        <i class="fas fa-plus"></i> Nueva
                    </button>
                </div>
                
                <div class="categories-list">
                    <div 
                        class="category-item" 
                        v-for="category in categories" 
                        :key="category.id"
                        @click="editCategory(category)"
                    >
                        <div class="category-color" :style="{ backgroundColor: category.color }"></div>
                        <span class="category-name">{{ category.name }}</span>
                        <span class="category-count">{{ getProjectCount(category.id) }}</span>
                    </div>
                </div>

                <!-- Sección de vista previa -->
                <div class="preview-section">
                    <h3><i class="fas fa-desktop"></i> Vista Previa</h3>
                    <div class="preview-actions">
                        <button class="btn btn-secondary">
                            <i class="fas fa-external-link-alt"></i> Ver Portafolio
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-sync"></i> Actualizar Cache
                        </button>
                    </div>
                </div>
            </aside>
        </div>

        <!-- Modal para agregar/editar proyecto (simplificado) -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h3>
                    <button class="close-modal" @click="showModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Funcionalidad completa del modal se implementaría aquí.</p>
                    <!-- Aquí irían los campos del formulario -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PortafolioAdmin',
    data() {
        return {
            stats: {
                activeProjects: 12,
                newProjects: 3,
                totalViews: 15420,
                weeklyViews: 1250,
                technologies: 8,
                lastTech: 'Vue.js',
                completionRate: 85
            },
            projects: [
                {
                    id: 1,
                    title: 'E-commerce Moderno',
                    description: 'Plataforma de comercio electrónico con carrito de compras y sistema de pagos.',
                    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h-250&fit=crop',
                    category: 1,
                    status: 'published',
                    date: '2024-01-15',
                    technologies: [
                        { name: 'Vue.js', color: '#42b883' },
                        { name: 'Node.js', color: '#68a063' },
                        { name: 'MongoDB', color: '#4db33d' },
                        { name: 'Stripe', color: '#635bff' }
                    ]
                },
                {
                    id: 2,
                    title: 'App de Tareas',
                    description: 'Aplicación web para gestión de tareas con recordatorios y colaboración.',
                    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop',
                    category: 2,
                    status: 'draft',
                    date: '2024-02-01',
                    technologies: [
                        { name: 'React', color: '#61dafb' },
                        { name: 'Firebase', color: '#ffca28' }
                    ]
                },
                {
                    id: 3,
                    title: 'Dashboard Analytics',
                    description: 'Panel de control con gráficos y métricas en tiempo real.',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
                    category: 3,
                    status: 'published',
                    date: '2024-01-20',
                    technologies: [
                        { name: 'Vue.js', color: '#42b883' },
                        { name: 'Chart.js', color: '#ff6384' },
                        { name: 'Express', color: '#000000' }
                    ]
                }
            ],
            categories: [
                { id: 1, name: 'E-commerce', color: '#667eea' },
                { id: 2, name: 'Productividad', color: '#f093fb' },
                { id: 3, name: 'Dashboard', color: '#4facfe' },
                { id: 4, name: 'Red Social', color: '#43e97b' }
            ],
            searchQuery: '',
            filterCategory: '',
            filteredProjects: [],
            showModal: false,
            editingProject: null
        }
    },
    mounted() {
        this.filteredProjects = [...this.projects];
    },
    methods: {
        filterProjects() {
            this.filteredProjects = this.projects.filter(project => {
                const matchesSearch = project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                    project.description.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = !this.filterCategory || project.category == this.filterCategory;
                return matchesSearch && matchesCategory;
            });
        },
        getCategoryName(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            return category ? category.name : 'Sin categoría';
        },
        getProjectCount(categoryId) {
            return this.projects.filter(p => p.category === categoryId).length;
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        },
        openAddModal() {
            this.editingProject = null;
            this.showModal = true;
        },
        editProject(project) {
            this.editingProject = project;
            this.showModal = true;
        },
        toggleProjectStatus(id) {
            const project = this.projects.find(p => p.id === id);
            if (project) {
                project.status = project.status === 'published' ? 'draft' : 'published';
                this.filterProjects();
            }
        },
        deleteProject(id) {
            if (confirm('¿Estás seguro de eliminar este proyecto?')) {
                this.projects = this.projects.filter(p => p.id !== id);
                this.filterProjects();
            }
        },
        addCategory() {
            const name = prompt('Nombre de la nueva categoría:');
            if (name) {
                const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ff9a9e'];
                const newCategory = {
                    id: this.categories.length + 1,
                    name: name,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                this.categories.push(newCategory);
            }
        },
        editCategory(category) {
            const newName = prompt('Nuevo nombre para la categoría:', category.name);
            if (newName) {
                category.name = newName;
            }
        }
    }
}
</script>

<style scoped>
.portafolio-admin {
    padding: 2rem;
    max-width: 1400px;
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

/* Estadísticas */
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
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

.stat-change {
    font-size: 0.75rem;
    font-weight: 600;
}

.stat-change.positive {
    color: #48bb78;
}

.stat-change.neutral {
    color: #718096;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background-color: #e2e8f0;
    border-radius: 3px;
    margin-top: 0.5rem;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
}

/* Contenido principal */
.main-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
}

/* Proyectos */
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

.section-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-box {
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #e2e8f0;
}

.search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
}

.search-box input {
    border: none;
    outline: none;
    width: 200px;
    color: #4a5568;
}

.category-filter {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #4a5568;
    outline: none;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.project-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.project-image {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
    transform: scale(1.05);
}

.project-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
}

.project-status.published {
    background-color: #48bb78;
}

.project-status.draft {
    background-color: #ed8936;
}

.project-content {
    padding: 1.5rem;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.project-header h3 {
    font-size: 1.25rem;
    color: #1a202c;
    margin: 0;
}

.project-actions {
    display: flex;
    gap: 0.5rem;
}

.icon-btn {
    background: none;
    border: none;
    color: #a0aec0;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.icon-btn:hover {
    color: #4a5568;
    background-color: #f7fafc;
}

.project-description {
    color: #718096;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.project-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.project-category {
    background-color: #f7fafc;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    color: #4a5568;
    font-weight: 500;
}

.project-date {
    color: #a0aec0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tech-tag {
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    color: white;
    font-weight: 500;
}

.tech-more {
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    background-color: #e2e8f0;
    color: #718096;
}

/* Estado vacío */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state i {
    font-size: 4rem;
    color: #cbd5e0;
    margin-bottom: 1.5rem;
}

.empty-state h3 {
    color: #4a5568;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #a0aec0;
    margin-bottom: 1.5rem;
}

/* Categorías */
.categories-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.categories-list {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.category-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.category-item:hover {
    background-color: #f8fafc;
    border-radius: 6px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    margin: 0 -0.75rem;
}

.category-item:last-child {
    border-bottom: none;
}

.category-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.category-name {
    flex: 1;
    color: #4a5568;
    font-weight: 500;
}

.category-count {
    background-color: #e2e8f0;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #718096;
    font-weight: 600;
    min-width: 32px;
    text-align: center;
}

/* Vista previa */
.preview-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-section h3 {
    color: #1a202c;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.preview-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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

/* Responsive */
@media (max-width: 1024px) {
    .main-content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .portafolio-admin {
        padding: 1rem;
    }
    
    .admin-header {
        flex-direction: column;
    }
    
    .stats-container {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .section-actions {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-box input {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .stats-container {
        grid-template-columns: 1fr;
    }
    
    .header-content h1 {
        font-size: 1.5rem;
    }
}
</style>