<script setup lang="ts">
import {FilmFormat} from "~/types/enums/FilmFormat";

const filmFormatOptions = [
    {label: 'Любой', value: undefined},
    {label: 'Фильм', value: FilmFormat.Film},
    {label: 'Мини-сериал', value: FilmFormat.MiniSeries},
    {label: 'Сериал', value: FilmFormat.Series}
];
</script>

<template>
    <USelectMenu :options="filmFormatOptions"
                 class="w-full md:w-auto"
                 value-attribute="value"/>
</template>

<style scoped>

</style>