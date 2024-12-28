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
    <UContainer class="py-2.5">
        <Head>
            <title>MyFilms</title>
        </Head>

        <div class="flex flex-col gap-2.5">
            <div>
                <UHorizontalNavigation :links="nav"/>

                <UDivider/>
            </div>

            <NuxtPage/>
        </div>
    </UContainer>
</template>