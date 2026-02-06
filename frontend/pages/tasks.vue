<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>Task Management</v-app-bar-title>

      <v-spacer />

      <v-chip class="mr-4" v-if="authStore.user">
        {{ authStore.user.username }}
      </v-chip>

      <v-btn variant="text" @click="authStore.logout"> Logout </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h5">Tasks</span>

                <v-btn color="primary" @click="createDialog = true">
                  <IconPlus class="mr-2" :size="20" />
                  New Task
                </v-btn>
              </v-card-title>

              <v-progress-linear v-if="pending" indeterminate color="primary" />

              <v-card-text>
                <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                  {{ error.message || "Failed to load tasks" }}
                </v-alert>

                <v-data-table
                  v-if="!pending && !error && tasks.length > 0"
                  :headers="headers"
                  :items="tasks"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      variant="tonal"
                      size="small"
                    >
                      {{ formatStatus(item.status) }}
                    </v-chip>
                  </template>

                  <template v-slot:item.createdAt="{ item }">
                    {{ formatDate(item.createdAt) }}
                  </template>
                </v-data-table>

                <v-container
                  v-if="!pending && !error && tasks.length === 0"
                  class="text-center py-12"
                >
                  <IconClipboardOff :size="64" class="mb-4 text-grey" />
                  <v-card-title class="text-h6 text-grey"
                    >No tasks found</v-card-title
                  >
                  <v-card-text class="text-grey">
                    Get started by creating your first task
                  </v-card-text>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="createDialog = true"
                    class="mt-4"
                  >
                    <IconPlus class="mr-2" :size="20" />
                    Create Task
                  </v-btn>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Create Task Dialog -->
    <v-dialog v-model="createDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5"> Create New Task </v-card-title>

        <v-card-text>
          <v-alert
            v-if="createError"
            type="error"
            variant="tonal"
            closable
            class="mb-4"
            @click:close="createError = ''"
          >
            {{ createError }}
          </v-alert>

          <v-form ref="formRef" @submit.prevent="handleCreateTask">
            <v-text-field
              v-model="newTask.title"
              label="Title"
              variant="outlined"
              :disabled="creating"
              :rules="[rules.required]"
              class="mb-3"
            />

            <v-textarea
              v-model="newTask.description"
              label="Description"
              variant="outlined"
              :disabled="creating"
              rows="3"
              class="mb-3"
            />

            <v-select
              v-model="newTask.status"
              label="Status"
              variant="outlined"
              :items="statusOptions"
              :disabled="creating"
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="closeCreateDialog" :disabled="creating">
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            variant="elevated"
            @click="handleCreateTask"
            :loading="creating"
            :disabled="!newTask.title || !newTask.status"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { IconPlus, IconClipboardOff } from "@tabler/icons-vue";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Pending" | "InProgress" | "Done";
  createdAt: string;
}

interface CreateTaskPayload {
  title: string;
  description?: string;
  status: "Pending" | "InProgress" | "Done";
}

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();

// Fetch tasks using useApi
const { data, pending, error, refresh } = await useApi<Task[]>("/tasks");

const tasks = computed(() => {
  if (!data.value) return [];
  return data.value.map((t) => ({
    id: t.Id,
    title: t.Title,
    description: t.Description,
    status: t.Status,
    createdAt: t.CreatedAt,
  }));
});

// Table headers
const headers = [
  { title: "Title", key: "title", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Created At", key: "createdAt", sortable: true },
];

// Create task dialog
const createDialog = ref(false);
const creating = ref(false);
const createError = ref("");
const formRef = ref();

const newTask = ref<CreateTaskPayload>({
  title: "",
  description: "",
  status: "Pending",
});

const statusOptions = [
  { title: "Pending", value: "Pending" },
  { title: "In Progress", value: "InProgress" },
  { title: "Done", value: "Done" },
];

const rules = {
  required: (value: string) => !!value || "This field is required",
};

// Status color mapping
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "warning",
    InProgress: "info",
    Done: "success",
  };
  return colors[status] || "default";
};

// Format status for display
const formatStatus = (status: string) => {
  if (status === "InProgress") return "In Progress";
  return status;
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Handle create task
const handleCreateTask = async () => {
  if (!newTask.value.title || !newTask.value.status) {
    createError.value = "Please fill in all required fields";
    return;
  }

  creating.value = true;
  createError.value = "";

  try {
    const { error: apiError } = await useApi("/tasks", {
      method: "POST",
      body: newTask.value,
    });

    if (apiError.value) {
      throw new Error(apiError.value.message || "Failed to create task");
    }

    // Refresh tasks list
    await refresh();

    // Close dialog and reset form
    closeCreateDialog();
  } catch (err: any) {
    createError.value = err.message || "Failed to create task";
  } finally {
    creating.value = false;
  }
};

// Close create dialog
const closeCreateDialog = () => {
  createDialog.value = false;
  createError.value = "";
  newTask.value = {
    title: "",
    description: "",
    status: "Pending",
  };
};
</script>
