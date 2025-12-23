<!-- MenuItem.vue -->
<template>
  <component
    :is="as"
    class="menu-item"
    :to="to"
    @click="$emit('click')"
  >
    <span class="menu-item-label">
      <slot />
    </span>
    <span class="menu-item-underline"></span>
  </component>
</template>

<script setup>
defineProps({
  as: {
    type: String,
    default: 'button'
  },
  to: String
})

defineEmits(['click'])
</script>

<style scoped>
.menu-item {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.625rem 1rem;
  font-size: 0.95rem;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-decoration: none;
  color: #cbd5e1;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
}

.menu-item:hover {
  color: #f1f5f9;
  background: rgba(99, 102, 241, 0.1);
}

.menu-item-label {
  position: relative;
  z-index: 1;
}

.menu-item-underline {
  position: absolute;
  bottom: 8px;
  left: 50%;
  width: 0;
  height: 2.5px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateX(-50%);
  border-radius: 2px;
}

.menu-item:hover .menu-item-underline {
  width: 80%;
}

.menu-item:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .menu-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
