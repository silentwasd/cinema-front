<script setup lang="ts">
import {FilmWatchStatus} from "~/types/enums/FilmWatchStatus";

const watchStatusOptions = [
    {label: 'Любой', value: undefined},
    {label: 'Можно посмотреть', value: FilmWatchStatus.ToWatch},
    {label: 'Нужно досмотреть', value: FilmWatchStatus.MustFinish},
    {label: 'Просмотрено', value: FilmWatchStatus.Watched},
    {label: 'Пропущено', value: FilmWatchStatus.Dropped},
];
</script>

<template>
    <USelectMenu :options="watchStatusOptions"
                 value-attribute="value"/>
</template>

<style scoped>

</style>