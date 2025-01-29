// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools: {enabled: true},

    extends: ["@nuxt/ui-pro"],

    modules: ["@nuxt/ui", '@nuxtjs/google-fonts', '@vueuse/nuxt', 'nuxt-time'],

    colorMode: {
        preference: 'dark'
    },

    runtimeConfig: {
        public: {
            apiUrl     : process.env.NUXT_API_URL,
            storageUrl : process.env.NUXT_STORAGE_URL,
            externalUrl: process.env.NUXT_EXTERNAL_URL,
            metrics    : process.env.NUXT_METRICS
        }
    },

    devServer: {
        host : '0.0.0.0',
        port : 3001,
        https: {
            key : process.env.NUXT_SSL_KEY_FILE,
            cert: process.env.NUXT_SSL_CERT_FILE
        }
    },

    googleFonts: {
        families: {
            Roboto: {
                wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
                ital: [300]
            }
        }
    },

    app: {
        head: {
            meta: [
                {name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'}
            ]
        }
    }
})