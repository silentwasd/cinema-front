<script setup lang="ts">
const perPage = defineModel<number>();
</script>

<template>
    <USelectMenu class="w-full md:w-auto"
                 :options="[5, 10, 15, 25, 30]"
                 v-model="perPage">
        <template #label>
            Показать {{ perPage }} записей
        </template>
    </USelectMenu>
</template>

<style scoped>

</style>