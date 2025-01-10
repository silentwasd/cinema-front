<script setup lang="ts">

</script>

<template>
    <UMain style="height: calc(100vh - var(--header-height));">
        <UContainer class="flex flex-col py-2.5 h-full">
            <slot/>
        </UContainer>
    </UMain>
</template>

<style scoped>

</style>