export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from cookie on first load
  if (!authStore.token) {
    authStore.initAuth()
  }

  const isAuthenticated = authStore.isAuthenticated

  // Redirect unauthenticated users to login when accessing protected routes
  if (to.path === '/tasks' && !isAuthenticated) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from login page
  if (to.path === '/login' && isAuthenticated) {
    return navigateTo('/tasks')
  }
})