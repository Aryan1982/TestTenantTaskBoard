<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card elevation="8">
              <v-card-title class="text-h4 text-center py-6">
                Login
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="handleLogin">
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    closable
                    class="mb-4"
                    @click:close="errorMessage = ''"
                  >
                    {{ errorMessage }}
                  </v-alert>

                  <v-text-field
                    v-model="username"
                    label="Username"
                    variant="outlined"
                    :disabled="loading"
                    :rules="[rules.required]"
                    class="mb-3"
                  />

                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    :disabled="loading"
                    :rules="[rules.required]"
                    class="mb-4"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    :loading="loading"
                    :disabled="!username || !password"
                  >
                    Sign In
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const rules = {
  required: (value: string) => !!value || "This field is required",
};

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await authStore.login(username.value, password.value);

    if (result.success) {
      // Redirect to tasks page
      await navigateTo("/tasks");
    } else {
      errorMessage.value = result.error || "Login failed. Please try again.";
    }
  } catch (error: any) {
    errorMessage.value = error?.message || "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>
