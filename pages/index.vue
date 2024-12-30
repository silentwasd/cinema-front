<script setup lang="ts">
import FilmRepository from "~/repos/public/FilmRepository";

useSeoMeta({
    title: 'ВКинопоиск'
});

const filmRepo      = new FilmRepository();
const {data: films} = await filmRepo.list(`films`);
</script>

<template>
    <div class="font-roboto">
        <UContainer class="py-5 text-center md:py-10 md:text-start">
            <h1 class="text-4xl font-black">ВКинопоиск</h1>
            <p class="text-xl font-light">Сохрани каждый момент.</p>
        </UContainer>

        <div class="h-[60dvh] bg-center bg-cover"
             style="background-image: url('/img/cinema.png');">
            <div
                class="bg-gradient-to-r from-gray-950 via-transparent/10 md:via-transparent to-gray-950 text-gray-50 h-full">
                <UContainer class="flex flex-col items-center justify-center gap-5 h-full">
                    <h3 class="font-bold text-2xl md:text-4xl text-center drop-shadow-md">
                        Отслеживай просмотр<br>
                        и ставь собственные оценки
                    </h3>

                    <UButton label="Начать"
                             size="xl"
                             color="gray"
                             class="md:text-xl"
                             to="/management/catalog"
                             :ui="{rounded: 'rounded-xl', color: {gray: {solid: 'ring-0'}}}"/>
                </UContainer>
            </div>
        </div>

        <UContainer class="py-5 md:py-10">
            <h3 class="font-bold text-2xl mb-5">А ты уже посмотрел?</h3>

            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                <NuxtLink class="block"
                          to="/management/catalog"
                          v-for="film in films?.data ?? []">
                    <img v-if="film.cover"
                         :src="fileUrl(film.cover)"
                         :alt="film.name"
                         class="w-full h-[200px] md:h-[250px] object-contain bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg"/>

                    <div class="mt-1.5">
                        <p class="truncate text-lg font-medium leading-5">{{ film.name }}</p>
                        <p class="font-light truncate text-sm">
                        <span>
                            {{ {film: 'Фильм', 'mini-series': 'Мини-сериал', series: 'Сериал'}[film.format] }}
                        </span>
                            <span class="text-gray-600 dark:text-gray-400 italic ms-1">{{ film.release_date }}</span>
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </UContainer>

        <div class="bg-gray-950 text-gray-400">
            <UContainer class="py-5 md:py-10 text-center text-xs md:text-start md:text-base">
                <p>Сервис не имеет никакого отношения к Кинопоиску.</p>
                <p>
                    Что-то не работает? Напиши разработчику в
                    <a href="https://t.me/BashkirskyKot"
                       target="_blank"
                       class="underline text-blue-400">Telegram</a>!
                </p>
            </UContainer>
        </div>
    </div>
</template>

<style scoped>

</style>