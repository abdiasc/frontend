<template>
  <MenuBar>
    <div
      v-for="item in filteredItems"
      :key="item.id"
    >
      <MenuItem
        v-if="item.type === 'item'"
        as="router-link"
        :to="item.to"
      >
        {{ item.label }}
      </MenuItem>

      <MenuDropdown v-else-if="item.type === 'dropdown'">
        <template #trigger>
          <MenuItem>{{ item.label }} ▾</MenuItem>
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
          {{ child.label }}
        </MenuItem>
      </MenuDropdown>
    </div>
  </MenuBar>
</template>

<script setup>
import { ref, computed } from 'vue'
import MenuBar from './MenuBar.vue'
import MenuItem from './MenuItem.vue'
import MenuDropdown from './MenuDropdown.vue'
import MenuAvatar from './MenuAvatar.vue'

const props = defineProps({
  items: Array
})

const isAuthenticated = ref(false) // true = sesión iniciada

const filteredItems = computed(() =>
  props.items.filter(item => {
    if (item.auth === 'both') return true
    if (item.auth === 'guest') return !isAuthenticated.value
    if (item.auth === 'user') return isAuthenticated.value
    return true
  })
)

const handleAction = (item) => {
  if (item.to) window.location.href = item.to
  if (item.action === 'logout') isAuthenticated.value = false
}
</script>
