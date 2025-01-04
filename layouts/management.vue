<script setup lang="ts">
import ProfileRepository from "~/repos/management/ProfileRepository";
import {UserRole} from "~/types/enums/UserRole";

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

const profileRepo     = new ProfileRepository();
const {data: profile} = await profileRepo.show(`profile`);

const nav = computed(() => [{
    label: 'Каталог',
    icon : 'i-heroicons-folder-open-20-solid',
    to   : '/management/films'
}, {
    label: 'Мои фильмы',
    icon : 'i-heroicons-film-16-solid',
    to   : '/management/my-films'
}, {
    label: 'Люди',
    icon : 'i-heroicons-users-20-solid',
    to   : '/management/people'
}, {
    label  : 'Кинотеатр',
    icon   : 'i-heroicons-light-bulb-solid',
    to     : '/management/cinema',
    visible: profile.value?.data.role == UserRole.Admin
}].filter(item => !item.hasOwnProperty('visible') || item.visible));

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