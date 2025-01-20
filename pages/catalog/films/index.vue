<script setup lang="ts">
import type Film from "~/resources/Film";
import {FilmFormat} from "~/types/enums/FilmFormat";
import {FilmWatchStatus} from "~/types/enums/FilmWatchStatus";
import FilmWatcherRepository from "~/repos/FilmWatcherRepository";
import FilmRepository from "~/repos/FilmRepository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type FilmPersonResource from "~/resources/FilmPersonResource";
import {PersonRole} from "~/types/enums/PersonRole";
import PersonRepository from "~/repos/PersonRepository";

definePageMeta({
    middleware: 'auth',
    layout    : 'management'
});

const route  = useRoute();
const config = useRuntimeConfig();

useSeoMeta({
    title        : 'ВКинопоиск',
    description  : 'Сохрани каждый момент. Отслеживай просмотр и ставь собственные оценки.',
    ogTitle      : 'ВКинопоиск',
    ogDescription: 'Сохрани каждый момент. Отслеживай просмотр и ставь собственные оценки.',
    ogImage      : config.public.externalUrl + '/img/cinema.png',
    ogUrl        : config.public.externalUrl,
    ogType       : 'website',
    ogLocale     : 'ru_RU',
    ogSiteName   : 'ВКинопоиск'
});

const repo = new FilmRepository();

const format    = ref<FilmFormat | undefined>(route.query.format ? (route.query.format as FilmFormat) : undefined);
const directors = ref<number[]>((((Array.isArray(route.query['directors[]']) ? route.query['directors[]'] : (route.query['directors[]'] ? [route.query['directors[]']] : [])) as string[]) ?? []).map(item => parseInt(item)));
const actors    = ref<number[]>((((Array.isArray(route.query['actors[]']) ? route.query['actors[]'] : (route.query['actors[]'] ? [route.query['actors[]']] : [])) as string[]) ?? []).map(item => parseInt(item)));

const {name, page, perPage, sort, clearFilters} = useTabler('films', () => ({
    format   : format.value,
    directors: directors.value,
    actors   : actors.value
}), () => {
    format.value    = undefined;
    directors.value = [];
    actors.value    = [];
});

const {data: rows, refresh, status} = await repo.lazyList<PaginatedCollection<Film>>(() => ({
    name          : name.value,
    page          : page.value,
    per_page      : perPage.value,
    format        : format.value,
    directors     : directors.value,
    actors        : actors.value,
    sort_column   : sort.value.column,
    sort_direction: sort.value.direction
}));

let columns = [
    {
        key     : 'id',
        label   : '#',
        sortable: true
    },
    {
        key     : 'name',
        label   : 'Наименование',
        sortable: true,
    },
    {
        key     : 'format',
        label   : 'Формат',
        sortable: true
    },
    {
        key     : 'release_date',
        label   : 'Дата выхода',
        sortable: true
    },
    {
        key  : 'directors',
        label: 'Режиссёры'
    },
    {
        key  : 'actors',
        label: 'Актёры'
    },
    {
        key  : 'actions',
        class: 'w-auto'
    }
];

const removeRow = ref<Film>();
const removing  = ref<boolean>(false);

async function remove() {
    if (!removeRow.value)
        return;

    try {
        removing.value = true;

        await repo.remove(removeRow.value.id);

        await refresh();
    } finally {
        removing.value  = false;
        removeRow.value = undefined;
    }
}

const editRow = ref<Film>();

const addRow = ref<Film>();

const ratingRow = ref<Film>();

watch(ratingRow, () => refresh());

function makeResource(): Film {
    return {
        id    : 0,
        name  : '',
        format: FilmFormat.Film
    };
}

const watchStatusOptions = [
    {label: 'Можно посмотреть', value: FilmWatchStatus.ToWatch},
    {label: 'Нужно досмотреть', value: FilmWatchStatus.MustFinish},
    {label: 'Просмотрено', value: FilmWatchStatus.Watched},
    {label: 'Пропущено', value: FilmWatchStatus.Dropped},
];

const formatOptions = [
    {label: 'Фильм', value: FilmFormat.Film},
    {label: 'Мини-сериал', value: FilmFormat.MiniSeries},
    {label: 'Сериал', value: FilmFormat.Series}
];

const filmWatcherRepo = new FilmWatcherRepository();
</script>

