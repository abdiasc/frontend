<template>
  <div class="card" :class="{ 'card-interactive': actionLabel }">
    <!-- Imagen con overlay -->
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" class="card-img" />
      <div class="card-overlay"></div>

      <!-- Badge mejorado -->
      <span v-if="badge" class="card-badge">
        <span class="badge-dot"></span>
        {{ badge }}
      </span>

      <!-- Icon overlay -->
      <div v-if="actionLabel" class="card-icon-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>

    <!-- Contenido -->
    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <div v-if="actionLabel" class="card-accent"></div>
      </div>

      <p v-if="description" class="card-description">
        {{ description }}
      </p>

      <!-- Slot extra -->
      <slot />

      <!-- Footer -->
      <div v-if="actionLabel" class="card-footer">
        <button class="card-button" @click="$emit('action')">
          <span>{{ actionLabel }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  image: String,
  badge: String,
  actionLabel: String
})

defineEmits(['action'])
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  height: 100%;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0) 0%, rgba(99, 102, 241, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
  border-radius: 16px;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #e5e7eb;
}

.card:hover::before {
  opacity: 1;
}

.card-interactive:hover {
  box-shadow: 0 25px 50px rgba(99, 102, 241, 0.15);
}

/* Imagen */
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.33, 0.66, 0.66, 1);
}

.card:hover .card-img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover .card-overlay {
  opacity: 1;
}

/* Badge mejorado */
.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  animation: badgePulse 2s ease-in-out infinite;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: badgeDot 1.5s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes badgeDot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

/* Icon overlay */
.card-icon-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  transition: all 0.4s ease;
  opacity: 0;
  color: white;
}

.card:hover .card-icon-overlay {
  background: rgba(0, 0, 0, 0.4);
  opacity: 1;
}

.card-icon-overlay svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Body */
.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
  margin: 0;
  flex: 1;
}

.card-accent {
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 2px;
  flex-shrink: 0;
}

.card-description {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 8px 0 16px 0;
  line-height: 1.5;
  flex: 1;
}

/* Footer */
.card-footer {
  margin-top: auto;
  padding-top: 12px;
}

.card-button {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.card-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.card-button:hover::before {
  opacity: 1;
}

.card-button:active {
  transform: translateY(0);
}

.card-button svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.card-button:hover svg {
  transform: translateX(2px);
}

/* Responsive */
@media (max-width: 640px) {
  .card {
    border-radius: 12px;
  }

  .card-image {
    height: 160px;
  }

  .card-body {
    padding: 16px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.875rem;
  }

  .card-button {
    padding: 10px 14px;
    font-size: 0.875rem;
  }
}
</style>