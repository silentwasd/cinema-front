<script setup lang="ts">
import PersonRepository from "~/repos/PersonRepository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type PersonResource from "~/resources/PersonResource";
import CountryRepository from "~/repos/management/CountryRepository";
import useMultiQuery from "~/composables/use-multi-query";
import {PersonRole} from "~/types/enums/PersonRole";

definePageMeta({
    middleware: 'auth',
    layout    : 'management'
});

const config = useRuntimeConfig();
const route  = useRoute();

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

const role      = ref<PersonRole | undefined>(route.query.role ? (route.query.role as PersonRole) : undefined);
const countries = useMultiQuery('countries');

const {name, page, perPage, sort, clearFilters} = useTabler('people', () => ({
    role     : role.value,
    countries: countries.value
}), () => {
    role.value      = undefined;
    countries.value = [];
});

const personRepo                      = new PersonRepository();
const {data: people, status, refresh} = await personRepo.lazyList<PaginatedCollection<PersonResource>>(() => ({
    name          : name.value,
    page          : page.value,
    per_page      : perPage.value,
    countries     : countries.value,
    sort_column   : sort.value.column,
    sort_direction: sort.value.direction,
    ...role.value ? {role: role.value} : {}
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
        key  : 'country.name',
        label: 'Страна'
    },
    {
        key     : 'films_count',
        label   : 'Фильмы',
        sortable: true
    },
    {
        key  : 'roles',
        label: 'Роли'
    },
    {
        key: 'actions'
    }
];

const editRow  = ref<PersonResource>();
const removing = ref<{ [key: string]: boolean }>({});
const toast    = useToast();

watch(editRow, value => {
    if (!value || !value.id)
        return;

    if (!editRow.value)
        return;

    editRow.value.country_id = value.country?.id ?? null;
});

function makeResource(): PersonResource {
    return {
        id        : 0,
        name      : '',
        photo     : null,
        country_id: null
    };
}

async function remove(person: PersonResource) {
    removing.value[person.id] = true;

    try {
        await personRepo.remove(person.id);
        await refresh();
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err.message,
            color      : 'red'
        });
    } finally {
        removing.value[person.id] = false;
    }
}

async function save(state: any) {
    if (state.id > 0) {
        await personRepo.update({...state, ...state.photo instanceof File ? {photo: state.photo} : {photo: null}});
    } else {
        await personRepo.store(state);
    }

    await refresh();
}
</script>

<template>
    <UiManagementMain>
        <UiSelectTable :columns="columns"
                       :rows="people?.data ?? []"
                       :page-count="people?.meta.per_page"
                       :total="people?.meta.total"
                       :loading="status == 'pending'"
                       class="grow h-0"
                       v-model:page="page"
                       v-model:sort="sort">
            <template #filters>
                <UiTableSearch v-model="name"/>
                <UiTablePerPage v-model="perPage"/>
                <UiTablePersonRole placeholder="Фильтр по роли"
                                   v-model="role"/>
                <UiTableClearFilters @clear="clearFilters"/>
            </template>

            <template #selected>
                <UiRepoSearchSelectId :repo="new CountryRepository()"
                                      placeholder="Фильтр по странам"
                                      multiple
                                      v-model="countries"/>
            </template>

            <template #actions>
                <UButton icon="i-heroicons-plus"
                         color="gray"
                         @click="editRow = makeResource()">
                    Создать
                </UButton>
            </template>

            <template #name-data="{row}">
                <div class="flex items-center gap-2.5">
                    <div v-if="row.photo"
                         class="bg-no-repeat bg-cover bg-center rounded w-8 h-8"
                         :style="`background-image: url(${fileUrl(row.photo)})`"></div>

                    <UIcon v-else name="i-heroicons-user-circle" class="w-8 h-8"/>

                    <p>{{ row.name.length > 80 ? row.name.slice(0, 80) + '...' : row.name }}</p>
                </div>
            </template>

            <template #roles-data="{row}">
                {{
                    row.roles.map((role: PersonRole) => ({
                        [PersonRole.Director]: 'Режиссёр',
                        [PersonRole.Actor]   : 'Актёр'
                    }[role])).join(', ')
                }}
            </template>

            <template #actions-data="{row}">
                <div v-if="row.can_edit" class="flex items-center justify-end gap-2.5">
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
                    :readonly="!(editRow?.can_edit ?? true)"
                    :save="save">
        <template #create-title>Новый человек</template>
        <template #edit-title="{state}">Человек #{{ state.id }}</template>

        <template #default="{state}">
            <UFormGroup label="Наименование" name="name" required>
                <UInput v-model="state.name" placeholder="Стэнли Кубрик"/>
            </UFormGroup>

            <UFormGroup label="Фото" name="photo">
                <UInput type="file" @input="state.photo = $event.target.files[0]"/>
            </UFormGroup>

            <UFormGroup label="Страна" name="country_id">
                <UiRepoSearchSelectId :repo="new CountryRepository()"
                                      placeholder="Выберите страну из списка"
                                      v-model="state.country_id">
                </UiRepoSearchSelectId>
            </UFormGroup>
        </template>
    </ModalEditModel>
</template>

<style scoped>

</style>