<script setup lang="ts">
import FilmRepository from "~/repos/FilmRepository";
import type Film from "~/resources/Film";

definePageMeta({
    middleware: 'auth',
    layout    : 'management'
});

const route    = useRoute();
const filmId   = parseInt(route.params.film as string);
const filmRepo = new FilmRepository();

const {data: film} = await filmRepo.show(`film.${filmId}`, filmId);

const filmData = computed<Film | null>(() => film.value?.data || null);
</script>

<template>
    <div v-if="filmData" class="flex flex-col sm:flex-row gap-5 pb-5">
        <div class="shrink-0">
            <div class="sm:sticky sm:top-5">
                <img v-if="filmData.cover"
                     :src="fileUrl(filmData.cover)"
                     :alt="filmData.name"
                     class="block rounded-lg w-full sm:max-h-[400px] border dark:border-gray-800"/>
            </div>
        </div>

        <div class="flex flex-col font-robot gap-10 grow">
            <div class="flex flex-col gap-2.5">
                <h1 class="font-black text-4xl leading-9">{{ filmData.name }}</h1>

                <div class="flex text-xl font-medium">
                    <p>{{ filmFormat(filmData.format) }}</p>
                    <p v-if="filmData.release_date" class="has-dot">{{ filmData.release_date }}</p>
                </div>

                <p class="text-xl font-light">{{ filmData.description }}</p>
            </div>

            <div v-if="filmData.ratings.length > 0">
                <h1 class="font-bold text-2xl">Рейтинги</h1>

                <div class="flex flex-col gap-2.5 mt-2.5">
                    <div v-for="rating in filmData.ratings.sort((a, b) => b.created_at - a.created_at)"
                         :key="rating.id">
                        <p class="font-medium leading-4">{{ rating.user?.name }}</p>
                        <p class="text-xl">{{ rating.data.comment }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.has-dot::before {
    content: '•'; /* Символ точки */
    margin: 0 8px; /* Отступы слева и справа от точки */
    color: currentColor; /* Цвет текста */
}
</style>