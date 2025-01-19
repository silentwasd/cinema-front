<script setup lang="ts">
import FilmRepository from "~/repos/FilmRepository";
import type Film from "~/resources/Film";
import FilmPeopleEdit from "~/components/ui/FilmPeopleEdit.vue";
import {UserRole} from "~/types/enums/UserRole";
import {PersonRole} from "~/types/enums/PersonRole";

definePageMeta({
    layout: 'management'
});

const route            = useRoute();
const config           = useRuntimeConfig();
const filmId           = parseInt(route.params.film as string);
const filmRepo         = new FilmRepository();
const {state: profile} = useProfile();

const {data: film, refresh} = await filmRepo.show(`film.${filmId}`, filmId);

const filmData = computed<Film | null>(() => film.value?.data || null);
const director = computed<string | undefined | null>(() => filmData.value?.people?.find(person => person.role == PersonRole.Director)?.person?.name);
const actor    = computed<string | undefined | null>(() => filmData.value?.people?.find(person => person.role == PersonRole.Actor)?.person?.name);

useSeoMeta({
    title        : filmData.value?.name + ' // ВКинопоиск',
    description  : filmData.value?.description,
    ogTitle      : filmData.value?.name,
    ogDescription: filmData.value?.description,
    ogImage      : filmData.value?.cover
                   ? fileUrl(filmData.value.cover as string)
                   : config.public.externalUrl + '/img/cinema.png',
    ogUrl        : config.public.externalUrl + '/catalog/films/' + filmData.value?.id,
    ogType       : 'video.movie',
    ...director.value ? {ogDirector: director.value} : {},
    ...actor.value ? {ogActor: actor.value} : {},
    ...filmData.value?.release_date ? {ogRelease_date: new Date(filmData.value.release_date).toISOString().slice(0, 10)} : {},
    ogLocale  : 'ru_RU',
    ogSiteName: 'ВКинопоиск'
});

const peopleEdit    = ref<boolean>(false);
const peopleDetails = ref<boolean>(false);

function peopleEditSwitch() {
    peopleEdit.value = !peopleEdit.value;

    if (!peopleEdit.value)
        refresh();
}
</script>

<template>
    <UMain>
        <UContainer class="py-2.5">
            <div v-if="filmData" class="flex flex-col sm:flex-row gap-5 pb-5">
                <div class="shrink-0">
                    <div class="sm:sticky sm:top-20 flex flex-col gap-2.5">
                        <img v-if="filmData.cover"
                             :src="fileUrl(filmData.cover)"
                             :alt="filmData.name"
                             class="block rounded-lg w-full sm:max-w-[250px] sm:max-h-[400px] border dark:border-gray-800"/>

                        <UButton v-if="filmData.can_watch"
                                 color="gray"
                                 label="Смотреть"
                                 icon="i-heroicons-play-solid"
                                 :to="`/cinema/${filmData.id}`"/>
                    </div>
                </div>

                <div class="flex flex-col font-robot gap-10 grow">
                    <div class="flex flex-col gap-2.5">
                        <h1 class="font-black text-4xl leading-9">{{ filmData.name }}</h1>

                        <div class="flex text-xl font-medium">
                            <p>{{ filmFormat(filmData.format) }}</p>
                            <p v-if="filmData.release_date" class="has-dot">
                                <NuxtTime :datetime="filmData.release_date" date-style="short"/>
                            </p>
                        </div>

                        <p class="text-xl font-light">{{ filmData.description }}</p>
                    </div>

                    <div v-if="filmData.people">
                        <div class="flex justify-between items-center">
                            <h1 class="font-bold text-2xl">Люди</h1>

                            <UButton
                                v-if="profile?.role == UserRole.Admin || (filmData.author_id && filmData.author_id == profile?.id)"
                                color="gray"
                                label="Редактировать"
                                icon="i-heroicons-pencil-solid"
                                @click="peopleEditSwitch"/>
                        </div>

                        <FilmPeopleEdit v-if="peopleEdit"
                                        class="mt-2.5"
                                        :film-id="filmData.id"/>

                        <div v-else-if="filmData.people.length > 0" class="flex flex-wrap gap-5 mt-5">
                            <div v-for="person in filmData.people.slice(0, peopleDetails ? filmData.people?.length : 6)"
                                 class="flex items-center gap-2.5 w-[250px]"
                                 :key="person.id">
                                <div v-if="person.person?.photo"
                                     :style="`background-image: url(${fileUrl(person.person?.photo)})`"
                                     class="block rounded-md w-[80px] h-[80px] shrink-0 bg-cover bg-center"/>

                                <div v-else>
                                    <UIcon name="i-heroicons-user-circle" class="text-7xl"/>
                                </div>

                                <div class="font-roboto">
                                    <p class="font-light italic leading-3">{{ personRole(person.role) }}</p>
                                    <p class="text-2xl font-black line-clamp-2 leading-6 mt-0.5">{{
                                            person.person?.name
                                        }}</p>
                                    <p class="leading-4 line-clamp-1">{{ person.role_details }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="!peopleEdit && filmData.people.length > 6" class="flex justify-center mt-2.5">
                            <UButton
                                :icon="peopleDetails ? 'i-heroicons-chevron-double-up' : 'i-heroicons-chevron-double-down'"
                                color="gray"
                                size="xl"
                                :ui="{rounded: 'rounded-full'}"
                                @click="peopleDetails = !peopleDetails"/>
                        </div>

                        <p v-if="!peopleEdit && filmData.people.length == 0">Людей здесь нет.</p>
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
        </UContainer>
    </UMain>
</template>

<style scoped>
.has-dot::before {
    content: '•'; /* Символ точки */
    margin: 0 8px; /* Отступы слева и справа от точки */
    color: currentColor; /* Цвет текста */
}
</style>