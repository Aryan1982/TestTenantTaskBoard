<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64" />
            <v-card-text class="text-h6 mt-4"> Loading... </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();

onMounted(() => {
  // Initialize auth state
  authStore.initAuth();

  // Redirect based on auth status
  if (authStore.isAuthenticated) {
    navigateTo("/tasks");
  } else {
    navigateTo("/login");
  }
});
</script>
