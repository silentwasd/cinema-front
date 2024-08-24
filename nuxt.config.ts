// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools: {enabled: true},

    modules: ["@nuxt/ui"],

    runtimeConfig: {
        public: {
            apiUrl    : 'http://myfilms.test/api',
            storageUrl: 'http://myfilms.test/storage'
        }
    }
})