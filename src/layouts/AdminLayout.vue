<template>
  <div class="admin-layout">
    <AdminMenu />
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminMenu from "@/components/admin/AdminMenu.vue";
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  margin-left: 260px;
}
</style>
