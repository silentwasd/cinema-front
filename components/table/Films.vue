<script setup lang="ts">
import type Film from "~/resources/Film";
import FilmRepository from "~/repos/FilmRepository";
import ListRepository from "~/repos/ListRepository";
import UserRepository from "~/repos/UserRepository";
import type User from "~/resources/User";
import {FilmFormat} from "~/types/enums/FilmFormat";

const props = defineProps<{
    cacheKey: string,
    repo: FilmRepository,
    hiddenColumns?: string[]
}>();

const repo = props.repo;

const name = ref('');
const page = ref<number>(1);

const sort = useStatify<{ column: string, direction: "desc" | "asc" }>(`${props.cacheKey}_sort`, () => ({
    column   : 'id',
    direction: 'desc'
}));

const perPage = useStatify<number>(`${props.cacheKey}_per_page`, () => 10);

const {data: rows, refresh, pending} = await repo.index(() => querify({
    name          : name.value,
    page          : page.value,
    per_page      : perPage.value,
    sort_column   : sort.value.column,
    sort_direction: sort.value.direction
}).toString());

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
        key  : 'ratings',
        label: 'Рейтингов'
    },
    {
        key  : 'lists',
        label: 'Списки'
    },
    {
        key  : 'actions',
        class: 'w-auto'
    }
];

if (props.hiddenColumns) {
    const hiddenColumns = props.hiddenColumns;
    columns             =
        columns.filter((column: any) => hiddenColumns.find((hidden: string) => column.key === hidden) == undefined);
}

const selectedColumns = useStatify<any[]>(`${props.cacheKey}_selected_columns`, () => [...columns]);

const selected = ref([]);

function clearFilters() {
    name.value = '';
    page.value = 1;
}

watch([name, perPage], () => page.value = 1);

const removeRow  = ref<Film>();
const removeRows = ref<boolean>(false);
const removing   = ref<boolean>(false);

async function remove() {
    if (!removeRow.value)
        return;

    try {
        removing.value = true;

        await repo.destroy(removeRow.value.id);

        await refresh();
    } finally {
        removing.value  = false;
        removeRow.value = undefined;
    }
}

async function removeMany() {
    if (selected.value.length < 1)
        return;

    try {
        removing.value = true;

        await repo.destroyMany(selected.value.map((item: Film) => item.id));

        await refresh();
    } finally {
        removing.value   = false;
        removeRows.value = false;
        selected.value   = [];
    }
}

const editRow = ref<Film>();

const listRow = ref<Film>();

const ratingRow = ref<Film>();

watch(ratingRow, () => refresh());

function makeResource(): Film {
    return {
        id    : 0,
        name  : '',
        format: FilmFormat.Film
    };
}

const selectedRow = ref<Film>();

const config = useRuntimeConfig();

const listMany = ref<boolean>(false);
</script>

