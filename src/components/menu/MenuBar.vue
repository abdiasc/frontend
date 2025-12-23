<!-- MenuBar.vue -->
<template>
  <nav class="menu-bar">
    <div class="menu-container">
      <!-- IZQUIERDA -->
      <div class="menu-left">
        <slot name="logo" />
      </div>

      <!-- DERECHA -->
      <div class="menu-right">
        <slot />
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.menu-bar {
  position: sticky;
  top: 0;
  width: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.menu-container {
  display: flex;
  align-items: center;
  padding: 0.875rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.menu-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

@media (max-width: 768px) {
  .menu-container {
    padding: 0.75rem 1rem;
  }

  .menu-right {
    gap: 0.25rem;
  }
}
</style>