<template>
    <UiManagementMain>
        <UiSelectTable :columns="columns"
                       :rows="rows?.data ?? []"
                       :page-count="rows?.meta.per_page"
                       :total="rows?.meta.total"
                       :loading="status == 'pending'"
                       class="grow h-0"
                       v-model:page="page"
                       v-model:sort="sort">
            <template #filters>
                <UiTableSearch v-model="name"/>
                <UiTablePerPage v-model="perPage"/>
                <UiTableClearFilters @clear="clearFilters"/>
            </template>

            <template #selected>
                <UiRepoSearchSelectId :repo="new PersonRepository(PersonRole.Director)"
                                      placeholder="Фильтр по режиссёрам"
                                      multiple
                                      v-model="directors"/>

                <UiRepoSearchSelectId :repo="new PersonRepository(PersonRole.Actor)"
                                      placeholder="Фильтр по актёрам"
                                      multiple
                                      v-model="actors"/>

                <UiTableFilmFormatStatus placeholder="Формат фильма" v-model="format"/>
            </template>

            <template #actions>
                <UButton icon="i-heroicons-plus"
                         color="gray"
                         @click="editRow = makeResource()">
                    Создать
                </UButton>
            </template>

            <template #name-data="{row}">
                <NuxtLink class="flex items-center gap-2.5 hover:underline"
                          :to="`/catalog/films/${row.id}`">
                    <div v-if="row.cover"
                         class="bg-no-repeat bg-cover bg-center rounded w-8 h-8"
                         :style="`background-image: url(${config.public.storageUrl}/${row.cover})`"></div>

                    <UIcon v-else name="i-heroicons-film" class="w-8 h-8"/>

                    <p>{{ row.name.length > 40 ? row.name.slice(0, 40) + '...' : row.name }}</p>
                </NuxtLink>
            </template>

            <template #format-data="{row}">
                {{ {film: 'Фильм', 'mini-series': 'Мини-сериал', series: 'Сериал'}[row.format] }}
            </template>

            <template #release_date-data="{row}">
                <NuxtTime :datetime="row.release_date" date-style="short"/>
            </template>

            <template #directors-data="{row}">
                <div>
                    <div
                        v-for="item in row.people.filter((item: FilmPersonResource) => item.role == PersonRole.Director).slice(0, 2)"
                        :key="item.id">
                        <p class="leading-4">{{ item.person.name }}</p>
                    </div>
                </div>
            </template>

            <template #actors-data="{row}">
                <div>
                    <div
                        v-for="item in row.people.filter((item: FilmPersonResource) => item.role == PersonRole.Actor).slice(0, 2)"
                        :key="item.id">
                        <p class="leading-4">{{ item.person.name }}</p>
                    </div>
                </div>
            </template>

            <template #actions-data="{row}">
                <div class="flex gap-2.5 justify-end">
                    <UTooltip v-if="row.can_watch" text="Смотреть">
                        <UButton color="gray"
                                 icon="i-heroicons-play-solid"
                                 square
                                 :to="`/cinema/${row.id}`"/>
                    </UTooltip>

                    <UTooltip v-if="row.can_edit" text="Изменить">
                        <UButton color="gray"
                                 icon="i-heroicons-pencil-solid"
                                 square
                                 @click="editRow = {...row, cover: null}"/>
                    </UTooltip>

                    <UTooltip v-if="!row.is_mine"
                              text="В мои фильмы">
                        <UButton color="gray"
                                 icon="i-heroicons-arrow-right"
                                 square
                                 @click="addRow = row"/>
                    </UTooltip>

                    <UTooltip v-else
                              text="Мой фильм">
                        <UButton color="gray"
                                 disabled
                                 icon="i-heroicons-check-circle-16-solid"
                                 square/>
                    </UTooltip>

                    <UTooltip v-if="row.can_edit" text="Удалить">
                        <UButton color="gray"
                                 icon="i-heroicons-trash-solid"
                                 square
                                 @click="removeRow = row"/>
                    </UTooltip>
                </div>
            </template>
        </UiSelectTable>
    </UiManagementMain>

    <ModalRemoveConfirm :opened="!!removeRow"
                        @confirm="remove"
                        @cancel="!removing ? removeRow = undefined : null"
                        :removing="removing"/>

    <ModalEditModel v-model="editRow"
                    :readonly="!(editRow?.can_edit ?? true)"
                    :save="(state: any) => state.id > 0 ? repo.update(state).then(() => refresh()) : repo.store(state).then(() => refresh())">
        <template #create-title>Новый фильм</template>
        <template #edit-title="{state}">Фильм #{{ state.id }}</template>

        <template #default="{state}">
            <UFormGroup label="Наименование" name="name" required>
                <UInput v-model="state.name" placeholder="Джек который построил дом"/>
            </UFormGroup>

            <UFormGroup label="Формат" name="format" required>
                <USelectMenu v-model="state.format"
                             :options="formatOptions"
                             value-attribute="value"/>
            </UFormGroup>

            <UFormGroup label="Обложка" name="cover">
                <UInput type="file" @input="state.cover = $event.target.files[0]"/>
            </UFormGroup>

            <UFormGroup label="Дата выхода" name="release_date">
                <UInput type="date"
                        :model-value="state.release_date ? undater(state.release_date) : null"
                        @update:model-value="state.release_date = dater($event)"/>
            </UFormGroup>

            <UFormGroup label="Описание" name="description">
                <UTextarea v-model="state.description" autoresize :maxrows="10"/>
            </UFormGroup>
        </template>
    </ModalEditModel>

    <ModalEditModel v-model="addRow"
                    :save="(state: any) => filmWatcherRepo.store({film_id: addRow.id, status: state.status}).then(() => refresh())">
        <template #edit-title="{state}">Фильм #{{ state.id }}</template>

        <template #default="{state}">
            <UFormGroup label="Статус просмотра" name="status">
                <USelectMenu :options="watchStatusOptions"
                             value-attribute="value"
                             placeholder="Выберите статус из списка"
                             v-model="state.status"/>
            </UFormGroup>
        </template>
    </ModalEditModel>
</template>

<style scoped>

</style>