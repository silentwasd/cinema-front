<script setup lang="ts">
import Hls from "hls.js";

const props = defineProps<{
    src: string
}>();

const videoRef = ref();
const hls      = new Hls();

hls.loadSource(props.src);

onMounted(() => {
    hls.attachMedia(videoRef.value);
});
</script>

<template>
    <video ref="videoRef"
           controls
           class="w-full"></video>
</template>

<style scoped>

</style>