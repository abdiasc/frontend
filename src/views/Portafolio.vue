<template>
  <div class="portfolio-container">
    <!-- Hero Section -->
    <section class="portfolio-hero">
      <div class="hero-content">
        <h1 class="hero-title">Portafolio de Proyectos</h1>
        <p class="hero-subtitle">Soluciones tecnológicas innovadoras en desarrollo web y automatización industrial</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">50+</span>
            <span class="stat-label">Proyectos Web</span>
          </div>
          <div class="stat">
            <span class="stat-number">30+</span>
            <span class="stat-label">Sistemas Industriales</span>
          </div>
          <div class="stat">
            <span class="stat-number">95%</span>
            <span class="stat-label">Satisfacción Clientes</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filtros de Categorías -->
    <section class="portfolio-filters">
      <div class="container">
        <div class="filters-header">
          <h2>Explora Nuestros Proyectos</h2>
          <p>Filtra por categoría para ver proyectos específicos</p>
        </div>
        
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['filter-btn', { 'active': activeFilter === category.id }]"
            @click="filterProjects(category.id)"
          >
            <i :class="category.icon"></i>
            {{ category.name }}
            <span class="project-count">{{ getProjectCount(category.id) }}</span>
          </button>
        </div>
        
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar proyectos por tecnología o industria..."
            class="search-input"
            @input="filterProjects()"
          >
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Grid de Proyectos -->
    <section class="projects-section">
      <div class="container">
        <div v-if="filteredProjects.length > 0" class="projects-grid">
          <div 
            v-for="project in paginatedProjects" 
            :key="project.id"
            class="project-card"
            :class="project.category"
            @click="openProjectModal(project)"
          >
            <div class="project-image">
              <img :src="project.image" :alt="project.title" class="project-img">
              <div class="project-overlay">
                <span class="project-category">{{ getCategoryName(project.category) }}</span>
                <span class="project-year">{{ project.year }}</span>
              </div>
              <div class="project-tech">
                <span 
                  v-for="tech in project.technologies.slice(0, 3)" 
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ truncateText(project.description, 100) }}</p>
              
              <div class="project-meta">
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ project.duration }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-industry"></i>
                  <span>{{ project.industry }}</span>
                </div>
              </div>
              
              <div class="project-results">
                <div class="result-item">
                  <i class="fas fa-chart-line"></i>
                  <span>{{ project.results }}</span>
                </div>
              </div>
              
              <button class="view-project-btn">
                Ver Detalles <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- No hay resultados -->
        <div v-else class="no-projects">
          <i class="fas fa-search fa-3x"></i>
          <h3>No se encontraron proyectos</h3>
          <p>Intenta con otros filtros o términos de búsqueda</p>
          <button @click="clearFilters" class="btn-primary">
            <i class="fas fa-redo"></i> Mostrar Todos
          </button>
        </div>
        
        <!-- Paginación -->
        <div v-if="filteredProjects.length > itemsPerPage" class="pagination">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="goToPage(page)"
              :class="['page-btn', { 'active': currentPage === page }]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Casos de Éxito Destacados -->
    <section class="featured-projects">
      <div class="container">
        <div class="section-header">
          <h2>Casos de Éxito Destacados</h2>
          <p>Proyectos que transformaron los procesos de nuestros clientes</p>
        </div>
        
        <div class="featured-grid">
          <div 
            v-for="featured in featuredProjects" 
            :key="featured.id"
            class="featured-card"
          >
            <div class="featured-content">
              <div class="featured-badge">
                <i class="fas fa-star"></i> Destacado
              </div>
              <h3>{{ featured.title }}</h3>
              <p class="featured-description">{{ featured.description }}</p>
              
              <div class="featured-stats">
                <div class="stat">
                  <span class="stat-value">{{ featured.stats.efficiency }}</span>
                  <span class="stat-label">Eficiencia</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ featured.stats.time }}</span>
                  <span class="stat-label">Tiempo Ahorrado</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ featured.stats.cost }}</span>
                  <span class="stat-label">Reducción Costos</span>
                </div>
              </div>
              
              <div class="client-info">
                <div class="client-logo">
                  <i :class="featured.client.icon"></i>
                </div>
                <div class="client-details">
                  <h4>{{ featured.client.name }}</h4>
                  <p>{{ featured.client.industry }}</p>
                </div>
              </div>
            </div>
            
            <div class="featured-image">
              <img :src="featured.image" :alt="featured.title">
              <button @click="openProjectModal(featured)" class="view-case-btn">
                Ver Caso Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tecnologías Utilizadas -->
    <section class="technologies-section">
      <div class="container">
        <div class="section-header">
          <h2>Tecnologías y Herramientas</h2>
          <p>Stack tecnológico que utilizamos en nuestros proyectos</p>
        </div>
        
        <div class="technologies-tabs">
          <div class="tab-buttons">
            <button 
              v-for="tab in techTabs" 
              :key="tab.id"
              :class="['tab-btn', { 'active': activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
          
          <div class="tab-content">
            <div v-if="activeTab === 'web'" class="tech-grid">
              <div class="tech-card" v-for="tech in webTechnologies" :key="tech.name">
                <div class="tech-icon" :style="{ backgroundColor: tech.color }">
                  <i :class="tech.icon"></i>
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'industrial'" class="tech-grid">
              <div class="tech-card" v-for="tech in industrialTechnologies" :key="tech.name">
                <div class="tech-icon" :style="{ backgroundColor: tech.color }">
                  <i :class="tech.icon"></i>
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'cloud'" class="tech-grid">
              <div class="tech-card" v-for="tech in cloudTechnologies" :key="tech.name">
                <div class="tech-icon" :style="{ backgroundColor: tech.color }">
                  <i :class="tech.icon"></i>
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>Lo que Dicen Nuestros Clientes</h2>
          <p>Testimonios de empresas que transformamos con tecnología</p>
        </div>
        
        <div class="testimonials-slider">
          <div class="testimonials-grid">
            <div 
              v-for="testimonial in testimonials" 
              :key="testimonial.id"
              class="testimonial-card"
            >
              <div class="testimonial-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
                <div class="testimonial-author">
                  <img :src="testimonial.author.avatar" :alt="testimonial.author.name" class="author-avatar">
                  <div class="author-info">
                    <h4>{{ testimonial.author.name }}</h4>
                    <p>{{ testimonial.author.position }}, {{ testimonial.author.company }}</p>
                  </div>
                </div>
              </div>
              
              <div class="testimonial-project">
                <span class="project-badge">{{ testimonial.project.type }}</span>
                <p class="project-name">{{ testimonial.project.name }}</p>
                <div class="project-results">
                  <span v-for="result in testimonial.project.results" :key="result" class="result-tag">
                    {{ result }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="portfolio-cta">
      <div class="container">
        <div class="cta-content">
          <h2>¿Tienes un Proyecto en Mente?</h2>
          <p>Contáctanos para discutir cómo podemos ayudarte a implementar soluciones tecnológicas innovadoras.</p>
          <div class="cta-buttons">
            <button class="btn-primary btn-large" @click="openContactModal">
              <i class="fas fa-calendar-alt"></i> Solicitar Cotización
            </button>
            <button class="btn-secondary btn-large" @click="downloadPortfolio">
              <i class="fas fa-download"></i> Descargar Portafolio PDF
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Proyecto -->
    <div v-if="selectedProject" class="project-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-header">
          <div class="modal-category">
            <span :class="['category-badge', selectedProject.category]">
              {{ getCategoryName(selectedProject.category) }}
            </span>
            <span class="modal-year">{{ selectedProject.year }}</span>
          </div>
          <h2 class="modal-title">{{ selectedProject.title }}</h2>
          <p class="modal-subtitle">{{ selectedProject.industry }}</p>
        </div>
        
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedProject.image" :alt="selectedProject.title">
          </div>
          
          <div class="modal-details">
            <div class="detail-section">
              <h3><i class="fas fa-bullseye"></i> Desafío</h3>
              <p>{{ selectedProject.challenge }}</p>
            </div>
            
            <div class="detail-section">
              <h3><i class="fas fa-lightbulb"></i> Solución</h3>
              <p>{{ selectedProject.solution }}</p>
            </div>
            
            <div class="detail-section">
              <h3><i class="fas fa-cogs"></i> Tecnologías Implementadas</h3>
              <div class="modal-tech">
                <span 
                  v-for="tech in selectedProject.technologies" 
                  :key="tech"
                  class="tech-tag-large"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h3><i class="fas fa-chart-line"></i> Resultados Obtenidos</h3>
              <div class="results-grid">
                <div class="result-card">
                  <i class="fas fa-clock"></i>
                  <h4>{{ selectedProject.resultsDetails.time }}</h4>
                  <p>Reducción de tiempo</p>
                </div>
                <div class="result-card">
                  <i class="fas fa-dollar-sign"></i>
                  <h4>{{ selectedProject.resultsDetails.cost }}</h4>
                  <p>Ahorro en costos</p>
                </div>
                <div class="result-card">
                  <i class="fas fa-industry"></i>
                  <h4>{{ selectedProject.resultsDetails.efficiency }}</h4>
                  <p>Incremento eficiencia</p>
                </div>
                <div class="result-card">
                  <i class="fas fa-chart-bar"></i>
                  <h4>{{ selectedProject.resultsDetails.productivity }}</h4>
                  <p>Aumento productividad</p>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3><i class="fas fa-calendar-alt"></i> Duración del Proyecto</h3>
              <p>{{ selectedProject.duration }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-primary" @click="openContactModal">
            <i class="fas fa-envelope"></i> Solicitar Proyecto Similar
          </button>
          <button class="btn-secondary" @click="closeModal">
            <i class="fas fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioComponent',
  data() {
    return {
      activeFilter: 'all',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 6,
      selectedProject: null,
      activeTab: 'web',
      categories: [
        { id: 'all', name: 'Todos', icon: 'fas fa-th' },
        { id: 'web', name: 'Desarrollo Web', icon: 'fas fa-code' },
        { id: 'ecommerce', name: 'E-commerce', icon: 'fas fa-shopping-cart' },
        { id: 'automation', name: 'Automatización', icon: 'fas fa-robot' },
        { id: 'iot', name: 'IoT Industrial', icon: 'fas fa-wifi' },
        { id: 'dashboard', name: 'Dashboards', icon: 'fas fa-chart-line' },
        { id: 'erp', name: 'Sistemas ERP', icon: 'fas fa-cogs' }
      ],
      projects: [
        {
          id: 1,
          title: 'Sistema de Gestión Industrial 4.0',
          description: 'Plataforma integral para monitoreo y control de procesos industriales con análisis predictivo.',
          category: 'automation',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2023',
          duration: '6 meses',
          industry: 'Manufactura Automotriz',
          technologies: ['Siemens PLC', 'Node-RED', 'React', 'MongoDB', 'MQTT'],
          challenge: 'Falta de visibilidad en tiempo real de los procesos de producción y mantenimiento reactivo.',
          solution: 'Implementación de sistema SCADA moderno con dashboards en tiempo real y alertas predictivas.',
          results: '40% aumento en eficiencia',
          resultsDetails: {
            time: '35%',
            cost: '25%',
            efficiency: '40%',
            productivity: '30%'
          }
        },
        {
          id: 2,
          title: 'Plataforma E-commerce B2B Industrial',
          description: 'Marketplace especializado para venta de componentes industriales con integración ERP.',
          category: 'ecommerce',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2023',
          duration: '4 meses',
          industry: 'Distribución Industrial',
          technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
          challenge: 'Proceso de compra manual y desconexión entre ventas online y sistema de inventario.',
          solution: 'Desarrollo de plataforma personalizada con integración en tiempo real al ERP existente.',
          results: '300% crecimiento en ventas online',
          resultsDetails: {
            time: '60%',
            cost: '20%',
            efficiency: '75%',
            productivity: '50%'
          }
        },
        {
          id: 3,
          title: 'Sistema IoT para Monitoreo Ambiental',
          description: 'Red de sensores industriales para monitoreo de condiciones ambientales en plantas.',
          category: 'iot',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2022',
          duration: '5 meses',
          industry: 'Industria Química',
          technologies: ['ESP32', 'Python', 'InfluxDB', 'Grafana', 'LoRaWAN'],
          challenge: 'Monitoreo manual de variables ambientales con reportes semanales y alto riesgo de incumplimiento.',
          solution: 'Implementación de red IoT con sensores inalámbricos y dashboard de cumplimiento regulatorio.',
          results: '99.8% cumplimiento normativo',
          resultsDetails: {
            time: '80%',
            cost: '40%',
            efficiency: '90%',
            productivity: '65%'
          }
        },
        {
          id: 4,
          title: 'Dashboard de Business Intelligence',
          description: 'Panel de control ejecutivo con métricas clave de producción y ventas en tiempo real.',
          category: 'dashboard',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2022',
          duration: '3 meses',
          industry: 'Alimentos y Bebidas',
          technologies: ['React', 'D3.js', 'FastAPI', 'PostgreSQL', 'Docker'],
          challenge: 'Toma de decisiones basada en reportes estáticos y datos desactualizados.',
          solution: 'Dashboard interactivo con conectividad a múltiples fuentes de datos y alertas personalizadas.',
          results: 'Mejor toma de decisiones en 50% menos tiempo',
          resultsDetails: {
            time: '50%',
            cost: '30%',
            efficiency: '60%',
            productivity: '45%'
          }
        },
        {
          id: 5,
          title: 'ERP Modular para PYMEs Industriales',
          description: 'Sistema de gestión empresarial adaptado a las necesidades específicas de manufactura.',
          category: 'erp',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2021',
          duration: '8 meses',
          industry: 'Manufactura Diversa',
          technologies: ['Angular', '.NET Core', 'SQL Server', 'Azure', 'Redis'],
          challenge: 'Sistemas desconectados para inventario, producción y contabilidad con errores frecuentes.',
          solution: 'ERP unificado con módulos específicos para manufactura y automatización de procesos.',
          results: 'Reducción de errores en 95%',
          resultsDetails: {
            time: '70%',
            cost: '35%',
            efficiency: '85%',
            productivity: '60%'
          }
        },
        {
          id: 6,
          title: 'Aplicación Web Progresiva para Mantenimiento',
          description: 'PWA para gestión de mantenimiento predictivo con offline capability.',
          category: 'web',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2023',
          duration: '4 meses',
          industry: 'Energía',
          technologies: ['Vue 3', 'PWA', 'IndexedDB', 'Service Workers', 'Firebase'],
          challenge: 'Técnicos sin acceso a datos en campo y registros manuales propensos a errores.',
          solution: 'Aplicación web progresiva que funciona offline y sincroniza automáticamente.',
          results: 'Reducción de tiempo de registro en 75%',
          resultsDetails: {
            time: '75%',
            cost: '25%',
            efficiency: '70%',
            productivity: '55%'
          }
        },
        {
          id: 7,
          title: 'Automatización de Línea de Ensamblaje',
          description: 'Sistema robótico para automatización completa de línea de producción.',
          category: 'automation',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2022',
          duration: '9 meses',
          industry: 'Electrónica',
          technologies: ['ABB Robots', 'PLC Siemens', 'Vision System', 'Python', 'OPC UA'],
          challenge: 'Proceso manual de ensamblaje con alta variabilidad y defectos frecuentes.',
          solution: 'Celda robótica con sistema de visión artificial para ensamblaje preciso y consistente.',
          results: 'Aumento producción en 300%',
          resultsDetails: {
            time: '85%',
            cost: '45%',
            efficiency: '95%',
            productivity: '80%'
          }
        },
        {
          id: 8,
          title: 'Portal de Proveedores B2B',
          description: 'Plataforma web para gestión de cadena de suministro y colaboración con proveedores.',
          category: 'web',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          year: '2021',
          duration: '5 meses',
          industry: 'Retail',
          technologies: ['React', 'Node.js', 'MongoDB', 'JWT', 'AWS Lambda'],
          challenge: 'Comunicación por email y teléfono con proveedores, lentitud en aprobaciones.',
          solution: 'Portal centralizado con workflows automatizados y notificaciones en tiempo real.',
          results: 'Reducción ciclo de aprobación de 5 días a 2 horas',
          resultsDetails: {
            time: '95%',
            cost: '30%',
            efficiency: '90%',
            productivity: '70%'
          }
        }
      ],
      featuredProjects: [
        {
          id: 1,
          title: 'Transformación Digital Planta Manufacturera',
          description: 'Implementación completa de Industria 4.0 con IoT, automatización y análisis predictivo.',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          stats: {
            efficiency: '+65%',
            time: '2,400 h/año',
            cost: '35% menos'
          },
          client: {
            name: 'AutoParts Inc.',
            industry: 'Manufactura Automotriz',
            icon: 'fas fa-car'
          }
        },
        {
          id: 2,
          title: 'E-commerce B2B para Distribuidor Global',
          description: 'Plataforma que aumentó ventas online en 400% con integración ERP en tiempo real.',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          stats: {
            efficiency: '+75%',
            time: '80% menos',
            cost: '25% menos'
          },
          client: {
            name: 'Industrial Supply Co.',
            industry: 'Distribución Industrial',
            icon: 'fas fa-industry'
          }
        }
      ],
      techTabs: [
        { id: 'web', name: 'Desarrollo Web' },
        { id: 'industrial', name: 'Automatización' },
        { id: 'cloud', name: 'Cloud & DevOps' }
      ],
      webTechnologies: [
        { name: 'Vue.js', icon: 'fab fa-vuejs', description: 'Framework progresivo para interfaces modernas', color: '#42b883' },
        { name: 'React', icon: 'fab fa-react', description: 'Library para interfaces interactivas', color: '#61dafb' },
        { name: 'Node.js', icon: 'fab fa-node-js', description: 'Backend escalable y eficiente', color: '#339933' },
        { name: 'TypeScript', icon: 'fas fa-code', description: 'JavaScript con tipos para mayor robustez', color: '#3178c6' },
        { name: 'MongoDB', icon: 'fas fa-database', description: 'Base de datos NoSQL flexible', color: '#47a248' },
        { name: 'PostgreSQL', icon: 'fas fa-database', description: 'Base de datos relacional avanzada', color: '#336791' }
      ],
      industrialTechnologies: [
        { name: 'Siemens PLC', icon: 'fas fa-microchip', description: 'Controladores lógicos programables', color: '#009999' },
        { name: 'Allen-Bradley', icon: 'fas fa-cogs', description: 'Sistemas de control industrial', color: '#ff6600' },
        { name: 'OPC UA', icon: 'fas fa-project-diagram', description: 'Comunicación industrial segura', color: '#3b82f6' },
        { name: 'IoT Industrial', icon: 'fas fa-wifi', description: 'Conectividad de dispositivos industriales', color: '#10b981' },
        { name: 'SCADA', icon: 'fas fa-desktop', description: 'Supervisión y control de procesos', color: '#8b5cf6' },
        { name: 'Robot Programming', icon: 'fas fa-robot', description: 'Programación de robots industriales', color: '#ef4444' }
      ],
      cloudTechnologies: [
        { name: 'AWS', icon: 'fab fa-aws', description: 'Infraestructura cloud completa', color: '#ff9900' },
        { name: 'Azure', icon: 'fab fa-microsoft', description: 'Soluciones cloud empresariales', color: '#0078d4' },
        { name: 'Docker', icon: 'fab fa-docker', description: 'Contenedores para aplicaciones', color: '#2496ed' },
        { name: 'Kubernetes', icon: 'fas fa-ship', description: 'Orquestación de contenedores', color: '#326ce5' },
        { name: 'CI/CD', icon: 'fas fa-sync-alt', description: 'Integración y despliegue continuo', color: '#f59e0b' },
        { name: 'Terraform', icon: 'fas fa-cloud', description: 'Infraestructura como código', color: '#7b42bc' }
      ],
      testimonials: [
        {
          id: 1,
          text: 'La implementación del sistema de automatización transformó completamente nuestra línea de producción. Ahora tenemos visibilidad total y control en tiempo real.',
          author: {
            name: 'Carlos Rodríguez',
            position: 'Director de Operaciones',
            company: 'Manufactura Nacional',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
          },
          project: {
            name: 'Sistema SCADA Avanzado',
            type: 'Automatización',
            results: ['+40% Eficiencia', '-35% Costos', 'Tiempo Real']
          }
        },
        {
          id: 2,
          text: 'El portal de proveedores que desarrollaron redujo nuestro ciclo de aprobación de días a horas. La integración perfecta con nuestro ERP fue clave.',
          author: {
            name: 'Ana Martínez',
            position: 'Gerente de Compras',
            company: 'Distribuidora Global',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
          },
          project: {
            name: 'Portal B2B',
            type: 'Desarrollo Web',
            results: ['-95% Tiempo', '+300% Ventas', 'Integración ERP']
          }
        }
      ]
    };
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects;
      
      // Filtrar por categoría
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(project => project.category === this.activeFilter);
      }
      
      // Filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
          project.industry.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    },
    paginatedProjects() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProjects.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    }
  },
  methods: {
    filterProjects(category) {
      if (category !== undefined) {
        this.activeFilter = category;
      }
      this.currentPage = 1;
    },
    clearFilters() {
      this.activeFilter = 'all';
      this.searchQuery = '';
      this.currentPage = 1;
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'General';
    },
    getProjectCount(categoryId) {
      if (categoryId === 'all') return this.projects.length;
      return this.projects.filter(project => project.category === categoryId).length;
    },
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    openProjectModal(project) {
      this.selectedProject = project;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.selectedProject = null;
      document.body.style.overflow = 'auto';
    },
    openContactModal() {
      alert('Redirigiendo al formulario de contacto...');
      // En implementación real: this.$router.push('/contacto')
    },
    downloadPortfolio() {
      alert('Descargando portafolio en PDF...');
      // Lógica para generar/descargar PDF
    }
  },
  watch: {
    activeFilter() {
      this.currentPage = 1;
    },
    searchQuery() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.portfolio-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f8fafc;
}

