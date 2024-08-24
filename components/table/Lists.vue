<script setup lang="ts">
import type List from "~/resources/List";
import type ListRepository from "~/repos/ListRepository";

const props = defineProps<{
    cacheKey: string,
    repo: ListRepository,
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
        key  : 'films',
        label: 'Фильмы'
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

const removeRow  = ref<List>();
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

        await repo.destroyMany(selected.value.map((item: List) => item.id));

        await refresh();
    } finally {
        removing.value   = false;
        removeRows.value = false;
        selected.value   = [];
    }
}

const editRow = ref<List>();

function makeResource(): List {
    return {
        id  : 0,
        name: ''
    };
}

const selectedRow = ref<List>();
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
                <UButton icon="i-heroicons-trash"
                         color="red"
                         @click="removeRows = true">
                    Удалить
                </UButton>
            </template>

            <template #actions-data="{row}">
                <div class="flex gap-2.5 justify-end">
                    <UTooltip text="Изменить">
                        <UButton color="gray"
                                 icon="i-heroicons-pencil"
                                 square
                                 @click="editRow = row"/>
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
            <template #create-title>Новый список</template>
            <template #edit-title="{state}">Список #{{ state.id }}</template>

            <template #default="{state}">
                <slot :state="state"></slot>
            </template>
        </ModalEditModel>
    </div>
</template>

<style scoped>

</style>