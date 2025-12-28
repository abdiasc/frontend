<!-- MenuRenderer.vue -->
<template>
  <MenuBar>
    <template #logo>
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#grad)"/>
          <path d="M10 16L14 20L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stop-color="#6366f1"/>
              <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Premium</span>
      </div>
    </template>

    <div v-for="item in filteredItems" :key="item.id" class="menu-item-wrapper">
      <MenuItem
        v-if="item.type === 'item'"
        as="router-link"
        :to="item.to"
      >
        {{ item.label }}
      </MenuItem>

      <MenuDropdown v-else-if="item.type === 'dropdown'">
        <template #trigger>
          <MenuItem>
            {{ item.label }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </MenuItem>
        </template>

        <MenuItem
          v-for="child in item.children"
          :key="child.id"
          as="router-link"
          :to="child.to"
        >
          {{ child.label }}
        </MenuItem>
      </MenuDropdown>

      <MenuDropdown v-else-if="item.type === 'avatar'">
        <template #trigger>
          <MenuAvatar :src="item.src" :name="item.name" />
        </template>

        <MenuItem
          v-for="child in item.children"
          :key="child.id"
          @click="handleAction(child)"
        >
          <svg v-if="child.action === 'logout'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 3l7 7-7 7M9 12h12"/>
          </svg>
          <span>{{ child.label }}</span>
        </MenuItem>
      </MenuDropdown>
    </div>
  </MenuBar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MenuBar from './MenuBar.vue'
import MenuItem from './MenuItem.vue'
import MenuDropdown from './MenuDropdown.vue'
import MenuAvatar from './MenuAvatar.vue'

const props = defineProps({
  items: Array
})

const isAuthenticated = ref(false)

const filteredItems = computed(() =>
  props.items.filter(item => {
    if (item.auth === 'both') return true
    if (item.auth === 'guest') return !isAuthenticated.value
    if (item.auth === 'user') return isAuthenticated.value
    return true
  })
)
onMounted(() => {
  const token = localStorage.getItem('token')
  isAuthenticated.value = !!token
})
const handleAction = (item) => {
  if (item.to) router.push(item.to)
  if (item.action === 'logout') {
    localStorage.removeItem('token')
    isAuthenticated.value = false
    userRoles.value = []
    router.push('/login')
  }
}

</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

.logo:hover {
  transform: scale(1.02);
}

.logo svg {
  width: 32px;
  height: 32px;
}

.menu-item-wrapper {
  display: inline-flex;
}

@media (max-width: 768px) {
  .logo span {
    display: none;
  }

  .logo {
    padding: 0.5rem;
  }
}
</style>