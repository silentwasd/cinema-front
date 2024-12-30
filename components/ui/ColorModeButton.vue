<script setup lang="ts">
const color = useColorMode();
</script>

<template>
    <UButton :icon="color.value == 'light' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'"
             color="gray"
             size="xl"
             variant="link"
             class="[&>span]:w-8 [&>span]:h-8 md:[&>span]:h-16"
             @click="color.preference = color.value == 'light' ? 'dark' : 'light'"/>
</template>

<style scoped>

</style>