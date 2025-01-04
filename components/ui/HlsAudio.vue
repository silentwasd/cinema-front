<script setup lang="ts">
import Hls from "hls.js";

const props = defineProps<{
    src: string
}>();

const audioRef = ref();
const hls      = new Hls();

hls.loadSource(props.src);

onMounted(() => {
    hls.attachMedia(audioRef.value);
});
</script>

<template>
    <audio ref="audioRef"
           controls
           class="w-full"></audio>
</template>

<style scoped>

</style>