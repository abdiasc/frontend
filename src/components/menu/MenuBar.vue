<template>
  <nav class="menu-bar">
    <!-- IZQUIERDA -->
    <div class="menu-left">
      <slot name="logo" />
    </div>

    <!-- DERECHA -->
    <div class="menu-right">
      <slot />
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  background-color: #061f1d;
}

/* logo */
.menu-left {
  display: flex;
  align-items: center;
}

/* menú */
.menu-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto; /* 👈 CLAVE */
}
</style>

