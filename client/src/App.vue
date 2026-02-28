<template>
  <div class="app-shell">
    <BacklinkBuilder />
  </div>
</template>

<script setup lang="ts">
import BacklinkBuilder from "./views/BacklinkBuilder.vue";
</script>

<style>
.app-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px;
}
</style>
