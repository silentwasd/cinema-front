<script setup lang="ts">
import FilmWatcherRepository from "~/repos/FilmWatcherRepository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type FilmWatcher from "~/resources/FilmWatcher";
import {FilmWatchStatus} from "~/types/enums/FilmWatchStatus";
import type Film from "~/resources/Film";

definePageMeta({
    middleware: 'auth',
    layout    : 'management'
});

const route = useRoute();

const watchStatus = ref<FilmWatchStatus | undefined>(route.query.status ? (route.query.status as FilmWatchStatus) : undefined);

const {name, page, perPage, sort, clearFilters} = useTabler('film_watchers', () => ({
    status: watchStatus.value
}), () => {
    watchStatus.value = undefined;
});

const filmWatcherRepo                       = new FilmWatcherRepository();
const {data: filmWatchers, status, refresh} = await filmWatcherRepo.lazyList<PaginatedCollection<FilmWatcher>>(() => ({
    name          : name.value,
    page          : page.value,
    per_page      : perPage.value,
    sort_column   : sort.value.column,
    sort_direction: sort.value.direction,
    ...watchStatus.value ? {watch_status: watchStatus.value} : {}
}));

const columns = [
    {
        key     : 'id',
        label   : '#',
        sortable: true
    },
    {
        key     : 'film.name',
        label   : 'Наименование',
        sortable: true
    },
    {
        key     : 'film.format',
        label   : 'Формат',
        sortable: true
    },
    {
        key     : 'film.release_date',
        label   : 'Дата выхода',
        sortable: true
    },
    {
        key  : 'status',
        label: 'Статус просмотра'
    },
    {
        key: 'actions'
    }
];

const ratingRow = ref<Film>();
const removing  = ref<{ [key: string]: boolean }>({});
const toast     = useToast();

async function remove(watcher: FilmWatcher) {
    removing.value[watcher.id] = true;

    try {
        await filmWatcherRepo.remove(watcher.id);
        await refresh();
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err.message,
            color      : 'red'
        });
    } finally {
        removing.value[watcher.id] = false;
    }
}
</script>

<template>
    <UiManagementMain>
        <UiSelectTable :columns="columns"
                       :rows="filmWatchers?.data ?? []"
                       :page-count="filmWatchers?.meta.per_page"
                       :total="filmWatchers?.meta.total"
                       :loading="status == 'pending'"
                       class="grow h-0"
                       v-model:page="page"
                       v-model:sort="sort">
            <template #filters>
                <UiTableSearch v-model="name"/>
                <UiTablePerPage v-model="perPage"/>
                <UiTableWatcherStatus placeholder="Статус просмотра"
                                      v-model="watchStatus"/>
                <UiTableClearFilters @clear="clearFilters"/>
            </template>

            <template #film.name-data="{row}">
                <NuxtLink class="flex items-center gap-2.5 hover:underline underline-offset-2"
                          :to="`/catalog/films/${row.film.id}`">
                    <div v-if="row.film.cover"
                         class="bg-no-repeat bg-cover bg-center rounded w-8 h-8"
                         :style="`background-image: url(${fileUrl(row.film.cover)})`"></div>

                    <UIcon v-else name="i-heroicons-film" class="w-8 h-8"/>

                    <div>
                        <p class="font-semibold leading-4">
                            {{ row.film.name.length > 40 ? row.film.name.slice(0, 40) + '...' : row.film.name }}
                        </p>

                        <p v-if="row.film.people.length > 0" class="text-xs">
                            <UiPeopleShortText :people="row.film.people"/>
                        </p>
                    </div>
                </NuxtLink>
            </template>

            <template #film.format-data="{row}">
                {{ {film: 'Фильм', 'mini-series': 'Мини-сериал', series: 'Сериал'}[row.film.format] }}
            </template>

            <template #status-data="{row}">
                <UiWatcherStatusUpdate :watcher="row"/>
            </template>

            <template #actions-data="{row}">
                <div class="flex items-center justify-end gap-2.5">
                    <UTooltip v-if="row.film.can_watch" text="Смотреть">
                        <UButton color="gray"
                                 icon="i-heroicons-play-solid"
                                 square
                                 :to="`/cinema/${row.film.id}`"/>
                    </UTooltip>

                    <UTooltip text="Оценки">
                        <UButton color="gray"
                                 :icon="row.film.has_rating ? `i-heroicons-star-solid` : `i-heroicons-star`"
                                 @click="ratingRow = row.film"/>
                    </UTooltip>

                    <UTooltip text="Удалить">
                        <UButton color="gray"
                                 icon="i-heroicons-trash-solid"
                                 :loading="removing[row.id] ?? false"
                                 @click="remove(row)"/>
                    </UTooltip>
                </div>
            </template>
        </UiSelectTable>
    </UiManagementMain>

    <ModalRatings v-model="ratingRow" @updated="refresh"/>
</template>

<style scoped>

</style>