<template>
    <div>
        <UiSelectTable
            :columns="columns.filter(column => selectedColumns.map(_column => _column.key).includes(column.key))"
            :rows="rows?.data ?? []"
            :page-count="rows?.meta.per_page"
            :total="rows?.meta.total"
            :loading="pending"
            v-model="selected"
            v-model:page="page"
            v-model:sort="sort"
            @select="selectedRow = $event"
            @dblclick="selectedRow ? editRow = selectedRow : ''">
            <template #filters>
                <UInput placeholder="Поиск..."
                        v-model="name"
                        icon="i-heroicons-magnifying-glass"
                        class="w-full md:max-w-80"/>

                <USelectMenu class="w-full md:w-auto"
                             :options="[5, 10, 15, 25, 30]"
                             v-model="perPage">
                    <template #label>
                        Показать {{ perPage }} записей
                    </template>
                </USelectMenu>

                <USelectMenu class="w-full md:min-w-48 md:w-auto"
                             :options="columns.slice(0, -1)"
                             v-model="selectedColumns"
                             multiple
                             by="key">
                    <template #label>
                        <span v-if="columns.length === selectedColumns.length">Все колонки</span>
                        <span v-else>Колонок: {{ selectedColumns.length }}</span>
                    </template>
                </USelectMenu>

                <UButton :disabled="name === ''"
                         icon="i-heroicons-x-mark"
                         color="gray"
                         class="w-full md:w-auto"
                         @click="clearFilters">
                    Очистить фильтры
                </UButton>
            </template>

            <template #actions>
                <UButton icon="i-heroicons-plus"
                         @click="editRow = makeResource()">
                    Создать
                </UButton>
            </template>

            <template #selected>
                <UButton icon="i-heroicons-list-bullet"
                         color="gray"
                         @click="listMany = true">
                    Изменить список
                </UButton>

                <UButton icon="i-heroicons-trash"
                         color="red"
                         @click="removeRows = true">
                    Удалить
                </UButton>
            </template>

            <template #name-data="{row}">
                <div class="flex items-center gap-2.5">
                    <div v-if="row.cover"
                         class="bg-no-repeat bg-cover bg-center rounded w-8 h-8"
                         :style="`background-image: url(${config.public.storageUrl}/${row.cover})`"></div>

                    <UIcon v-else name="i-heroicons-video-camera" class="w-8 h-8"/>

                    <p>{{ row.name.length > 80 ? row.name.slice(0, 80) + '...' : row.name }}</p>
                </div>
            </template>

            <template #format-data="{row}">
                {{ {film: 'Фильм', 'mini-series': 'Мини-сериал', series: 'Сериал'}[row.format] }}
            </template>

            <template #actions-data="{row}">
                <div class="flex gap-2.5 justify-end">
                    <UTooltip text="Изменить">
                        <UButton color="gray"
                                 icon="i-heroicons-pencil"
                                 square
                                 @click="editRow = row"/>
                    </UTooltip>

                    <UTooltip text="Изменить список">
                        <UButton color="gray"
                                 icon="i-heroicons-list-bullet"
                                 square
                                 @click="listRow = row"/>
                    </UTooltip>

                    <UTooltip text="Оценки">
                        <UButton color="gray"
                                 icon="i-heroicons-star"
                                 square
                                 @click="ratingRow = row"/>
                    </UTooltip>

                    <UTooltip text="Удалить">
                        <UButton color="red"
                                 icon="i-heroicons-trash"
                                 square
                                 @click="removeRow = row"/>
                    </UTooltip>
                </div>
            </template>
        </UiSelectTable>

        <ModalRemoveConfirm :opened="!!removeRow"
                            @confirm="remove"
                            @cancel="!removing ? removeRow = undefined : null"
                            :removing="removing"/>

        <ModalRemoveManyConfirm :opened="removeRows"
                                :removing="removing"
                                :count="selected.length"
                                @confirm="removeMany"
                                @cancel="removeRows = false"/>

        <ModalEditModel v-model="editRow"
                        :save="(state: any) => state.id > 0 ? repo.update(state).then(() => refresh()) : repo.store(state).then(() => refresh())">
            <template #create-title>Новый фильм</template>
            <template #edit-title="{state}">Фильм #{{ state.id }}</template>

            <template #default="{state}">
                <slot :state="state"></slot>
            </template>
        </ModalEditModel>

        <ModalEditModel v-model="listRow"
                        :save="(state: any) => repo.updateList(state.id, state.list_id, state.users.map((user: any) => user.id)).then(() => refresh())">
            <template #edit-title="{state}">Фильм #{{ state.id }}</template>

            <template #default="{state}">
                <UFormGroup label="Список" name="list_id">
                    <UiRepoSearchSelectId :repo="new ListRepository()"
                                          placeholder="Выберите подходящий список"
                                          v-model="state.list_id"/>
                </UFormGroup>

                <UtilUpdateWhen :watch="() => state.list_id"
                                @update="(listId: number) => repo.listUsers(listRow?.id ?? 0, listId).then(collection => state.users = collection.data)"/>

                <UFormGroup v-if="state.list_id" label="Пользователи" name="users">
                    <UiRepoSearchSelect :repo="new UserRepository()"
                                        multiple
                                        v-model="state.users">
                        <template #label>
                            {{
                                Array.isArray(state.users) && state.users.length >
                                0 ? state.users.map((user: User) => user.name)
                                    .join(', ') : 'Выберите пользователей из списка'
                            }}
                        </template>
                    </UiRepoSearchSelect>
                </UFormGroup>
            </template>
        </ModalEditModel>

        <ModalInnerState v-model="listMany"
                         :save="(state: any) => repo.updateListMany(selected.map((item: Film) => item.id), state.list_id, state.users.map((user: any) => user.id)).then(() => refresh()).then(() => selected = [])">
            <template #title>Изменить список</template>

            <template #default="{state}">
                <UFormGroup label="Список" name="list_id">
                    <UiRepoSearchSelectId :repo="new ListRepository()"
                                          placeholder="Выберите подходящий список"
                                          v-model="state.list_id"/>
                </UFormGroup>

                <UFormGroup label="Пользователи" name="users">
                    <UiRepoSearchSelect :repo="new UserRepository()"
                                        multiple
                                        v-model="state.users">
                        <template #label>
                            {{
                                Array.isArray(state.users) && state.users.length >
                                0 ? state.users.map((user: User) => user.name)
                                    .join(', ') : 'Выберите пользователей из списка'
                            }}
                        </template>
                    </UiRepoSearchSelect>
                </UFormGroup>
            </template>
        </ModalInnerState>

        <ModalRatings v-model="ratingRow"/>
    </div>
</template>

<style scoped>

</style>