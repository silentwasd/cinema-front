// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools: {enabled: true},

    modules: ["@nuxt/ui"],

    runtimeConfig: {
        public: {
            apiUrl    : process.env.NUXT_API_URL,
            storageUrl: process.env.NUXT_STORAGE_URL
        }
    }
})