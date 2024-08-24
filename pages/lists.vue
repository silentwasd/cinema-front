<script setup lang="ts">
import ListRepository from "~/repos/ListRepository";
</script>

<template>
    <TableLists :repo="new ListRepository()" cache-key="lists">
        <template #default="{state}">
            <UFormGroup label="Наименование" name="name">
                <UInput v-model="state.name" placeholder="Просмотрено"/>
            </UFormGroup>
        </template>
    </TableLists>
</template>

<style scoped>

</style>