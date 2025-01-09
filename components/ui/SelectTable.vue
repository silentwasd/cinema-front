<script setup lang="ts">
defineProps<{
    columns: any[],
    rows: { [key: string]: any; }[],
    pageCount?: number,
    total?: number,
    loading?: boolean
}>();

const selected = defineModel<any[]>();

const page = defineModel<number>('page');

const sort = defineModel<{column: string, direction: "desc" | "asc"}>('sort');

defineEmits<{
    (e: 'select', value: any): void
}>();
</script>

<template>
    <div class="flex flex-col border rounded-md dark:border-gray-700">
        <div v-if="$slots.filters" class="flex flex-wrap gap-2.5 border-b p-2.5 dark:border-b-gray-700 shrink-0">
            <slot name="filters"></slot>
        </div>

        <div v-if="$slots.actions" class="flex gap-2.5 justify-between p-2.5 border-b dark:border-b-gray-700 shrink-0">
            <div class="flex gap-2.5 items-center">
                <slot v-if="(selected && selected.length > 0) || !selected" name="selected"></slot>
            </div>
            <div class="flex gap-2.5 items-center">
                <slot name="actions"></slot>
            </div>
        </div>

        <div class="grow overflow-auto">
            <UTable :columns="columns"
                    :rows="rows"
                    :empty-state="{icon: 'i-heroicons-circle-stack-20-solid', label: 'Нет записей'}"
                    :loading-state="{icon: 'i-heroicons-arrow-path-20-solid', label: 'Загрузка'}"
                    :loading="loading"
                    v-model="selected"
                    v-model:sort="sort"
                    sort-mode="manual"
                    class="h-full"
                    @select="$emit('select', $event)">
                <template v-for="column in columns" #[`${column.key}-data`]="{row}">
                    <slot :name="`${column.key}-data`" :row="row"></slot>
                </template>
            </UTable>
        </div>

        <div v-if="rows.length > 0" class="flex justify-between items-center border-t p-2.5 dark:border-t-gray-700 shrink-0">
            <div class="hidden md:block">
                <p v-if="total && ((selected && selected.length < 1) || !selected)" class="text-sm">Всего записей: {{ total }}</p>
                <p v-if="selected && selected.length > 0" class="text-sm">Выделено записей: {{ selected.length }}</p>
            </div>

            <div class="flex justify-center w-full md:justify-end md:w-auto">
                <UPagination v-if="page && pageCount && total"
                             v-model="page"
                             :page-count="pageCount"
                             :total="total"
                             :max="6"
                             :ui="{rounded: 'rounded-none'}"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>