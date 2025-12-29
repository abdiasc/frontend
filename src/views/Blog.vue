<template>
  <div class="blog-container">
    <!-- Encabezado del blog -->
    <header class="blog-header">
      <h1 class="blog-title">TechBlog</h1>
      <p class="blog-subtitle">Explora las últimas noticias, artículos y actualizaciones tecnológicas</p>
    </header>

    <!-- Barra de búsqueda y filtros -->
    <div class="blog-controls">
      <div class="search-container">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar artículos..." 
          class="search-input"
          @input="filterArticles"
        >
      </div>
      
      <div class="filter-controls">
        <div class="category-filter">
          <span class="filter-label">Filtrar por categoría:</span>
          <div class="category-buttons">
            <button 
              v-for="category in categories" 
              :key="category.id"
              :class="['category-btn', { 'active': selectedCategory === category.id }]"
              @click="toggleCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        
        <div class="sort-controls">
          <label for="sort-select">Ordenar por:</label>
          <select id="sort-select" v-model="sortBy" @change="sortArticles" class="sort-select">
            <option value="newest">Más reciente</option>
            <option value="oldest">Más antiguo</option>
            <option value="title">Título (A-Z)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Contenido principal del blog -->
    <div class="blog-content">
      <div v-if="filteredArticles.length > 0" class="articles-container">
        <div class="articles-grid">
          <article 
            v-for="article in filteredArticles" 
            :key="article.id" 
            class="article-card"
          >
            <div class="article-image" :style="{ backgroundColor: article.color }">
              <span class="article-category">{{ getCategoryName(article.category) }}</span>
              <i :class="article.icon" class="article-icon"></i>
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span class="article-date">{{ formatDate(article.date) }}</span>
                <span class="article-read-time">{{ article.readTime }} min lectura</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-tags">
                <span 
                  v-for="tag in article.tags" 
                  :key="tag" 
                  class="article-tag"
                >
                  {{ tag }}
                </span>
              </div>
              <button class="read-more-btn">
                Leer más <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </article>
        </div>
        
        <!-- Estadísticas de filtrado -->
        <div class="filter-stats">
          <p>
            Mostrando {{ filteredArticles.length }} de {{ articles.length }} artículos
            <span v-if="selectedCategory !== 'all'">
              en la categoría <strong>{{ getCategoryName(selectedCategory) }}</strong>
            </span>
            <span v-if="searchQuery">
              para "<strong>{{ searchQuery }}</strong>"
            </span>
          </p>
          <button 
            v-if="selectedCategory !== 'all' || searchQuery" 
            @click="clearFilters" 
            class="clear-filters-btn"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay resultados -->
      <div v-else class="no-results">
        <i class="fas fa-search fa-3x"></i>
        <h2>No se encontraron artículos</h2>
        <p>No hay resultados para tu búsqueda "{{ searchQuery }}" en la categoría seleccionada.</p>
        <button @click="clearFilters" class="clear-filters-btn">Mostrar todos los artículos</button>
      </div>
      
      <!-- Barra lateral con categorías populares -->
      <aside class="blog-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">Categorías populares</h3>
          <ul class="category-list">
            <li 
              v-for="category in categories" 
              :key="category.id"
              :class="['category-item', { 'active': selectedCategory === category.id }]"
              @click="toggleCategory(category.id)"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ getCategoryCount(category.id) }}</span>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-section">
          <h3 class="sidebar-title">Artículos recientes</h3>
          <div class="recent-articles">
            <div 
              v-for="recent in recentArticles" 
              :key="recent.id" 
              class="recent-article"
              @click="scrollToArticle(recent.id)"
            >
              <h4 class="recent-title">{{ recent.title }}</h4>
              <div class="recent-meta">
                <span>{{ formatDate(recent.date) }}</span>
                <span>•</span>
                <span>{{ recent.readTime }} min</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section newsletter">
          <h3 class="sidebar-title">Suscríbete al newsletter</h3>
          <p>Recibe las últimas noticias tecnológicas directamente en tu correo.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" class="newsletter-input">
            <button class="newsletter-btn">Suscribirse</button>
          </div>
        </div>
      </aside>
    </div>
    
    <!-- Pie de página -->
    <footer class="blog-footer">
      <p>TechBlog © 2023 - Todos los derechos reservados</p>
      <p>Explora el mundo de la tecnología con nosotros</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BlogComponent',
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'newest',
      categories: [
        { id: 'all', name: 'Todos' },
        { id: 'web', name: 'Desarrollo Web' },
        { id: 'mobile', name: 'Desarrollo Móvil' },
        { id: 'ai', name: 'Inteligencia Artificial' },
        { id: 'cloud', name: 'Cloud Computing' },
        { id: 'security', name: 'Ciberseguridad' },
        { id: 'devops', name: 'DevOps' },
        { id: 'data', name: 'Ciencia de Datos' }
      ],
      articles: [
        {
          id: 1,
          title: 'Vue.js 3: Novedades y mejores prácticas',
          excerpt: 'Descubre las nuevas características de Vue.js 3 y cómo aprovecharlas en tus proyectos.',
          content: 'Contenido completo del artículo...',
          category: 'web',
          tags: ['Vue.js', 'JavaScript', 'Frontend'],
          date: '2023-10-15',
          readTime: 5,
          icon: 'fab fa-vuejs',
          color: '#42b883'
        },
        {
          id: 2,
          title: 'Machine Learning aplicado a negocios',
          excerpt: 'Cómo las empresas están implementando ML para optimizar sus operaciones.',
          content: 'Contenido completo del artículo...',
          category: 'ai',
          tags: ['Machine Learning', 'IA', 'Negocios'],
          date: '2023-10-10',
          readTime: 8,
          icon: 'fas fa-brain',
          color: '#f56565'
        },
        {
          id: 3,
          title: 'Seguridad en aplicaciones React',
          excerpt: 'Mejores prácticas para proteger tus aplicaciones React de vulnerabilidades comunes.',
          content: 'Contenido completo del artículo...',
          category: 'web',
          tags: ['React', 'Seguridad', 'Frontend'],
          date: '2023-10-05',
          readTime: 6,
          icon: 'fab fa-react',
          color: '#61dafb'
        },
        {
          id: 4,
          title: 'AWS vs Azure: Comparativa 2023',
          excerpt: 'Análisis detallado de las principales plataformas de cloud computing.',
          content: 'Contenido completo del artículo...',
          category: 'cloud',
          tags: ['AWS', 'Azure', 'Cloud'],
          date: '2023-09-28',
          readTime: 10,
          icon: 'fas fa-cloud',
          color: '#ff9900'
        },
        {
          id: 5,
          title: 'Desarrollo de apps con Flutter',
          excerpt: 'Cómo crear aplicaciones multiplataforma con Flutter y Dart.',
          content: 'Contenido completo del artículo...',
          category: 'mobile',
          tags: ['Flutter', 'Dart', 'Mobile'],
          date: '2023-09-20',
          readTime: 7,
          icon: 'fab fa-flutter',
          color: '#02569b'
        },
        {
          id: 6,
          title: 'Introducción a Docker y contenedores',
          excerpt: 'Guía básica para comenzar a usar Docker en tus proyectos de desarrollo.',
          content: 'Contenido completo del artículo...',
          category: 'devops',
          tags: ['Docker', 'Contenedores', 'DevOps'],
          date: '2023-09-15',
          readTime: 6,
          icon: 'fab fa-docker',
          color: '#2496ed'
        },
        {
          id: 7,
          title: 'Análisis de datos con Python',
          excerpt: 'Utilizando Pandas y NumPy para procesamiento y análisis de datos.',
          content: 'Contenido completo del artículo...',
          category: 'data',
          tags: ['Python', 'Pandas', 'Data Science'],
          date: '2023-09-10',
          readTime: 9,
          icon: 'fab fa-python',
          color: '#3776ab'
        },
        {
          id: 8,
          title: 'Protección contra ransomware',
          excerpt: 'Estrategias efectivas para prevenir ataques de ransomware en tu organización.',
          content: 'Contenido completo del artículo...',
          category: 'security',
          tags: ['Seguridad', 'Ransomware', 'Ciberseguridad'],
          date: '2023-09-05',
          readTime: 8,
          icon: 'fas fa-shield-alt',
          color: '#00a8e8'
        }
      ]
    };
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles;
      
      // Filtrar por categoría
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(article => article.category === this.selectedCategory);
      }
      
      // Filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Ordenar
      if (this.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (this.sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (this.sortBy === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      return filtered;
    },
    recentArticles() {
      return [...this.articles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    }
  },
  methods: {
    toggleCategory(categoryId) {
      this.selectedCategory = this.selectedCategory === categoryId ? 'all' : categoryId;
    },
    filterArticles() {
      // La reactividad de Vue actualiza automáticamente filteredArticles
    },
    sortArticles() {
      // La reactividad de Vue actualiza automáticamente filteredArticles
    },
    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.sortBy = 'newest';
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'General';
    },
    getCategoryCount(categoryId) {
      if (categoryId === 'all') return this.articles.length;
      return this.articles.filter(article => article.category === categoryId).length;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    scrollToArticle(articleId) {
      // En una implementación real, esto navegaría al artículo completo
      alert(`Navegaría al artículo con ID: ${articleId}`);
    }
  }
};
</script>

<style scoped>
.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f9fafb;
}

