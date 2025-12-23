<template>
  <div>
    <BaseSlider :slides="slides" :autoplay="true" :interval="4000" effect="slide">
      <template #default="{ slide }">
        <div class="slide-content">
          <img :src="slide.image" :alt="slide.title" />
          <h3>{{ slide.title }}</h3>
        </div>
      </template>
    </BaseSlider>

    <div class="card-grid">
      <BaseCard v-for="item in cards" :key="item.id" v-bind="item" @action="item.onAction" />
    </div>

    <AutomationIndustrial />

    <!-- Portfolio Section -->
    <Portfolio 
      title="Proyectos Destacados"
      subtitle="Conoce los proyectos de investigación y desarrollo"
      :projects="portfolioProjects"
      :show-filters="true"
    />




  </div>
</template>

<script setup>
import BaseSlider from "@/components/slider/BaseSlider.vue"
import BaseCard from "@/components/card/BaseCard.vue"
import AutomationIndustrial from "@/components/automatizacion/AutomationIndustrial.vue"
import Portfolio from "@/components/portfolio/PortfolioGrid.vue"



const cards = [
  {
    id: 1,
    title: "Nueva convocatoria académica",
    description: "Postulaciones abiertas hasta el 30 de junio.",
    image: "https://picsum.photos/400/200",
    badge: "Noticias",
    actionLabel: "Leer más",
    onAction: () => (window.location.href = "/noticias"),
  },
  {
    id: 2,
    title: "Ingeniería de Software",
    description: "Duración: 5 años",
    image: "https://picsum.photos/400/202",
    badge: "Carrera",
    actionLabel: "Ver malla",
    onAction: () => (window.location.href = "/cursos"),
  },
]

const portfolioProjects = [
  {
    id: 1,
    title: 'Sistema de Gestión Académica',
    description: 'Plataforma integral para administración de estudiantes, cursos y calificaciones.',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    tags: ['Vue', 'Node.js', 'PostgreSQL'],
    client: 'Universidad',
    year: '2024',
    link: '#',
    github: '#'
  },
  {
    id: 2,
    title: 'App Móvil Estudiantes',
    description: 'Aplicación para que estudiantes consulten calificaciones y horarios en tiempo real.',
    category: 'Mobile',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    tags: ['React Native', 'Firebase'],
    client: 'Universidad',
    year: '2024',
    link: '#',
    github: '#'
  },
  {
    id: 3,
    title: 'Portal de Investigación',
    description: 'Repositorio digital para publicaciones, tesis y proyectos de investigación.',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    tags: ['Next.js', 'MongoDB'],
    client: 'Universidad',
    year: '2023',
    link: '#',
    github: '#'
  },
  {
    id: 4,
    title: 'Rediseño Plataforma Admisiones',
    description: 'Modernización de interfaz del sistema de postulaciones para mejorar UX.',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    tags: ['Figma', 'Design System'],
    client: 'Universidad',
    year: '2023',
    link: '#',
    github: ''
  },
  {
    id: 5,
    title: 'Sistema de Evaluación Online',
    description: 'Plataforma de exámenes con proctoring automático y análisis de resultados.',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1516534775068-bb57916b763a?w=500&h=300&fit=crop',
    tags: ['Vue', 'Python', 'WebRTC'],
    client: 'Universidad',
    year: '2024',
    link: '#',
    github: '#'
  },
  {
    id: 6,
    title: 'API Integración Sistemas',
    description: 'API REST para integración entre sistemas legacy y nuevas plataformas.',
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    client: 'Universidad',
    year: '2023',
    link: '#',
    github: '#'
  }
]
</script>

<style scoped>
.slide-content {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.slide-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content h3 {
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 8px;
  border-radius: 6px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
}
</style>