import type { UseFetchOptions } from 'nuxt/app'

function getTenantIdFromToken(token: string | null): string | null {
  if (!token) return null
  try {
    const payload = JSON.parse(
      decodeURIComponent(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    )
    const id = payload.tenantId
    return id != null ? String(id) : null
  } catch {
    return null
  }
}

export const useApi = <T>(
  url: string,
  options: UseFetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()
  const authCookie = useCookie<string | null>('auth_token')
  const authStore = useAuthStore()

  // TenantId from JWT so each tenant only sees their own data (never trust client alone; backend validates)
  const tenantId =
    authStore.user?.tenantId != null
      ? String(authStore.user.tenantId)
      : getTenantIdFromToken(authCookie.value)

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
    ...(authCookie.value ? { Authorization: `Bearer ${authCookie.value}` } : {}),
  }

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBaseUrl,
    headers: authHeaders,
    ...options,
    ...(options.headers && {
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    }),
  }

  return useFetch(url, defaults)
}