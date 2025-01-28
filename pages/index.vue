<script setup lang="ts">
import FilmRepository from "~/repos/public/FilmRepository";
import {FilmCinemaStatus} from "~/types/enums/FilmCinemaStatus";

definePageMeta({
    layout: 'default'
});

const config = useRuntimeConfig();

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

const filmRepo      = new FilmRepository();
const {data: films} = await filmRepo.list(`films`);
</script>

<template>
    <UMain>
        <div class="font-roboto">
            <UContainer class="py-5 md:py-10">
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    <NuxtLink class="block"
                              :to="`/catalog/films/${film.id}`"
                              v-for="film in films?.data.filter(film => film.cinema_status == FilmCinemaStatus.Published) ?? []">
                        <img v-if="film.cover"
                             :src="fileUrl(film.cover)"
                             :alt="film.name"
                             class="w-full h-[200px] md:h-[250px] object-contain bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg"/>

                        <div class="mt-1.5">
                            <p class="truncate text-lg font-medium leading-5">{{ film.name }}</p>
                            <p class="font-light truncate text-sm">
                        <span>
                            {{ filmFormat(film.format) }}
                        </span>
                                <span class="text-gray-600 dark:text-gray-400 italic ms-1">{{ film.release_date }}</span>
                            </p>
                        </div>
                    </NuxtLink>
                </div>
            </UContainer>
        </div>
    </UMain>
</template>

<style scoped>

</style>