// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools: {enabled: true},

    modules: ["@nuxt/ui", '@nuxtjs/google-fonts'],

    runtimeConfig: {
        public: {
            apiUrl     : process.env.NUXT_API_URL,
            storageUrl : process.env.NUXT_STORAGE_URL,
            externalUrl: process.env.NUXT_EXTERNAL_URL
        }
    },

    devServer: {
        host : '0.0.0.0',
        port : 3000,
        https: {
            key : '../certs/film-back-local.vrkitty.ru/privkey.pem',
            cert: '../certs/film-back-local.vrkitty.ru/fullchain.pem'
        }
    },

    googleFonts: {
        families: {
            Roboto: {
                wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
                ital: [300]
            }
        }
    }
})