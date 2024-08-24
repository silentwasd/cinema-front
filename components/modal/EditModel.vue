<script setup lang="ts">
const props = defineProps<{
    save: (state: any) => Promise<any>
}>();

const form  = ref();
const model = defineModel<any>();

const state = ref<any>();

watch(model, () => {
    if (!model.value)
        return;

    state.value = {...model.value};
});

const saving = ref<boolean>(false);

async function save() {
    form.value.clear();

    try {
        saving.value = true;

        await props.save(state.value);

        model.value = undefined;
    } catch (err: any) {
        if (err.statusCode === 422) {
            form.value.setErrors(Object.keys(err.data.errors).map((key: string) => ({
                message: err.data.errors[key].join('. '),
                path   : key
            })));
        }
    } finally {
        saving.value = false;
    }
}

function close() {
    if (saving.value)
        return;

    model.value = undefined;
}
</script>

<template>
    <UModal :model-value="!!model" @update:model-value="close">
        <UForm ref="form" :state="state" @submit="save">
            <UCard :ui="{ring: ''}">
                <template #header>
                    <div class="flex flex-row">
                        <h3 class="font-semibold text-lg basis-full">
                            <slot v-if="state.id > 0" name="edit-title" :state="state">Модель #{{ state.id }}</slot>
                            <slot v-else name="create-title">Новая модель</slot>
                        </h3>

                        <UButton icon="i-heroicons-x-mark" color="gray" variant="link"
                                 square size="xl" :padded="false" @click="close"/>
                    </div>
                </template>

                <div class="flex flex-col gap-5">
                    <slot name="default" :state="state"/>
                </div>

                <template #footer>
                    <div class="flex items-center justify-end">
                        <UButton type="submit" :loading="saving"
                                 class="dark:bg-fuchsia-300 dark:hover:bg-fuchsia-200">
                            Сохранить
                        </UButton>

                        <UButton color="gray" class="ms-2.5"
                                 :disabled="saving" @click="close">
                            Отменить
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UForm>
    </UModal>
</template>

<style scoped>

</style>