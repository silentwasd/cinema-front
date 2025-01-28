<script setup lang="ts">
const config = useRuntimeConfig();

useHead({
    link: [
        {
            rel  : 'icon',
            href : '/icon/light.png',
            media: '(prefers-color-scheme: light)'
        },
        {
            rel  : 'icon',
            href : '/icon/dark.png',
            media: '(prefers-color-scheme: dark)'
        }
    ]
});

useSeoMeta({
    title        : 'КиноЛюмикс',
    description  : 'Сохрани каждый момент. Отслеживай просмотр и ставь собственные оценки.',
    ogTitle      : 'КиноЛюмикс',
    ogDescription: 'Сохрани каждый момент. Отслеживай просмотр и ставь собственные оценки.',
    ogImage      : config.public.externalUrl + '/img/cinema.png',
    ogUrl        : config.public.externalUrl,
    ogType       : 'website',
    ogLocale     : 'ru_RU',
    ogSiteName   : 'КиноЛюмикс'
});
</script>

<template>
    <UContainer class="py-5 md:py-6 font-roboto">
        <div class="flex items-center mb-10">
            <NuxtLink class="flex gap-2.5 items-center grow" to="/">
                <UIcon name="i-heroicons-film" class="hidden md:block text-8xl shrink-0"/>

                <div class="grow">
                    <h1 class="text-4xl font-black">КиноЛюмикс</h1>
                    <p class="text-xl font-light">Сохрани каждый момент</p>
                </div>
            </NuxtLink>

            <div class="shrink-0">
                <LazyClientOnly>
                    <UiColorModeButton/>
                </LazyClientOnly>
            </div>
        </div>

        <div class="flex justify-center">
            <slot/>
        </div>
    </UContainer>
</template>

<style scoped>

</style>