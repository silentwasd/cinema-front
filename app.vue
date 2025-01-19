<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
    <NuxtLoadingIndicator/>
    <UNotifications/>

    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>

    <ClientOnly>
        <MetricYandex v-if="config.public.metrics"/>
    </ClientOnly>
</template>

<style scoped>

</style>