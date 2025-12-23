<template>
  <section class="portfolio">
    <div class="portfolio-container">
      <!-- Header -->
      <div class="portfolio-header">
        <h2 class="portfolio-title">{{ title }}</h2>
        <p class="portfolio-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Filtros -->
      <div v-if="showFilters" class="portfolio-filters">
        <button
          v-for="filter in filters"
          :key="filter"
          class="filter-btn"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Galería -->
      <div class="portfolio-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="portfolio-card"
          @click="openModal(project)"
        >
          <div class="card-image">
            <img :src="project.image" :alt="project.title" />
            <div class="card-overlay">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="card-content">
            <div class="card-category">{{ project.category }}</div>
            <h3 class="card-title">{{ project.title }}</h3>
            <p class="card-desc">{{ project.description }}</p>

            <div class="card-tags">
              <span v-for="(tag, i) in project.tags.slice(0, 2)" :key="i" class="small-tag">
                {{ tag }}
              </span>
              <span v-if="project.tags.length > 2" class="small-tag more">
                +{{ project.tags.length - 2 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedProject" class="modal-overlay" @click="selectedProject = null">
          <div class="modal-content" @click.stop>
            <button class="modal-close" @click="selectedProject = null">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="modal-body">
              <div class="modal-image">
                <img :src="selectedProject.image" :alt="selectedProject.title" />
              </div>

              <div class="modal-info">
                <h3 class="modal-title">{{ selectedProject.title }}</h3>
                <p class="modal-description">{{ selectedProject.description }}</p>

                <div class="modal-tags">
                  <span v-for="tag in selectedProject.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>

                <div class="modal-stats">
                  <div class="stat">
                    <span class="stat-label">Cliente</span>
                    <span class="stat-value">{{ selectedProject.client }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Año</span>
                    <span class="stat-value">{{ selectedProject.year }}</span>
                  </div>
                </div>

                <div class="modal-actions">
                  <a v-if="selectedProject.link" :href="selectedProject.link" target="_blank" class="btn btn-primary">
                    Ver Proyecto
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                  </a>
                  <a v-if="selectedProject.github" :href="selectedProject.github" target="_blank" class="btn btn-secondary">
                    GitHub
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Portafolio'
  },
  subtitle: {
    type: String,
    default: 'Explora mis proyectos más destacados y casos de éxito'
  },
  projects: {
    type: Array,
    required: true
  },
  showFilters: {
    type: Boolean,
    default: true
  }
})

const activeFilter = ref('Todos')
const selectedProject = ref(null)

const filters = ['Todos', 'Web', 'Mobile', 'Design', 'Backend']

const filteredProjects = computed(() => {
  if (activeFilter.value === 'Todos') return props.projects
  return props.projects.filter(p => p.category === activeFilter.value)
})

const openModal = (project) => {
  selectedProject.value = project
}
</script>

<style scoped>
.portfolio {
  width: 97%;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
}

.portfolio-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.portfolio-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInDown 0.6s ease-out;
}

.portfolio-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #f1f5f9;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.portfolio-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Filtros */
.portfolio-filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.filter-btn {
  padding: 10px 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #cbd5e1;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.filter-btn:hover {
  border-color: rgba(99, 102, 241, 0.6);
  color: #f1f5f9;
}

.filter-btn.active {
  border-color: transparent;
  color: white;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
}

.filter-btn.active::before {
  opacity: 1;
}

/* Grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.portfolio-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.portfolio-card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: #0f172a;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.33, 0.66, 0.66, 1);
}

.portfolio-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.portfolio-card:hover .card-overlay {
  opacity: 1;
}

.card-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.portfolio-card:hover .card-icon {
  transform: scale(1);
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.card-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: #a5b4fc;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.3;
  margin: 0;
}

.card-desc {
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.5;
  flex: 1;
  margin: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.small-tag {
  padding: 4px 10px;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.small-tag.more {
  background: rgba(139, 92, 246, 0.2);
  color: #d8b4fe;
  border-color: rgba(139, 92, 246, 0.35);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.modal-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-title {
  font-size: 2rem;
  font-weight: 900;
  color: #f1f5f9;
}

.modal-description {
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.8;
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.modal-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn svg {
  width: 18px;
  height: 18px;
}

/* Animaciones */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .portfolio {
    padding: 60px 16px;
  }

  .portfolio-header {
    margin-bottom: 40px;
  }

  .portfolio-filters {
    gap: 8px;
  }

  .filter-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .modal-body {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-stats {
    grid-template-columns: 1fr;
  }
}
</style>