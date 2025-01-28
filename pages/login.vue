<script setup lang="ts">
import ApiClient from "~/services/ApiClient";

definePageMeta({
    layout    : 'default',
    middleware: 'auth'
});

const config = useRuntimeConfig();

useSeoMeta({
    title        : 'Войти в КиноЛюмикс',
    description  : 'Сохрани каждый момент. Отслеживай просмотр и ставь собственные оценки.',
    ogTitle      : 'Войти КиноЛюмикс',
    ogDescription: 'Сохрани каждый момент. Отслеживай просмотр и ставь собственные оценки.',
    ogImage      : config.public.externalUrl + '/img/cinema.png',
    ogUrl        : config.public.externalUrl,
    ogType       : 'website',
    ogLocale     : 'ru_RU',
    ogSiteName   : 'КиноЛюмикс'
});

const state = ref({
    email   : '',
    password: ''
});

const loading    = ref<boolean>(false);
const token      = useToken();
const toast      = useToast();
const afterLogin = useCookie<string>('after_login');

async function submit() {
    loading.value = true;

    try {
        const client   = new ApiClient();
        const response = await client.post<{ token: string }>('/login', {
            email   : state.value.email,
            password: state.value.password
        });
        token.value    = response.token;
        await navigateTo(afterLogin.value ? afterLogin.value : '/catalog/films');
        afterLogin.value = '';
    } catch (e: any) {
        toast.add({
            title      : 'Ошибка',
            description: e?.data?.message || e?.message,
            color      : 'red'
        });
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <UMain>
        <UContainer class="flex justify-center pt-5 lg:pt-10">
            <UForm :state="state" @submit="submit">
                <div class="flex flex-col gap-5 border dark:border-gray-800 p-5 rounded-md shadow-xl w-[300px]">
                    <UFormGroup label="E-mail">
                        <UInput type="email"
                                leading-icon="i-heroicons-at-symbol"
                                placeholder="example@example.com"
                                size="lg"
                                v-model="state.email"/>
                    </UFormGroup>

                    <UFormGroup label="Пароль">
                        <UInput type="password"
                                leading-icon="i-heroicons-key"
                                placeholder="••••••••"
                                size="lg"
                                v-model="state.password"/>
                    </UFormGroup>

                    <div class="flex flex-col gap-2.5">
                        <UButton label="Продолжить"
                                 type="submit"
                                 size="lg"
                                 class="w-full"
                                 :loading="loading"/>

                        <UButton label="Зарегистрироваться"
                                 type="submit"
                                 size="lg"
                                 color="gray"
                                 class="w-full"
                                 to="/register"/>
                    </div>
                </div>
            </UForm>
        </UContainer>
    </UMain>
</template>

<style scoped>

</style>