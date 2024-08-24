<script setup lang="ts">
import UserRepository from "~/repos/UserRepository";
</script>

<template>
    <TableUsers :repo="new UserRepository()" cache-key="users">
        <template #default="{state}">
            <UFormGroup label="Наименование" name="name">
                <UInput v-model="state.name" placeholder="Саточка"/>
            </UFormGroup>
        </template>
    </TableUsers>
</template>

<style scoped>

</style>