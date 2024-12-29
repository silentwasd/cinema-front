<script setup lang="ts">
import FilmWatcherRepository from "~/repos/FilmWatcherRepository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type FilmWatcher from "~/resources/FilmWatcher";
import {FilmWatchStatus} from "~/types/enums/FilmWatchStatus";

const {name, page, perPage, sort, selected, clearFilters} = useTabler('film_watchers');

const filmWatcherRepo              = new FilmWatcherRepository();
const {data: filmWatchers, status} = await filmWatcherRepo.lazyList<PaginatedCollection<FilmWatcher>>(() => ({
    name          : name.value,
    page          : page.value,
    per_page      : perPage.value,
    sort_column   : sort.value.column,
    sort_direction: sort.value.direction
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
    }
];
</script>

<template>
    <div>
        <UiSelectTable :columns="columns"
                       :rows="filmWatchers?.data ?? []"
                       :page-count="filmWatchers?.meta.per_page"
                       :total="filmWatchers?.meta.total"
                       :loading="status == 'pending'"
                       v-model:page="page"
                       v-model:sort="sort"
                       v-model="selected">
            <template #filters>
                <UiTableSearch v-model="name"/>
                <UiTablePerPage v-model="perPage"/>
                <UiTableClearFilters :name="name" @clear="clearFilters"/>
            </template>

            <template #film.name-data="{row}">
                <div class="flex items-center gap-2.5">
                    <div v-if="row.film.cover"
                         class="bg-no-repeat bg-cover bg-center rounded w-8 h-8"
                         :style="`background-image: url(${fileUrl(row.film.cover)})`"></div>

                    <UIcon v-else name="i-heroicons-video-camera" class="w-8 h-8"/>

                    <p>{{ row.film.name.length > 80 ? row.film.name.slice(0, 80) + '...' : row.film.name }}</p>
                </div>
            </template>

            <template #film.format-data="{row}">
                {{ {film: 'Фильм', 'mini-series': 'Мини-сериал', series: 'Сериал'}[row.film.format] }}
            </template>

            <template #status-data="{row}">
                <UiWatcherStatus :watcher="row"/>
            </template>
        </UiSelectTable>
    </div>
</template>

<style scoped>

</style>