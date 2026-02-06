import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface User {
  id: string
  username: string
  email?: string
  [key: string]: any
}

interface JWTPayload {
  sub?: string
  username?: string
  email?: string
  exp?: number
  iat?: number
  [key: string]: any
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  // Decode JWT payload
  const decodeJWT = (token: string): JWTPayload | null => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to decode JWT:', error)
      return null
    }
  }

  // Computed property for authentication status
  const isAuthenticated = computed(() => {
    if (!token.value) return false
    
    // Check if token is expired
    const payload = decodeJWT(token.value)
    if (payload?.exp) {
      const now = Math.floor(Date.now() / 1000)
      return payload.exp > now
    }
    
    return true
  })

  // Initialize auth state from cookie
  const initAuth = () => {
    const authCookie = useCookie<string | null>('auth_token', {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    if (authCookie.value) {
      token.value = authCookie.value
      const payload = decodeJWT(authCookie.value)
      
      if (payload) {
        user.value = {
          id: payload.sub || payload.id || '',
          username: payload.username || payload.name || '',
          email: payload.email || '',
          ...payload
        }
      }
    }
  }

  // Login action
  const login = async (username: string, password: string) => {
    try {
      const config = useRuntimeConfig()
      
      const response = await $fetch<{ token: string; user?: any }>(`${config.public.apiBaseUrl}/auth/login`, {
        method: 'POST',
        body: {
          username,
          password
        }
      })

      if (response.token) {
        token.value = response.token
        
        // Decode and set user from JWT
        const payload = decodeJWT(response.token)
        if (payload) {
          user.value = {
            id: payload.sub || payload.id || '',
            username: payload.username || payload.name || username,
            email: payload.email || '',
            ...payload
          }
        }

        // Persist token in cookie
        const authCookie = useCookie<string>('auth_token', {
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        authCookie.value = response.token

        return { success: true }
      }

      return { success: false, error: 'No token received' }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Login failed'
      }
    }
  }

  // Logout action
  const logout = () => {
    token.value = null
    user.value = null

    // Clear cookie
    const authCookie = useCookie('auth_token')
    authCookie.value = null

    // Redirect to login
    if (process.client) {
      navigateTo('/login')
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    initAuth,
    login,
    logout
  }
})