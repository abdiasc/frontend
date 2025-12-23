<template>
  <div class="avatar">
    <img :src="src" alt="avatar" />
    <span v-if="name">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  src: String,
  name: String
})
</script>

<style scoped>
.avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: aliceblue;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
</style>
