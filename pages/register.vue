<script setup lang="ts">
import ApiClient from "~/services/ApiClient";

definePageMeta({
    layout    : 'management',
    middleware: 'auth'
});

const state = ref({
    name                 : '',
    email                : '',
    password             : '',
    password_confirmation: ''
});

const loading = ref<boolean>(false);
const token   = useToken();
const toast   = useToast();
const form    = ref();

async function submit() {
    form.value.clear();
    loading.value = true;

    try {
        const client   = new ApiClient();
        const response = await client.post<{ token: string }>('/register', state.value);
        token.value    = response.token;
        await navigateTo('catalog/films');
    } catch (err: any) {
        if (err.statusCode === 422) {
            form.value.setErrors(Object.keys(err.data.errors).map((key: string) => ({
                message: err.data.errors[key].join('. '),
                path   : key
            })));

            return;
        }

        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
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
            <UForm ref="form" :state="state" @submit="submit">
                <div class="flex flex-col gap-5 border dark:border-gray-800 p-5 rounded-md shadow-xl w-[300px]">
                    <UFormGroup label="Имя" name="name">
                        <UInput leading-icon="i-heroicons-user"
                                placeholder="Иван"
                                size="lg"
                                autocomplete="one-time-code"
                                v-model="state.name"/>
                    </UFormGroup>

                    <UFormGroup label="E-mail" name="email">
                        <UInput type="email"
                                leading-icon="i-heroicons-at-symbol"
                                placeholder="example@example.com"
                                size="lg"
                                autocomplete="one-time-code"
                                v-model="state.email"/>
                    </UFormGroup>

                    <UFormGroup label="Пароль" name="password">
                        <UInput type="password"
                                leading-icon="i-heroicons-key"
                                placeholder="••••••••"
                                size="lg"
                                autocomplete="one-time-code"
                                v-model="state.password"/>
                    </UFormGroup>

                    <UFormGroup label="Повторите пароль" name="password_confirmation">
                        <UInput type="password"
                                leading-icon="i-heroicons-key"
                                placeholder="••••••••"
                                size="lg"
                                autocomplete="one-time-code"
                                v-model="state.password_confirmation"/>
                    </UFormGroup>

                    <div class="flex flex-col gap-2.5">
                        <UButton label="Продолжить"
                                 type="submit"
                                 size="lg"
                                 class="w-full"
                                 :loading="loading"/>

                        <UButton label="Уже есть аккаунт"
                                 type="submit"
                                 size="lg"
                                 color="gray"
                                 class="w-full"
                                 to="/login"/>
                    </div>
                </div>
            </UForm>
        </UContainer>
    </UMain>
</template>

<style scoped>

</style>