.blog-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  color: white;
}

.blog-title {
  font-size: 3rem;
  margin-bottom: 10px;
  font-weight: 800;
}

.blog-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.blog-controls {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.search-container {
  position: relative;
  margin-bottom: 25px;
}

.search-container i {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 94%;
  padding: 15px 15px 15px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.category-filter {
  flex: 1;
  min-width: 300px;
}

.filter-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #475569;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn {
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: none;
  border-radius: 20px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background-color: #e2e8f0;
}

.category-btn.active {
  background-color: #3b82f6;
  color: white;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
}

.blog-content {
  display: flex;
  gap: 30px;
}

.articles-container {
  flex: 3;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.article-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.article-image {
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.article-icon {
  font-size: 4rem;
  color: white;
  opacity: 0.9;
}

.article-content {
  padding: 25px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #64748b;
}

.article-title {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: #1e293b;
  line-height: 1.3;
}

.article-excerpt {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.article-tag {
  background-color: #f1f5f9;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #475569;
}

.read-more-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.read-more-btn:hover {
  background-color: #2563eb;
}

.filter-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.clear-filters-btn {
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-filters-btn:hover {
  background-color: #e2e8f0;
}

.no-results {
  background-color: white;
  padding: 60px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex: 3;
}

.no-results i {
  color: #cbd5e1;
  margin-bottom: 20px;
}

.no-results h2 {
  color: #475569;
  margin-bottom: 15px;
}

.no-results p {
  color: #64748b;
  margin-bottom: 25px;
}

.blog-sidebar {
  flex: 1;
  min-width: 280px;
}

.sidebar-section {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #1e293b;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f5f9;
}

.category-list {
  list-style: none;
}

.category-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: color 0.2s;
}

.category-item:hover {
  color: #3b82f6;
}

.category-item.active {
  color: #3b82f6;
  font-weight: 600;
}

.category-item:last-child {
  border-bottom: none;
}

.category-count {
  background-color: #f1f5f9;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.recent-articles {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recent-article {
  cursor: pointer;
  transition: color 0.2s;
}

.recent-article:hover {
  color: #3b82f6;
}

.recent-title {
  font-size: 1rem;
  margin-bottom: 5px;
  line-height: 1.4;
}

.recent-meta {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  color: #64748b;
}

.newsletter p {
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.newsletter-input {
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.newsletter-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.newsletter-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-btn:hover {
  background-color: #2563eb;
}

.blog-footer {
  text-align: center;
  padding: 30px;
  margin-top: 40px;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 992px) {
  .blog-content {
    flex-direction: column;
  }
  
  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .blog-title {
    font-size: 2.2rem;
  }
}
</style>