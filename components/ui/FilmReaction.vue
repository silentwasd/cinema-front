<script setup lang="ts">
import FeedbackRepository from "~/repos/FeedbackRepository";

const props = defineProps<{
    filmId: number,
    initReaction: number
}>();

const feedbackRepo = new FeedbackRepository(props.filmId);

const reaction = ref<number>(props.initReaction);
const updating = ref<boolean>(false);

async function update(to: number) {
    updating.value = true;

    try {
        await feedbackRepo.store({reaction: to, create: true});
        reaction.value = to;
    } catch {

    } finally {
        updating.value = false;
    }
}
</script>

<template>
    <div class="flex gap-2.5">
        <UTooltip text="Понравилось">
            <UButton :color="reaction == 1 ? 'green' : 'gray'"
                     :icon="reaction == 1 ? 'i-heroicons-hand-thumb-up-16-solid' : 'i-heroicons-hand-thumb-up'"
                     square
                     :loading="updating"
                     @click="update(1)"/>
        </UTooltip>

        <UTooltip text="Трудно сказать">
            <UButton :color="reaction == 0 ? 'cyan' : 'gray'"
                     icon="i-heroicons-slash-16-solid"
                     square
                     :loading="updating"
                     @click="update(0)"/>
        </UTooltip>

        <UTooltip text="Не понравилось">
            <UButton :color="reaction == -1 ? 'red' : 'gray'"
                     :icon="reaction == -1 ? 'i-heroicons-hand-thumb-down-16-solid' : 'i-heroicons-hand-thumb-down'"
                     square
                     :loading="updating"
                     @click="update(-1)"/>
        </UTooltip>
    </div>
</template>

<style scoped>

</style>