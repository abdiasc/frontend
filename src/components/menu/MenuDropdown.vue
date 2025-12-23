<template>
  <div class="dropdown" ref="dropdown">
    <div @click="toggle">
      <slot name="trigger" />
    </div>

    <div v-if="open" class="dropdown-menu">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
const dropdown = ref(null)

const toggle = () => open.value = !open.value

const closeOnClickOutside = (e) => {
  if (dropdown.value && !dropdown.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', closeOnClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', closeOnClickOutside))
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: rgb(49, 47, 47);
  border-radius: 8px;
  min-width: 180px;
  padding: 0.5rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  color: black;

  /* 👇 CLAVE */
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 60;
}
</style>
