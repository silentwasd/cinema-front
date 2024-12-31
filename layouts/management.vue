<script setup lang="ts">
const token = useCookie('token');
const color = useColorMode();

useHead({
    link: [
        {
            rel  : 'icon',
            href : '/icon/light.png',
            media: '(prefers-color-scheme: light)'
        },
        {
            rel  : 'icon',
            href : '/icon/dark.png',
            media: '(prefers-color-scheme: dark)'
        }
    ]
});

const nav = [{
    label: 'Каталог',
    icon : 'i-heroicons-folder-open-20-solid',
    to   : '/management/catalog'
}, {
    label: 'Мои фильмы',
    icon : 'i-heroicons-film-16-solid',
    to   : '/management/my-films'
}, {
    label: 'Люди',
    icon : 'i-heroicons-users-20-solid',
    to   : '/management/people'
}];

const rightNav = computed(() => [{
    icon : color.value == 'light' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid',
    click: () => {
        color.preference = color.value == 'light' ? 'dark' : 'light';
    }
}, {
    label: 'Выход',
    icon : 'i-heroicons-arrow-right-on-rectangle-20-solid',
    click: () => {
        token.value = '';
        navigateTo('/login');
    }
}]);
</script>

<template>
    <UContainer class="py-2.5 h-dvh">
        <Head>
            <title>ВКинопоиск</title>
        </Head>

        <div class="flex flex-col gap-2.5 h-full">
            <div class="shrink-0">
                <div class="flex overflow-auto md:overflow-hidden">
                    <UHorizontalNavigation :links="nav"
                                           class="w-auto md:w-full"/>

                    <LazyClientOnly>
                        <UHorizontalNavigation :links="rightNav"
                                               class="md:justify-end"/>
                    </LazyClientOnly>
                </div>

                <UDivider/>
            </div>

            <slot/>
        </div>
    </UContainer>
</template>