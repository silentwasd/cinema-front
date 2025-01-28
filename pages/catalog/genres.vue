<script setup lang="ts">
import GenreRepository from "~/repos/management/GenreRepository";
import type GenreResource from "~/resources/management/GenreResource";
import type PaginatedCollection from "~/types/PaginatedCollection";

definePageMeta({
    middleware: 'auth',
    layout    : 'default'
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

const {name, page, perPage, sort, clearFilters} = useTabler('genres');

const genreRepo                       = new GenreRepository();
const {data: genres, refresh, status} = await genreRepo.lazyList<PaginatedCollection<GenreResource>>(() => ({
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
        key     : 'name',
        label   : 'Наименование',
        sortable: true
    },
    {
        key: 'actions'
    }
];

const editRow  = ref<GenreResource>();
const removing = ref<{ [key: string]: boolean }>({});
const toast    = useToast();

function makeResource(): GenreResource {
    return {
        id  : 0,
        name: ''
    };
}

async function remove(genre: GenreResource) {
    removing.value[genre.id] = true;

    try {
        await genreRepo.remove(genre.id);
        await refresh();
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err.message,
            color      : 'red'
        });
    } finally {
        removing.value[genre.id] = false;
    }
}

async function save(state: any) {
    if (state.id > 0) {
        await genreRepo.update({...state});
    } else {
        await genreRepo.store(state);
    }

    await refresh();
}
</script>

<template>
    <UiManagementMain>
        <UiSelectTable :columns="columns"
                       :rows="genres?.data ?? []"
                       :page-count="genres?.meta.per_page"
                       :total="genres?.meta.total"
                       :loading="status == 'pending'"
                       class="grow h-0"
                       v-model:page="page"
                       v-model:sort="sort">
            <template #filters>
                <UiTableSearch v-model="name"/>
                <UiTablePerPage v-model="perPage"/>
                <UiTableClearFilters @clear="clearFilters"/>
            </template>

            <template #actions>
                <UButton icon="i-heroicons-plus"
                         color="gray"
                         @click="editRow = makeResource()">
                    Создать
                </UButton>
            </template>

            <template #actions-data="{row}">
                <div class="flex items-center justify-end gap-2.5">
                    <UTooltip text="Изменить">
                        <UButton color="gray"
                                 icon="i-heroicons-pencil-solid"
                                 square
                                 @click="editRow = row"/>
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

    <ModalEditModel v-model="editRow"
                    :save="save">
        <template #create-title>Новый жанр</template>
        <template #edit-title="{state}">Жанр #{{ state.id }}</template>

        <template #default="{state}">
            <UFormGroup label="Наименование" name="name" required>
                <UInput v-model="state.name" placeholder="Комедия"/>
            </UFormGroup>
        </template>
    </ModalEditModel>
</template>

<style scoped>

</style>