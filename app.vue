<script setup lang="ts">
const nav = [{
    label: 'Фильмы',
    icon : 'i-heroicons-video-camera',
    to   : '/'
}, {
    label: 'Списки',
    icon : 'i-heroicons-list-bullet',
    to   : '/lists'
}, {
    label: 'Пользователи',
    icon : 'i-heroicons-users',
    to   : '/users'
}, {
    label: 'Рулетка',
    icon : 'i-heroicons-chart-pie',
    to   : '/reel'
}];
</script>

<template>
    <div class="container mx-auto py-10">
        <Head>
            <title>MyFilms</title>
        </Head>

        <div class="flex flex-col gap-2.5">
            <UHorizontalNavigation :links="nav"/>

            <NuxtPage/>
        </div>
    </div>
</template>