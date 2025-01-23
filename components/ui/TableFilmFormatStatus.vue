<script setup lang="ts">
import {FilmFormat} from "~/types/enums/FilmFormat";

const filmFormatOptions = [
    {label: 'Любой', value: undefined},
    ...Object.keys(FilmFormat).map(key => ({label: filmFormat(FilmFormat[key]), value: FilmFormat[key]}))
];
</script>

<template>
    <USelectMenu :options="filmFormatOptions"
                 value-attribute="value"/>
</template>

<style scoped>

</style>