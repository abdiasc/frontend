<!-- MenuDropdown.vue -->
<template>
  <div class="dropdown" ref="dropdown">
    <div class="dropdown-trigger" @click="toggle">
      <slot name="trigger" />
    </div>

    <Teleport to="body">
      <Transition name="dropdown-anim">
        <div v-if="open" class="dropdown-menu" :style="menuStyle">
          <div class="dropdown-content">
            <slot />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const open = ref(false)
const dropdown = ref(null)
const menuStyle = ref({})

const toggle = () => {
  open.value = !open.value
  if (open.value) {
    updateMenuPosition()
  }
}

const updateMenuPosition = () => {
  if (!dropdown.value) return
  const rect = dropdown.value.getBoundingClientRect()
  menuStyle.value = {
    position: 'fixed',
    top: rect.bottom + 8 + 'px',
    right: window.innerWidth - rect.right + 'px'
  }
}

const closeOnClickOutside = (e) => {
  if (dropdown.value && !dropdown.value.contains(e.target)) {
    open.value = false
  }
}

const handleResize = () => {
  if (open.value) {
    updateMenuPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-menu {
  z-index: 200;
  pointer-events: auto;
}

.dropdown-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 12px;
  min-width: 200px;
  padding: 0.75rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 
              0 0 1px rgba(255, 255, 255, 0.1) inset;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.dropdown-anim-enter-active,
.dropdown-anim-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-anim-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

@media (max-width: 768px) {
  .dropdown-content {
    min-width: 180px;
    padding: 0.5rem;
  }
}
</style>