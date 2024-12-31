<script setup lang="ts">
import PersonRepository from "~/repos/PersonRepository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type PersonResource from "~/resources/PersonResource";

definePageMeta({
    middleware: 'auth',
    layout    : 'management'
});

const {name, page, perPage, sort, clearFilters} = useTabler('people');

const personRepo                      = new PersonRepository();
const {data: people, status, refresh} = await personRepo.lazyList<PaginatedCollection<PersonResource>>(() => ({
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

const editRow  = ref<PersonResource>();
const removing = ref<{ [key: string]: boolean }>({});
const toast    = useToast();

function makeResource(): PersonResource {
    return {
        id   : 0,
        name : '',
        photo: null
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
            <UiTableClearFilters @clear="clearFilters"/>
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

        <template #actions-data="{row}">
            <div class="flex items-center justify-end gap-2.5">
                <UTooltip v-if="row.can_edit" text="Изменить">
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
        </template>
    </ModalEditModel>
</template>

<style scoped>

</style>