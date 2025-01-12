<script setup lang="ts">
import Hls from "hls.js";
import FilmVideoVariantRepository from "~/repos/production/FilmVideoVariantRepository";
import {FilmVideoVariantStatus} from "~/types/enums/FilmVideoVariantStatus";

const props = defineProps<{
    id: number
}>();

const config = useRuntimeConfig();
const token  = useCookie<string>('token');

const hls = new Hls({
    xhrSetup(xhr, url) {
        xhr.setRequestHeader('Authorization', `Bearer ${token.value}`);
    }
});

const videoRepo       = new FilmVideoVariantRepository(props.id);
const videoRef        = ref();
const levelSwitching  = ref<boolean>(false);
const selectedLevel   = ref<number>(-1);
const audioTracksList = ref<any[]>([]);
const selectedAudio   = ref<number>();

const {data: videos} = await videoRepo.list(`film.${props.id}.videos`);
const sortedVideos   = computed(() => [
    {index: -1, name: 'Auto'},
    ...videos.value?.data.filter(video => video.status == FilmVideoVariantStatus.Completed)
        .toSorted((a, b) => a.height - b.height).map((video, index) => ({
            index,
            name  : video.name,
            height: video.height
        })).toSorted((a, b) => b.height - a.height) ?? []
]);

hls.on(Hls.Events.LEVEL_SWITCHING, (e, data) => {
    levelSwitching.value = true;
    selectedLevel.value  = data.level;
});

hls.on(Hls.Events.LEVEL_SWITCHED, (e, data) => {
    levelSwitching.value = false;
});

hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (e, data) => {
    audioTracksList.value = data.audioTracks;
});

hls.on(Hls.Events.AUDIO_TRACK_LOADED, (e, data) => {
    selectedAudio.value = data.id;
});

watch(selectedAudio, audio => {
    hls.audioTrack = audio ?? 0;
});

hls.loadSource(config.public.apiUrl + '/production/films/' + props.id + '/watch');

onMounted(() => {
    hls.attachMedia(videoRef.value);
});
</script>

<template>
    <div>
        <video ref="videoRef"
               controls
               playsinline
               class="w-full aspect-[16/9] bg-black"></video>

        <div class="grid grid-cols-2 gap-2.5 mt-2.5">
            <UFormGroup label="Видео">
                <USelectMenu :loading="levelSwitching"
                             :options="sortedVideos"
                             option-attribute="name"
                             value-attribute="index"
                             :model-value="selectedLevel"
                             @update:model-value="selectedLevel = $event; hls.currentLevel = selectedLevel"/>
            </UFormGroup>

            <UFormGroup label="Аудио">
                <USelectMenu :options="audioTracksList"
                             option-attribute="name"
                             value-attribute="id"
                             v-model="selectedAudio">
                    <template #option="{option}">
                        {{ option.name + ` (${option.lang})` }}
                    </template>
                </USelectMenu>
            </UFormGroup>
        </div>
    </div>
</template>

<style scoped>

</style>