/* Hero Section */
.portfolio-hero {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: #cbd5e1;
  max-width: 700px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  margin-top: 50px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  color: #94a3b8;
}

/* Filtros Section */
.portfolio-filters {
  background: white;
  padding: 60px 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.filters-header {
  text-align: center;
  margin-bottom: 40px;
}

.filters-header h2 {
  font-size: 2.2rem;
  color: #1e293b;
  margin-bottom: 10px;
}

.filters-header p {
  color: #64748b;
  font-size: 1.1rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 50px;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.project-count {
  background: #f1f5f9;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #475569;
}

.filter-btn.active .project-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #3b82f6;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Projects Grid */
.projects-section {
  padding: 80px 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.project-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-category {
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.project-year {
  background: #3b82f6;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.project-tech {
  position: absolute;
  bottom: 10px;
  left: 20px;
  display: flex;
  gap: 8px;
}

.tech-tag {
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
}

.project-content {
  padding: 25px;
}

.project-title {
  font-size: 1.4rem;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.3;
}

.project-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.project-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.meta-item i {
  color: #3b82f6;
}

.project-results {
  margin-bottom: 20px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f9ff;
  padding: 10px 15px;
  border-radius: 10px;
  color: #0369a1;
}

.result-item i {
  font-size: 1.2rem;
}

.view-project-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.view-project-btn:hover {
  background: #2563eb;
}

/* No Projects */
.no-projects {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.no-projects i {
  color: #cbd5e1;
  margin-bottom: 20px;
}

.no-projects h3 {
  color: #475569;
  margin-bottom: 10px;
}

.no-projects p {
  color: #94a3b8;
  margin-bottom: 30px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

.pagination-btn {
  background: white;
  border: 2px solid #e2e8f0;
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 10px;
}

.page-btn {
  width: 45px;
  height: 45px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.page-btn:hover {
  border-color: #3b82f6;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Featured Projects */
.featured-projects {
  padding: 80px 20px;
  background: #f1f5f9;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 2.2rem;
  color: #1e293b;
  margin-bottom: 10px;
}

.section-header p {
  color: #64748b;
  font-size: 1.1rem;
}

.featured-grid {
  display: grid;
  gap: 40px;
}

.featured-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.featured-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-badge {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 20px;
  width: fit-content;
}

.featured-content h3 {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 20px;
}

.featured-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 30px;
}

.featured-stats {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.featured-stats .stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 5px;
}

.stat-label {
  color: #64748b;
  font-size: 0.95rem;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.client-logo {
  width: 60px;
  height: 60px;
  background: #f0f9ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-logo i {
  font-size: 2rem;
  color: #3b82f6;
}

.client-details h4 {
  color: #1e293b;
  margin-bottom: 5px;
}

.client-details p {
  color: #64748b;
  font-size: 0.95rem;
}

.featured-image {
  position: relative;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-case-btn {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-case-btn:hover {
  background: white;
}

/* Technologies Section */
.technologies-section {
  padding: 80px 20px;
  background: white;
}

.technologies-tabs {
  max-width: 1000px;
  margin: 0 auto;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
}

.tab-btn {
  padding: 12px 30px;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #e2e8f0;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.tech-card {
  background: #f8fafc;
  padding: 25px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-5px);
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.tech-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tech-icon i {
  font-size: 2rem;
  color: white;
}

.tech-info h4 {
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.tech-info p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Testimonials */
.testimonials-section {
  padding: 80px 20px;
  background: #f1f5f9;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.testimonial-content {
  padding: 30px;
}

.quote-icon {
  color: #3b82f6;
  font-size: 2rem;
  margin-bottom: 20px;
}

.testimonial-text {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 25px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info h4 {
  color: #1e293b;
  margin-bottom: 5px;
}

.author-info p {
  color: #64748b;
  font-size: 0.9rem;
}

.testimonial-project {
  background: #f8fafc;
  padding: 20px 30px;
  border-top: 1px solid #e2e8f0;
}

.project-badge {
  background: #3b82f6;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
  display: inline-block;
}

.project-name {
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 10px;
}

.project-results {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.result-tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* CTA Section */
.portfolio-cta {
  padding: 100px 20px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-content p {
  font-size: 1.2rem;
  color: #cbd5e1;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: 18px 40px;
  font-size: 1.1rem;
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

/* Modal */
.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header {
  padding: 40px 40px 20px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
}

.modal-category {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.category-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.category-badge.web {
  background: #3b82f6;
  color: white;
}

.category-badge.automation {
  background: #10b981;
  color: white;
}

.category-badge.iot {
  background: #8b5cf6;
  color: white;
}

.modal-year {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.modal-title {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.modal-subtitle {
  color: #cbd5e1;
  font-size: 1.1rem;
}

.modal-body {
  padding: 40px;
}

.modal-image {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 40px;
}

.modal-image img {
  width: 100%;
  height: auto;
  display: block;
}

.detail-section {
  margin-bottom: 40px;
}

.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  color: #1e293b;
  margin-bottom: 15px;
}

.detail-section h3 i {
  color: #3b82f6;
}

.detail-section p {
  color: #475569;
  line-height: 1.6;
  font-size: 1.05rem;
}

.modal-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.tech-tag-large {
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 20px;
  color: #475569;
  font-weight: 500;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.result-card {
  background: #f0f9ff;
  padding: 25px 20px;
  border-radius: 12px;
  text-align: center;
}

.result-card i {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 15px;
}

.result-card h4 {
  font-size: 1.8rem;
  color: #0369a1;
  margin-bottom: 5px;
}

.result-card p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.modal-footer {
  padding: 30px 40px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 1024px) {
  .featured-card {
    grid-template-columns: 1fr;
  }
  
  .featured-image {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    gap: 30px;
  }
  
  .stat-number {
    font-size: 2.2rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-header {
    padding: 30px 20px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 20px;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .filter-buttons {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .filter-btn {
    white-space: nowrap;
  }
  
  .tab-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
}
</style>