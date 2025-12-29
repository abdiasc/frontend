<!-- MenuAvatar.vue -->
<template>
  <div class="avatar" :title="name">
    <div class="avatar-image">
      <img :src="userStore.avatarUrl" alt="Avatar" class="avatar" />
      <div class="avatar-status"></div>
    </div>
    <span v-if="userStore.user?.nombre" class="avatar-name">
      <!--{{ userStore.user.nombre }}-->
    </span>
  </div>
</template>

<script setup>

import { onMounted } from 'vue'

import { useUserStore } from '@/stores/user.store'
const userStore = useUserStore()

// Si quieres pasar un nombre personalizado también, puedes mantener defineProps
defineProps({
  name: String
})

onMounted(async () => {
  await userStore.fetchUser()
  console.log('USER:', userStore.user)
  console.log('AVATAR:', userStore.avatarUrl)
})
</script>

<style scoped>
.avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.avatar:hover {
  background: rgba(255, 255, 255, 0.08);
}

.avatar-image {
  position: relative;
  flex-shrink: 0;
}

.avatar-image img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  object-fit: cover;
}

.avatar:hover .avatar-image img {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid #0f172a;
  border-radius: 50%;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }
}

.avatar-name {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 500;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .avatar-name {
    display: none;
  }

  .avatar {
    padding: 0.375rem;
  }
}
</style>
