<script setup lang="ts">
defineEmits<{
    (e: 'clear'): void
}>();
</script>

<template>
    <UButton icon="i-heroicons-x-mark"
             color="gray"
             class="w-full md:w-auto"
             @click="$emit('clear')">
        Очистить фильтры
    </UButton>
</template>

<style scoped>

</style>