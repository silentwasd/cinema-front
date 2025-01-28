<script setup lang="ts">
import {UserRole} from "~/types/enums/UserRole";

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

const {state: profile, logout} = useProfile();

const nav = computed(() => [{
    label  : 'Каталог',
    icon   : 'i-heroicons-folder-open-20-solid',
    to     : '/catalog/films',
    visible: profile.value
}, {
    label  : 'Мои фильмы',
    icon   : 'i-heroicons-film-16-solid',
    to     : '/catalog/my-films',
    visible: profile.value
}, {
    label  : 'Производство',
    icon   : 'i-heroicons-light-bulb-solid',
    to     : '/catalog/cinema',
    visible: profile.value?.role == UserRole.Admin
}].filter(item => !item.hasOwnProperty('visible') || item.visible));
</script>

<template>
    <Head>
        <title>КиноЛюмикс</title>
    </Head>

    <div>
        <UHeader :links="nav">
            <template #logo>
                <div class="flex items-center gap-2.5">
                    <UIcon name="i-heroicons-film" class="text-3xl shrink-0"/>
                    <h1 class="grow font-roboto font-black">КиноЛюмикс</h1>
                </div>
            </template>

            <template #right>
                <UButton icon="i-heroicons-wifi-20-solid"
                         variant="link"
                         color="gray"
                         to="/speed"/>

                <UButton v-if="profile"
                         icon="i-heroicons-arrow-right-start-on-rectangle-20-solid"
                         variant="link"
                         color="gray"
                         @click="logout"/>

                <UButton v-else
                         icon="i-heroicons-arrow-right-end-on-rectangle-20-solid"
                         variant="link"
                         color="gray"
                         to="/login"/>
            </template>
        </UHeader>

        <slot/>

        <UFooter class="bg-gray-200 dark:bg-gray-800">
            <template #left>
                <p class="font-roboto text-sm">Кино в действительно хорошем качестве</p>
            </template>

            <template #right>
<!--                <UButton icon="i-simple-icons-telegram"-->
<!--                         color="gray"-->
<!--                         variant="ghost"-->
<!--                         to="https://t.me/vkinopoiskruch"-->
<!--                         target="_blank"/>-->

                <UButton icon="i-simple-icons-github"
                         color="gray"
                         variant="ghost"
                         to="https://github.com/silentwasd/cinema"
                         target="_blank"/>
            </template>
        </UFooter>
    </div>
</template>