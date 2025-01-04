<script setup lang="ts">
import Hls from "hls.js";
import FilmRepository from "~/repos/cinema/FilmRepository";

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

const filmRepo        = new FilmRepository();
const videoRef        = ref();
const videoRootRef    = ref();
const levelSwitching  = ref<boolean>(false);
const selectedLevel   = ref<number>(-1);
const audioTracksList = ref<any[]>([]);
const selectedAudio   = ref<number>();
const played          = ref<boolean>(false);
const paused          = ref<boolean>(false);
const progress        = ref<number>(0);
const volume          = ref<number>(100);
const muted           = ref<boolean>(false);
const currentDate     = ref<string>('');
const endDate         = ref<string>('');
const fullscreen      = ref<boolean>(false);

const {data: film} = await filmRepo.show(`film.${props.id}`, props.id);
const qualities    = computed(() => [
    {index: -1, name: 'Auto'},
    ...film.value?.data.video_variants?.toSorted((a, b) => a.height - b.height).map((video, index) => ({
        index,
        name  : video.name,
        height: video.height
    })).toSorted((a, b) => b.height - a.height) ?? []
]);

hls.on(Hls.Events.LEVEL_SWITCHING, (e, data) => {
    levelSwitching.value = true;
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

const controlShown = ref<boolean>(true);
let timeout: any   = null;

function resetTimeout() {
    if (timeout)
        clearTimeout(timeout);

    timeout = setTimeout(() => controlShown.value = false, 3000);
}

function makeTime(value: number) {
    let hours   = Math.floor(value / 3600).toString();
    let minutes = Math.floor(value % 3600 / 60).toString();
    let seconds = Math.floor(value % 3600 % 60).toString();

    if (parseInt(seconds) < 10)
        seconds = '0' + seconds;

    if (parseInt(minutes) < 10)
        minutes = '0' + minutes;

    if (parseInt(hours) < 10)
        hours = '0' + hours;

    return `${hours}:${minutes}:${seconds}`;
}

function toggleFullscreen() {
    if (videoRootRef.value.requestFullscreen)
        videoRootRef.value.requestFullscreen();
    else if (videoRootRef.value.webkitEnterFullScreen)
        videoRootRef.value.webkitEnterFullscreen();
}

function exitFullscreen() {
    document.exitFullscreen();
    fullscreen.value = false;
}

function setPosition(progress: number) {
    videoRef.value.currentTime = (progress / 1000) * videoRef.value.duration;
    videoRef.value.play();
}

function resume() {
    if (!played.value || (played.value && paused.value))
        videoRef.value.play();
    else
        videoRef.value.pause();
}

defineShortcuts({
    arrowright: {
        usingInput: true,
        handler   : () => {
            videoRef.value.currentTime += 5;
        }
    },

    arrowleft: {
        usingInput: true,
        handler   : () => {
            videoRef.value.currentTime -= 5;
        }
    },

    ' ': {
        usingInput: true,
        handler   : () => {
            if (!paused.value) {
                controlShown.value = true;
                resetTimeout();
            }

            resume();
        }
    }
});

hls.loadSource(config.public.apiUrl + '/cinema/films/' + props.id + '/watch');

onMounted(() => {
    hls.attachMedia(videoRef.value);

    videoRef.value.addEventListener('pause', () => paused.value = true);

    videoRef.value.addEventListener('play', () => {
        paused.value = false;
        played.value = true;
    });

    videoRef.value.addEventListener('timeupdate', () => {
        progress.value    = videoRef.value.currentTime / videoRef.value.duration;
        currentDate.value = makeTime(videoRef.value.currentTime);
    });

    videoRef.value.addEventListener('loadeddata', () => {
        currentDate.value = makeTime(videoRef.value.currentTime);
        endDate.value     = makeTime(videoRef.value.duration);
    });

    document.addEventListener('fullscreenchange', () => fullscreen.value = !!document.fullscreenElement);
});
</script>

<template>
    <div ref="videoRootRef"
         class="relative"
         :class="{'cursor-none': !controlShown}"
         @mouseenter="controlShown = true; resetTimeout()"
         @mousemove="controlShown = true; resetTimeout()">
        <div class="absolute top-0 w-full h-full z-10"
             @click.exact.prevent="resume"></div>

        <Transition>
            <div v-show="controlShown" class="absolute top-0 w-full h-full">
                <div class="absolute top-0 w-full p-5 z-10 bg-gradient-to-b from-gray-950">
                    <div class="absolute top-0 left-5 h-full flex items-center">
                        <UButton icon="i-heroicons-arrow-left-16-solid"
                                 variant="link"
                                 color="gray"
                                 size="xl"
                                 class="[&>span]:w-10 [&>span]:h-10 text-gray-400 hover:text-white dark:hover:text-white"
                                 to="/management/films"
                                 :padded="false"/>
                    </div>
                    <h1 class="font-roboto font-black text-4xl text-center text-white">{{ film?.data.name }}</h1>
                </div>

                <div class="absolute bottom-0 w-full p-5 z-10 bg-gradient-to-t from-gray-950">
                    <URange class="mb-3"
                            :ui="{ring: 'focus-visible:ring-0 focus-visible:ring-offset-0'}"
                            :model-value="progress * 1000"
                            @update:model-value="setPosition"
                            :max="1000"
                            :tabindex="-1"/>

                    <div class="flex justify-between items-center">
                        <div class="flex items-end justify-center gap-5">
                            <UButton v-show="!played || (played && paused)"
                                     icon="i-heroicons-play-solid"
                                     variant="link"
                                     :padded="false"
                                     square
                                     size="xl"
                                     class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"
                                     @click="videoRef.play()"/>

                            <UButton v-show="played && !paused"
                                     icon="i-heroicons-pause-solid"
                                     variant="link"
                                     :padded="false"
                                     square
                                     size="xl"
                                     class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"
                                     @click="videoRef.pause()"/>

                            <p class="text-white dark:text-white my-auto select-none font-semibold">
                                {{ currentDate }} / {{ endDate }}
                            </p>
                        </div>

                        <div class="flex items-end justify-center gap-2.5">
                            <UPopover mode="hover" :popper="{placement: 'top'}" class="flex items-end">
                                <UButton
                                    :icon="muted ? 'i-heroicons-speaker-x-mark-solid' : 'i-heroicons-speaker-wave-solid'"
                                    variant="link"
                                    :padded="false"
                                    square
                                    size="xl"
                                    class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"
                                    @click="muted = !muted"/>

                                <template #panel>
                                    <div class="w-40 h-full p-2.5">
                                        <URange :min="0" :max="100" orientation="vertical" v-model="volume"/>
                                    </div>
                                </template>
                            </UPopover>

                            <USelectMenu v-if="audioTracksList.length > 1"
                                         :options="audioTracksList"
                                         :popper="{placement: 'top-end'}"
                                         :ui-menu="{width: 'w-[250px]'}"
                                         option-attribute="name"
                                         value-attribute="id"
                                         v-model="selectedAudio">
                                <template #option="{option}">
                                    {{ option.name + ` (${option.lang})` }}
                                </template>

                                <UButton icon="i-heroicons-megaphone-solid"
                                         variant="link"
                                         :padded="false"
                                         square
                                         size="xl"
                                         class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"/>
                            </USelectMenu>

                            <USelectMenu :options="qualities"
                                         :popper="{placement: 'top-end'}"
                                         :ui-menu="{width: 'w-[100px]'}"
                                         option-attribute="name"
                                         value-attribute="index"
                                         :model-value="selectedLevel"
                                         @update:model-value="selectedLevel = $event; hls.currentLevel = selectedLevel">
                                <UButton icon="i-heroicons-cog-6-tooth-solid"
                                         variant="link"
                                         :padded="false"
                                         square
                                         size="xl"
                                         class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"
                                         :class="{'animate-spin': levelSwitching}"/>
                            </USelectMenu>

                            <UButton v-show="!fullscreen"
                                     icon="i-heroicons-arrows-pointing-out-solid"
                                     variant="link"
                                     :padded="false"
                                     square
                                     size="xl"
                                     class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"
                                     @click="toggleFullscreen"/>

                            <UButton v-show="fullscreen"
                                     icon="i-heroicons-arrows-pointing-in-solid"
                                     variant="link"
                                     :padded="false"
                                     square
                                     size="xl"
                                     class="text-white dark:text-white hover:text-gray-400 dark:hover:text-gray-400 [&>span]:w-10 [&>span]:h-10"
                                     @click="exitFullscreen"/>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <video ref="videoRef"
               playsinline
               autoplay
               :muted="muted"
               :volume="volume / 100"
               class="w-full h-full"></video>
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>