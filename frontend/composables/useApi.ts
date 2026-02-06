import type { UseFetchOptions } from 'nuxt/app'

export const useApi = <T>(
  url: string,
  options: UseFetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()
  const authCookie = useCookie<string | null>('auth_token')

  // Merge default options with provided options
  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': '1',
      ...(authCookie.value ? { Authorization: `Bearer ${authCookie.value}` } : {})
    },
    ...options,
    // Merge headers if provided in options
    ...(options.headers && {
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': '1',
        ...(authCookie.value ? { Authorization: `Bearer ${authCookie.value}` } : {}),
        ...options.headers
      }
    })
  }

  return useFetch(url, defaults)
}