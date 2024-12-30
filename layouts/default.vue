<script setup lang="ts">
const token = useCookie('token');

const nav = [{
    label: 'Каталог',
    icon : 'i-heroicons-folder-open',
    to   : '/'
}, {
    label: 'Мои фильмы',
    icon : 'i-heroicons-film',
    to   : '/my-films'
}];

const rightNav = [{
    label: 'Выход',
    icon : 'i-heroicons-arrow-right-on-rectangle-20-solid',
    click: () => {
        token.value = '';
        navigateTo('/login');
    }
}];
</script>

<template>
    <UContainer class="py-2.5 h-dvh">
        <Head>
            <title>MyFilms</title>
        </Head>

        <div class="flex flex-col gap-2.5 h-full">
            <div class="shrink-0">
                <div class="flex overflow-auto md:overflow-hidden">
                    <UHorizontalNavigation :links="nav"
                                           class="w-auto md:w-full"/>

                    <UHorizontalNavigation :links="rightNav"
                                           class="md:justify-end"/>
                </div>

                <UDivider/>
            </div>

            <slot/>
        </div>
    </UContainer>
</template>