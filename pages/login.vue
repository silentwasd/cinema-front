<script setup lang="ts">
import ApiClient from "~/services/ApiClient";

definePageMeta({
    layout    : 'auth',
    middleware: 'auth'
});

const state = ref({
    email   : '',
    password: ''
});

const loading = ref<boolean>(false);
const token   = useCookie<string>('token');
const toast   = useToast();

async function submit() {
    loading.value = true;

    try {
        const client   = new ApiClient();
        const response = await client.post<{ token: string }>('/login', {
            email   : state.value.email,
            password: state.value.password
        });
        token.value    = response.token;
        await navigateTo('/management/catalog');
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
    <UForm :state="state" @submit="submit">
        <Head>
            <title>Вход</title>
        </Head>

        <div class="flex flex-col gap-5 border-2 border-primary p-5 rounded-xl shadow-xl w-[300px]">
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

            <div class="flex justify-center">
                <UButton label="Войти" type="submit" size="lg" :loading="loading"/>
            </div>
        </div>
    </UForm>
</template>

<style scoped>

</style>