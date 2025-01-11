<script setup lang="ts">
import {FilmWatchStatus} from "~/types/enums/FilmWatchStatus";
import type FilmWatcher from "~/resources/FilmWatcher";
import FilmWatcherRepository from "~/repos/FilmWatcherRepository";

const props = defineProps<{
    watcher: FilmWatcher
}>();

const watchStatusOptions = [
    {label: 'Можно посмотреть', value: FilmWatchStatus.ToWatch},
    {label: 'Нужно досмотреть', value: FilmWatchStatus.MustFinish},
    {label: 'Просмотрено', value: FilmWatchStatus.Watched},
    {label: 'Пропущено', value: FilmWatchStatus.Dropped},
];

const updating        = ref<boolean>(false);
const toast           = useToast();
const filmWatcherRepo = new FilmWatcherRepository();

async function update() {
    updating.value = true;

    try {
        await filmWatcherRepo.update(props.watcher);
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err.message,
            color      : 'red'
        });
    } finally {
        updating.value = false;
    }
}
</script>

<template>
    <USelectMenu :options="watchStatusOptions"
                 value-attribute="value"
                 :loading="updating"
                 :disabled="updating"
                 v-model="watcher.status"
                 @update:model-value="update"/>
</template>

<style scoped>

</style>