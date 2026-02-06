// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt'
  ],

  build: {
    transpile: ['vuetify']
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true })
    ],
    define: {
      'process.env.DEBUG': false
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
    }
  }
})