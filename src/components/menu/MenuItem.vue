<template>
  <component
    :is="as"
    class="menu-item"
    @click="$emit('click')"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  as: {
    type: String,
    default: 'button' // button | a | router-link
  }
})
</script>

<style scoped>
.menu-item {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  border-radius: 6px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-decoration: none;
  color: #f3f4f6;
}

.menu-item::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #22c55e; /* verde institucional */
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.menu-item:hover::after {
  width: 90%;
}

</style>
