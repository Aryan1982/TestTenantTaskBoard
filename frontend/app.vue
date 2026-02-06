<template>
  <NuxtPage />
</template>

<script setup lang="ts">
// Initialize Pinia store on app mount
const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>
