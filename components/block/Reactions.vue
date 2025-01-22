<script setup lang="ts">
import type FeedbackResource from "~/resources/FeedbackResource";

const props = defineProps<{
    items: FeedbackResource[]
}>();

const total    = computed<number>(() => props.items.filter(item => item.reaction != 0).length);
const likes    = computed<number>(() => props.items.map(item => item.reaction).filter(reaction => reaction > 0).reduce((prev, cur) => prev + cur, 0));
const dislikes = computed<number>(() => Math.abs(props.items.map(item => item.reaction).filter(reaction => reaction < 0).reduce((prev, cur) => prev + cur, 0)));
</script>

<template>
    <div>
        <UMeterGroup :max="total" size="xl">
            <UMeter :value="likes" color="green" icon="i-heroicons-hand-thumb-up-16-solid" label="Понравилось"/>
            <UMeter :value="dislikes" color="red" icon="i-heroicons-hand-thumb-down-16-solid" label="Не понравилось"/>
        </UMeterGroup>
    </div>
</template>

<style scoped>

</style>