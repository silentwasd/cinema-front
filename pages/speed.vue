<script setup lang="ts">
import SpeedRepository from "~/repos/SpeedRepository";

definePageMeta({
    layout: 'management'
});

const config = useRuntimeConfig();

useSeoMeta({
    title        : 'Замерить скорость КиноЛюмиксе',
    description  : 'Проверь, как быстро грузятся фрагменты видео нашего сервера.',
    ogTitle      : 'Замерить скорость КиноЛюмиксе',
    ogDescription: 'Проверь, как быстро грузятся фрагменты видео нашего сервера.',
    ogImage      : config.public.externalUrl + '/img/cinema.png',
    ogUrl        : config.public.externalUrl,
    ogType       : 'website',
    ogLocale     : 'ru_RU',
    ogSiteName   : 'КиноЛюмикс'
});

const speedRepo          = new SpeedRepository();
const {data: streamData} = await speedRepo.index();

const speedData = ref<any>([]);
const running   = ref<boolean>(false);
const minDelay  = ref<number>(0);
const maxDelay  = ref<number>(0);

async function run() {
    running.value = true;

    speedData.value = [];

    const from = 1;
    const to   = 30;
    let pad    = 4;

    for (let i = from; i <= to; i++) {
        const start = Date.now();

        try {
            await $fetch(fileUrl(streamData.value?.stream ?? '') + `_${i.toString().padStart(pad, '0')}.ts`, {
                cache: 'no-cache'
            });
        } catch {
            pad--;
            await $fetch(fileUrl(streamData.value?.stream ?? '') + `_${i.toString().padStart(pad, '0')}.ts`, {
                cache: 'no-cache'
            });
        }

        const diff = Date.now() - start;

        speedData.value.push({x: i - from, y: diff});

        minDelay.value = speedData.value.toSorted((a, b) => a.y - b.y)[0].y;
        maxDelay.value = speedData.value.toSorted((a, b) => b.y - a.y)[0].y;

        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    running.value = false;
}
</script>

<template>
    <UMain class="flex flex-col">
        <UContainer class="flex items-center justify-center h-0 grow">
            <div class="flex flex-col gap-2.5">
                <div class="flex justify-evenly">
                    <div class="text-center">
                        <h1 class="font-roboto">МИНИМУМ</h1>
                        <p class="text-xl"><span class="text-4xl">{{ minDelay }}</span> мс</p>
                    </div>

                    <div class="text-center">
                        <h1 class="font-roboto">МАКСИМУМ</h1>
                        <p class="text-xl"><span class="text-4xl">{{ maxDelay }}</span> мс</p>
                    </div>
                </div>

                <ClientOnly>
                    <UiChart :chart-data="speedData"/>
                </ClientOnly>

                <UButton color="gray"
                         label="Запустить"
                         size="xl"
                         icon="i-heroicons-play-solid"
                         :loading="running"
                         @click="run"/>
            </div>
        </UContainer>
    </UMain>
</template>

<style scoped>

</style>