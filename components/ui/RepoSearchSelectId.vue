<script setup lang="ts">
import type SearchableRepository from "~/types/repos/SearchableRepository";

const props = defineProps<{
    repo: SearchableRepository,
    placeholder?: string,
    searchablePlaceholder?: string
}>();

const model = defineModel<string | number | boolean | Record<string, any> | unknown[] | undefined>();

const loading = ref<boolean>(false);

const options = ref<any>([]);

async function search(query: string) {
    loading.value = true;

    const formats = await props.repo.search(query);

    loading.value = false;

    const data = formats.data;

    options.value = data;

    return data;
}
</script>

<template>
    <USelectMenu v-model="model"
                 :loading="loading"
                 :searchable="search"
                 :searchable-placeholder="searchablePlaceholder ?? 'Поиск...'"
                 :placeholder="placeholder"
                 option-attribute="name"
                 value-attribute="id"
                 trailing>
        <template #option="{option}">
            <slot :option="option"></slot>
        </template>

        <template #label>
            <slot name="label" :options="options">{{ options.find((option: any) => option.id === model)?.name ?? placeholder }}</slot>
        </template>
    </USelectMenu>
</template>

<style scoped>

</style>