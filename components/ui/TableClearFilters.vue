<script setup lang="ts">
defineProps<{
    name: string
}>();

defineEmits<{
    (e: 'clear'): void
}>();
</script>

<template>
    <UButton :disabled="name === ''"
             icon="i-heroicons-x-mark"
             color="gray"
             class="w-full md:w-auto"
             @click="$emit('clear')">
        Очистить фильтры
    </UButton>
</template>

<style scoped>

</style>