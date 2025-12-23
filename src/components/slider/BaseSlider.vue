<template>
  <div
    class="slider-modern"
    ref="sliderRef"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
  >
    <!-- Slides Container -->
    <div class="slider-container">
      <div
        v-for="(slide, index) in slides"
        v-show="index === currentIndex"
        :key="slide.id"
        class="slide-item"
        :style="{ transform: isDragging ? `translateX(${dragDelta * 0.2}px)` : 'none' }"
      >
        <!-- Imagen con gradiente -->
        <img :src="slide.image" :alt="slide.title" class="slide-image" />
        <div class="slide-overlay"></div>

        <!-- Contenido -->
        <div class="slide-content">
          <div class="content-badge">
            <div class="badge-line"></div>
            <span>{{ slide.badge }}</span>
          </div>

          <h1 class="slide-title">{{ slide.title }}</h1>
          <p class="slide-subtitle">{{ slide.subtitle }}</p>

          <button class="cta-button">
            Explorar Ahora
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Indicators Progress -->
      <div class="progress-indicators">
        <div
          v-for="(slide, index) in slides"
          :key="`progress-${slide.id}`"
          class="progress-bar"
          :class="{ active: index === currentIndex }"
        ></div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button class="nav-button prev-btn" @click="prevSlide" aria-label="Slide anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 19l-7-7 7-7"/>
      </svg>
    </button>

    <button class="nav-button next-btn" @click="nextSlide" aria-label="Siguiente slide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 5l7 7-7 7"/>
      </svg>
    </button>

    <!-- Dots Navigation -->
    <div class="dots-navigation">
      <button
        v-for="(slide, index) in slides"
        :key="`dot-${slide.id}`"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
        :aria-label="`Ir a slide ${index + 1}`"
      ></button>
    </div>

    <!-- Slide Counter -->
    <div class="slide-counter">
      <span class="current">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
      <span class="separator">/</span>
      <span class="total">{{ String(slides.length).padStart(2, '0') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
})

const slides = ref([
  {
    id: 1,
    title: 'Innovación Digital',
    subtitle: 'Transformando el futuro con tecnología de vanguardia',
    badge: 'Featured',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=900&fit=crop'
  },
  {
    id: 2,
    title: 'Creatividad Sin Límites',
    subtitle: 'Donde tus ideas cobran vida de formas inesperadas',
    badge: 'Inspiración',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=900&fit=crop'
  },
  {
    id: 3,
    title: 'Experiencias Inmersivas',
    subtitle: 'Conectando el mundo a través de diseño inteligente',
    badge: 'Tendencia',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&h=900&fit=crop'
  },
  {
    id: 4,
    title: 'Diseño Inteligente',
    subtitle: 'Funcionalidad y belleza en perfecta armonía',
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1400&h=900&fit=crop'
  }
])

const currentIndex = ref(0)
const isDragging = ref(false)
const dragDelta = ref(0)
const dragStart = ref(0)
const sliderRef = ref(null)
let autoplayTimer = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const startAutoplay = () => {
  if (props.autoplay) {
    autoplayTimer = setInterval(nextSlide, props.interval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) clearInterval(autoplayTimer)
}

const startDrag = (e) => {
  isDragging.value = true
  dragStart.value = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  stopAutoplay()
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  dragDelta.value = currentX - dragStart.value
}

const endDrag = () => {
  if (!isDragging.value) return
  if (dragDelta.value > 50) prevSlide()
  else if (dragDelta.value < -50) nextSlide()
  isDragging.value = false
  dragDelta.value = 0
  startAutoplay()
}

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.slider-modern {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0f0f0f;
  user-select: none;
}

/* Slides */
.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-item {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.slide-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.33, 0.66, 0.66, 1);
}

.slide-item:hover .slide-image {
  transform: scale(1.05);
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(15, 15, 15, 0.8) 0%,
    rgba(15, 15, 15, 0.6) 40%,
    rgba(15, 15, 15, 0.3) 70%,
    transparent 100%
  );
  z-index: 2;
}

/* Content */
.slide-content {
  position: relative;
  z-index: 3;
  padding: 60px;
  max-width: 800px;
  color: white;
  animation: slideInContent 0.8s ease-out 0.2s both;
}

@keyframes slideInContent {
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.content-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #a1a1a1;
}

.badge-line {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #06b6d4, #0ea5e9);
  border-radius: 2px;
}

.slide-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #e5e5e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slide-subtitle {
  font-size: 1.25rem;
  color: #d4d4d4;
  margin-bottom: 32px;
  font-weight: 300;
  line-height: 1.6;
  max-width: 500px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(6, 182, 212, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 60px rgba(6, 182, 212, 0.5);
}

.cta-button:active {
  transform: translateY(0);
}

.cta-button svg {
  transition: transform 0.3s ease;
}

.cta-button:hover svg {
  transform: translateX(4px);
}

/* Navigation Buttons */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-50%) scale(1.1);
}

.nav-button:active {
  transform: translateY(-50%) scale(0.95);
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

.prev-btn {
  left: 40px;
}

.next-btn {
  right: 40px;
}

/* Dots Navigation */
.dots-navigation {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 20;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  transition: all 0.4s ease;
}

.dot.active {
  background: #06b6d4;
  border-color: #06b6d4;
  width: 32px;
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

.dot:hover {
  border-color: rgba(255, 255, 255, 0.8);
}

/* Slide Counter */
.slide-counter {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #a1a1a1;
  z-index: 20;
  font-family: 'Courier New', monospace;
}

.slide-counter .current {
  color: white;
}

.slide-counter .separator {
  opacity: 0.5;
}

/* Progress Indicators */
.progress-indicators {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 4px;
  padding: 8px;
  z-index: 10;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
}

.progress-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s ease;
}

.progress-bar.active {
  background: #06b6d4;
  animation: progress 5s linear;
}

@keyframes progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .slide-content {
    padding: 40px;
  }

  .slide-title {
    font-size: clamp(1.8rem, 6vw, 3rem);
  }

  .slide-subtitle {
    font-size: 1rem;
  }

  .nav-button {
    width: 48px;
    height: 48px;
  }

  .prev-btn {
    left: 20px;
  }

  .next-btn {
    right: 20px;
  }

  .slide-counter {
    bottom: 20px;
    right: 20px;
    font-size: 1.2rem;
  }

  .dots-navigation {
    bottom: 20px;
  }
}
</style>