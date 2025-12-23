<template>
  <div
    class="slider"
    ref="sliderRef"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
  >
    <!-- Slides -->
    <transition-group
      name="slide"
      tag="div"
      class="slider-track"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        class="slider-item"
        v-for="(slide) in slides"
        :key="slide.id"
      >
        <slot :slide="slide" />
      </div>
    </transition-group>

    <!-- Botones -->
    <button class="slider-btn prev" @click="prevSlide">‹</button>
    <button class="slider-btn next" @click="nextSlide">›</button>

    <!-- Dots -->
    <div class="slider-dots" v-if="showDots">
      <span
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  interval: {
    type: Number,
    default: 4000
  },
  showDots: {
    type: Boolean,
    default: true
  },
  effect: {
    type: String,
    default: 'slide'
  }
})

const currentIndex = ref(0)
let timer = null

// Navegación
const nextSlide = () => {
  currentIndex.value =
    currentIndex.value < props.slides.length - 1 ? currentIndex.value + 1 : 0
}

const prevSlide = () => {
  currentIndex.value =
    currentIndex.value > 0 ? currentIndex.value - 1 : props.slides.length - 1
}

const goToSlide = (index) => {
  currentIndex.value = index
}

// Autoplay
const startAutoplay = () => {
  if (props.autoplay) {
    timer = setInterval(() => {
      nextSlide()
    }, props.interval)
  }
}

const stopAutoplay = () => {
  if (timer) clearInterval(timer)
}

watch(currentIndex, () => {
  stopAutoplay()
  startAutoplay()
})

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())

// Swipe variables
const sliderRef = ref(null)
let isDragging = false
let startX = 0
let deltaX = 0

const startDrag = (e) => {
  isDragging = true
  startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  stopAutoplay()
}

const onDrag = (e) => {
  if (!isDragging) return
  const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  deltaX = x - startX
}

const endDrag = () => {
  if (!isDragging) return
  if (deltaX > 50) prevSlide()
  else if (deltaX < -50) nextSlide()
  isDragging = false
  deltaX = 0
  startAutoplay()
}
</script>

<style scoped>
.slider {
  position: relative;
  overflow: hidden;
  width: 100%;
  user-select: none;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/* Track */
.slider-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slides */
.slider-item {
  min-width: 100%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

/* Imagen y overlay para títulos */
.slider-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.slider-item h3 {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background: linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3));
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  max-width: 70%;
}

/* Botones de navegación */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  z-index: 20;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  width: 48px;
    height: 48px;
}

.slider-btn:hover {
  background: rgba(0,0,0,0.8);
  transform: translateY(-50%) scale(1.1);
}

.slider-btn.prev {
  left: 16px;
}
.slider-btn.next {
  right: 16px;
}

/* Dots */
.slider-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.slider-dots span {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dots span.active {
  background: #22c55e;
  transform: scale(1.3);
}

/* Fade effect */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.6s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
.slider-item img {
  transition: transform 0.5s ease;
}

.slider-item:hover img {
  transform: scale(1.05);
}
</style>
