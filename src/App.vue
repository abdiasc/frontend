<template>
  <div>
    <MenuRenderer :items="menuConfig" />
    <router-view />

  </div>
</template>

<script setup>
import { menuConfig } from "@/components/menu/menu.config";
import MenuRenderer from "@/components/menu/MenuRenderer.vue";

</script>
<style>
body {
  margin: 0px;
}



</style>