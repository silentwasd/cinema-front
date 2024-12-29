<script setup lang="ts">
const nav = [{
    label: 'Каталог',
    icon : 'i-heroicons-folder-open',
    to   : '/'
}, {
    label: 'Мои фильмы',
    icon : 'i-heroicons-film',
    to   : '/my-films'
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
    <UContainer class="py-2.5 h-dvh">
        <Head>
            <title>MyFilms</title>
        </Head>

        <div class="flex flex-col gap-2.5 h-full">
            <div class="shrink-0">
                <UHorizontalNavigation :links="nav"/>

                <UDivider/>
            </div>

            <NuxtPage/>
        </div>
    </UContainer>
</template>