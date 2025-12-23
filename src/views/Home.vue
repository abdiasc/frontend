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
    </div>
</template>
<script setup>
import BaseSlider from "@/components/slider/BaseSlider.vue";
import BaseCard from "@/components/card/BaseCard.vue";
const slides = [
    { id: 1, title: "Noticia 1", image: "https://picsum.photos/800/300?1" },
    { id: 2, title: "Noticia 2", image: "https://picsum.photos/800/300?2" },
    { id: 3, title: "Noticia 3", image: "https://picsum.photos/800/300?3" },
];

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
];
</script>
<style>
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
  /* agrega espacio alrededor */

}
</style>