<template>
  <div class="card">
    <!-- Imagen -->
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" />
      <span v-if="badge" class="card-badge">{{ badge }}</span>
    </div>

    <!-- Contenido -->
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>

      <p v-if="description" class="card-description">
        {{ description }}
      </p>

      <!-- Slot extra -->
      <slot />

      <!-- Footer -->
      <div v-if="actionLabel" class="card-footer">
        <button class="card-button" @click="$emit('action')">
          {{ actionLabel }}
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
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(0,0,0,0.12);
}

/* Imagen */
.card-image {
  position: relative;
}

.card-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

/* Badge */
.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #22c55e;
  color: white;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 999px;
}

/* Body */
.card-body {
  padding: 1rem;
  flex: 1;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

/* Footer */
.card-footer {
  margin-top: auto;
}

.card-button {
  width: 100%;
  border: none;
  background: #22c55e;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.card-button:hover {
  background: #16a34a;
}
</style>
