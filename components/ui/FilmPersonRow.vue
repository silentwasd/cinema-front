<script setup lang="ts">
import PersonRepository from "~/repos/PersonRepository";
import {PersonRole} from "~/types/enums/PersonRole";
import FilmPersonRepository from "~/repos/FilmPersonRepository";
import type FilmPersonResource from "~/resources/FilmPersonResource";

const props = defineProps<{
    person: FilmPersonResource,
    filmId: number
}>();

const emit = defineEmits<{
    (e: 'removed'): void
}>();

const filmPersonRepo = new FilmPersonRepository(props.filmId);
const toast          = useToast();
const loading        = ref<boolean>(false);

watch(() => [props.person.person_id, props.person.role, props.person.role_details], async () => {
    if (loading.value)
        return;

    loading.value = true;

    try {
        await filmPersonRepo.update(props.person);
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    } finally {
        loading.value = false;
    }
});

async function remove() {
    loading.value = true;

    try {
        await filmPersonRepo.remove(props.person.id);
        emit('removed');
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <tr>
        <td class="w-1/3">
            <UiRepoSearchSelectId :repo="new PersonRepository()"
                                  placeholder="Выберите человека из списка"
                                  v-model="person.person_id"
                                  disabled/>
        </td>

        <td class="w-1/3">
            <USelectMenu :options="Object.values(PersonRole)"
                         placeholder="Выберите роль из списка"
                         v-model="person.role">
                <template #option="{option}">
                    {{ personRole(option) }}
                </template>

                <template v-if="person.role" #label>
                    {{ personRole(person.role) }}
                </template>
            </USelectMenu>
        </td>

        <td class="w-1/3">
            <UInput placeholder="Доп. информация"
                    v-model="person.role_details"/>
        </td>

        <td>
            <UButton icon="i-heroicons-trash-solid"
                     :loading="loading"
                     color="gray"
                     @click="remove"/>
        </td>
    </tr>
</template>

<style scoped>

</style>