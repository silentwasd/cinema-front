<script setup lang="ts">
const reactionOptions = [
    {label: 'Любой', value: undefined},
    {label: 'Понравилось', value: 1},
    {label: 'Трудно сказать', value: 0},
    {label: 'Не понравилось', value: -1}
];

const model = defineModel<number | undefined>({default: () => undefined});
</script>

<template>
    <USelectMenu :options="reactionOptions"
                 :placeholder="model === undefined ? 'Ваша реакция' : undefined"
                 class="w-full md:w-auto"
                 value-attribute="value"
                 v-model="model">
        <template v-if="model !== undefined" #label>
            {{ reactionOptions.find(option => option.value === model)?.label }}
        </template>
    </USelectMenu>
</template>

<style scoped>

</style>