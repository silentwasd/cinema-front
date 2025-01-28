<script setup lang="ts">
definePageMeta({
    layout: 'empty'
});

const route  = useRoute();
const filmId = parseInt(route.params.film as string);
</script>

<template>
    <div class="bg-black min-h-dvh">
        <ClientOnly>
            <UiNiceFilmPlayer :id="filmId" class="w-full h-dvh"/>
        </ClientOnly>
    </div>
</template>

<style scoped>

</style>