<script setup lang="ts">
import FilmRepository from "~/repos/FilmRepository";
</script>

<template>
    <TableFilms :repo="new FilmRepository()" cache-key="films">
        <template #default="{state}">
            <UFormGroup label="Наименование" name="name">
                <UInput v-model="state.name" placeholder="Джек который построил дом"/>
            </UFormGroup>

            <UFormGroup label="Обложка" name="cover">
                <UInput type="file" @input="state.cover = $event.target.files[0]"/>
            </UFormGroup>

            <UFormGroup label="Дата выхода" name="release_Date">
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