<script setup lang="ts">
import FilmRepository from "~/repos/FilmRepository";
import {FilmFormat} from "~/types/enums/FilmFormat";

const formatOptions = [
    {label: 'Фильм', value: FilmFormat.Film},
    {label: 'Мини-сериал', value: FilmFormat.MiniSeries},
    {label: 'Сериал', value: FilmFormat.Series}
];
</script>

<template>
    <TableFilms :repo="new FilmRepository()" cache-key="films">
        <template #default="{state}">
            <UFormGroup label="Наименование" name="name" required>
                <UInput v-model="state.name" placeholder="Джек который построил дом"/>
            </UFormGroup>

            <UFormGroup label="Формат" name="format" required>
                <USelectMenu v-model="state.format"
                             :options="formatOptions"
                             value-attribute="value"/>
            </UFormGroup>

            <UFormGroup label="Обложка" name="cover">
                <UInput type="file" @input="state.cover = $event.target.files[0]"/>
            </UFormGroup>

            <UFormGroup label="Дата выхода" name="release_date">
                <UInput type="date"
                        :model-value="state.release_date ? undater(state.release_date) : null"
                        @update:model-value="state.release_date = dater($event)"/>
            </UFormGroup>

            <UFormGroup label="Описание" name="description">
                <UTextarea v-model="state.description" autoresize :maxrows="10"/>
            </UFormGroup>
        </template>
    </TableFilms>
</template>

<style scoped>

</style>