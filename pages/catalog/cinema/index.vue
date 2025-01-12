<script setup lang="ts">
import DownloadRepository from "~/repos/production/DownloadRepository";
import {DownloadStatus} from "~/types/enums/DownloadStatus";
import type DownloadResource from "~/resources/DownloadResource";
import FilmRepository from "~/repos/FilmRepository";
import FilmCinemaRepository from "~/repos/production/FilmRepository";
import type FilmResource from "~/resources/production/FilmResource";
import type Resource from "~/types/Resource";
import FilmAudioVariantRepository from "~/repos/production/FilmAudioVariantRepository";
import type FilmAudioVariantResource from "~/resources/production/FilmAudioVariantResource";
import {FilmAudioVariantStatus} from "~/types/enums/FilmAudioVariantStatus";
import type FilmVideoVariantResource from "~/resources/production/FilmVideoVariantResource";
import FilmVideoVariantRepository from "~/repos/production/FilmVideoVariantRepository";
import {FilmVideoVariantStatus} from "~/types/enums/FilmVideoVariantStatus";
import {FilmCinemaStatus} from "~/types/enums/FilmCinemaStatus";

definePageMeta({
    middleware: 'auth',
    layout    : 'management'
});

const addUrl         = ref<boolean>(false);
const attachDownload = ref<DownloadResource>();
const downloadRepo   = new DownloadRepository();
const filmRepo       = new FilmCinemaRepository();
const selectedFilm   = ref<Resource<FilmResource>>();
const watch          = ref<boolean>(false);
const publishing     = ref<boolean>(false);

const videoProcess           = ref<any>();
const videoProcessPreviewing = ref<boolean>(false);
const videoProcessPreviewUrl = ref<string>('');
const videoVariants          = ref<FilmVideoVariantResource[]>();

const audioProcess           = ref<any>();
const audioProcessPreviewing = ref<boolean>(false);
const audioProcessPreviewUrl = ref<string>('');
const audioVariants          = ref<FilmAudioVariantResource[]>();

const toast = useToast();

const {data: downloads, refresh: refreshDownloads} = await downloadRepo.list(`downloads`);
const {data: films, refresh: refreshFilms}         = await filmRepo.list(`films`);

useIntervalFn(() => {
    refreshDownloads();

    if (selectedFilm.value) {
        loadVideoVariants();
        loadAudioVariants();
    }
}, 1000 * 5);

async function selectFilm(film: FilmResource) {
    try {
        selectedFilm.value = await filmRepo.get(film.id, selectedFilm.value?.selectedFile ? {
            file: selectedFilm.value?.selectedFile
        } : undefined);

        await loadVideoVariants();
        await loadAudioVariants();
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    }
}

async function previewVideo(state: any) {
    if (!selectedFilm.value)
        return;

    const filmVideoVariantRepo   = new FilmVideoVariantRepository(selectedFilm.value.data.id);
    videoProcessPreviewing.value = true;

    try {
        const response               = await filmVideoVariantRepo.preview(state);
        const url                    = URL.createObjectURL(response as Blob);
        videoProcessPreviewUrl.value = url;
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    } finally {
        videoProcessPreviewing.value = false;
    }
}

async function previewAudio(state: any) {
    if (!selectedFilm.value)
        return;

    const filmAudioVariantRepo   = new FilmAudioVariantRepository(selectedFilm.value.data.id);
    audioProcessPreviewing.value = true;

    try {
        const response               = await filmAudioVariantRepo.preview(state);
        const url                    = URL.createObjectURL(response as Blob);
        audioProcessPreviewUrl.value = url;
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    } finally {
        audioProcessPreviewing.value = false;
    }
}

async function loadVideoVariants() {
    if (!selectedFilm.value)
        return;

    const filmVideoVariantRepo = new FilmVideoVariantRepository(selectedFilm.value.data.id);

    try {
        const response      = await filmVideoVariantRepo.fetchList();
        videoVariants.value = response.data;
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    }
}

async function loadAudioVariants() {
    if (!selectedFilm.value)
        return;

    const filmAudioVariantRepo = new FilmAudioVariantRepository(selectedFilm.value.data.id);

    try {
        const response      = await filmAudioVariantRepo.fetchList();
        audioVariants.value = response.data;
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    }
}

async function publish() {
    if (!selectedFilm.value)
        return;

    publishing.value = false;

    try {
        await filmRepo.update(selectedFilm.value.data);
        await refreshFilms();
        await selectFilm(selectedFilm.value.data);
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    }
}

async function detach(film: FilmResource) {
    try {
        if (film.id == selectedFilm.value?.data.id)
            selectedFilm.value = undefined;

        await filmRepo.remove(film.id);
        await refreshFilms();
        await refreshDownloads();
    } catch (err: any) {
        toast.add({
            title      : 'Ошибка',
            description: err?.data?.message || err?.message,
            color      : 'red'
        });
    }
}
</script>

<template>
    <UiManagementMain>
        <div class="flex gap-2.5 h-full">
            <div class="flex flex-col w-1/4 h-full shrink-0">
                <div>
                    <h1 class="text-xl font-semibold mb-2.5">Загрузки</h1>

                    <UButton color="gray"
                             label="Добавить URL"
                             icon="i-heroicons-plus"
                             @click="addUrl = true"/>
                </div>

                <div class="flex flex-col gap-2.5 mt-2.5 overflow-auto h-0 grow">
                    <div v-for="download in downloads?.data ?? []"
                         :key="download.id"
                         class="bg-gray-100 dark:bg-gray-800 rounded-md p-2.5 flex flex-col gap-1 border dark:border-gray-700">
                        <template v-if="download.name">
                            <p class="font-semibold truncate">{{ download.name }}</p>
                            <UProgress :value="download.progress"/>
                            <p class="text-sm">{{ download.status }} ({{ download.progress }}%)</p>

                            <div v-if="download.status == DownloadStatus.Seeding && !download.has_film">
                                <UButton icon="i-heroicons-link-20-solid"
                                         color="gray"
                                         label="Привязать к фильму"
                                         size="xs"
                                         @click="attachDownload = download"/>
                            </div>
                        </template>

                        <template v-else>
                            <div class="flex items-center gap-2.5">
                                <UIcon name="i-heroicons-arrow-path" class="animate-spin text-xl shrink-0"/>
                                <p class="truncate">{{ download.hash }}</p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="flex flex-col w-1/4 h-full shrink-0">
                <h1 class="text-xl font-semibold shrink-0">Фильмы</h1>

                <div class="flex flex-col gap-2.5 mt-2.5 overflow-auto h-0 grow">
                    <div v-for="film in films?.data ?? []"
                         class="bg-gray-100 dark:bg-gray-800 rounded-md p-2.5 border dark:border-gray-700"
                         :key="film.id">
                        <div class="flex gap-2.5 items-start"
                             :class="{'cursor-pointer': film.has_download}"
                             @click="film.has_download ? selectFilm(film) : null">
                            <img :src="fileUrl(film.cover)" class="w-10 h-10 object-cover rounded-md shrink-0"/>

                            <div class="truncate">
                                <p class="font-semibold truncate leading-5 text-lg">{{ film.name }}</p>

                                <NuxtTime :datetime="film.release_date" class="text-sm"/>

                                <p>
                                    <UBadge class="text-sm uppercase"
                                            color="gray"
                                            size="xs">
                                        {{ film.cinema_status }}
                                    </UBadge>
                                </p>
                            </div>
                        </div>

                        <template v-if="film.has_download || film.video_variants_count || film.audio_variants_count">
                            <UDivider class="py-2 [&>div]:dark:border-gray-700"/>

                            <div class="flex gap-2">
                                <UButton
                                    v-if="film.has_download || film.video_variants_count || film.audio_variants_count"
                                    icon="i-heroicons-arrow-right"
                                    color="gray"
                                    label="Перейти"
                                    size="xs"
                                    @click="selectFilm(film)"/>

                                <UButton v-if="film.has_download"
                                         icon="i-heroicons-link-slash-20-solid"
                                         color="gray"
                                         label="Отвязать фильм"
                                         size="xs"
                                         @click="detach(film)"/>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div v-if="selectedFilm && selectedFilm.data.has_download" class="flex flex-col w-1/4 h-full shrink-0">
                <h1 class="text-xl font-semibold shrink-0 truncate">Фильм "{{ selectedFilm.data.name }}"</h1>

                <USelectMenu :options="selectedFilm.files"
                             v-model="selectedFilm.selectedFile"
                             @update:model-value="selectFilm(selectedFilm.data)">
                    <template #option="{option}">
                        <div class="flex flex-col items-start truncate">
                            <div class="w-full">
                                <p class="truncate">{{ option }}</p>
                            </div>
                            <UBadge color="gray">{{ option.split('.').toReversed()[0] }}</UBadge>
                        </div>
                    </template>
                </USelectMenu>

                <div class="flex flex-col gap-2.5 mt-2.5 overflow-auto h-0 grow">
                    <UButton v-if="selectedFilm.data.is_video_ready && selectedFilm.data.is_audio_ready"
                             color="gray"
                             icon="i-heroicons-play-solid"
                             label="Посмотреть"
                             @click="watch = true"/>

                    <UButton
                        v-if="selectedFilm.data.is_video_ready && selectedFilm.data.is_audio_ready && selectedFilm.data.cinema_status != FilmCinemaStatus.Published"
                        color="gray"
                        icon="i-heroicons-arrow-up-tray"
                        label="Опубликовать"
                        @click="publish"/>

                    <div class="bg-gray-100 dark:bg-gray-800 rounded-md p-2.5 border dark:border-gray-700">
                        <h1 class="text-lg font-semibold leading-5">Видео</h1>

                        <table class="w-full">
                            <tbody>
                            <tr>
                                <td class="w-[100px]">Ширина</td>
                                <td>{{ selectedFilm.info.video.width }}</td>
                            </tr>
                            <tr>
                                <td>Высота</td>
                                <td>{{ selectedFilm.info.video.height }}</td>
                            </tr>
                            <tr>
                                <td>Битрейт</td>
                                <td>{{ Math.round(selectedFilm.info.video.bitrate / 1000) }} KB/s</td>
                            </tr>
                            <tr>
                                <td>HDR</td>
                                <td>{{ selectedFilm.info.video.has_hdr ? 'да' : 'нет' }}</td>
                            </tr>
                            <tr>
                                <td>Время</td>
                                <td>{{ Math.round(selectedFilm.info.video.duration / 60) }} мин</td>
                            </tr>
                            </tbody>
                        </table>

                        <UButton color="gray"
                                 label="Обработать"
                                 icon="i-heroicons-rocket-launch-solid"
                                 class="mt-1.5"
                                 @click="videoProcess = selectedFilm.info.video"/>
                    </div>

                    <div v-for="audio in selectedFilm.info.audio"
                         class="bg-gray-100 dark:bg-gray-800 rounded-md p-2.5 border dark:border-gray-700">
                        <h1 class="text-lg font-semibold leading-5">Аудио #{{ audio.index }}</h1>

                        <table class="w-full">
                            <tbody>
                            <tr v-if="audio.title">
                                <td>Заголовок</td>
                                <td>{{ audio.title }}</td>
                            </tr>

                            <tr v-if="audio.language">
                                <td>Язык</td>
                                <td>{{ audio.language }}</td>
                            </tr>

                            <tr>
                                <td class="w-[100px]">Битрейт</td>
                                <td>{{ Math.round(audio.bitrate / 1000) }} KB/s</td>
                            </tr>
                            </tbody>
                        </table>

                        <UButton color="gray"
                                 label="Обработать"
                                 icon="i-heroicons-rocket-launch-solid"
                                 class="mt-1.5"
                                 @click="audioProcess = audio"/>
                    </div>
                </div>
            </div>

            <div v-if="selectedFilm" class="flex flex-col w-1/4 h-full shrink-0">
                <h1 class="text-xl font-semibold shrink-0 truncate">Медиа</h1>

                <div class="flex flex-col gap-2.5 mt-2.5 overflow-auto h-0 grow">
                    <div v-for="video in videoVariants"
                         :key="video.id"
                         class="bg-gray-100 dark:bg-gray-800 rounded-md p-2.5 border dark:border-gray-700">
                        <h1 class="text-lg font-semibold leading-5">Видео #{{ video.id }}</h1>

                        <table class="w-full">
                            <tbody>
                            <tr>
                                <td class="w-[130px]">Заголовок</td>
                                <td>{{ video.name }}</td>
                            </tr>
                            <tr>
                                <td class="w-[100px]">Ширина</td>
                                <td>{{ video.width }}</td>
                            </tr>
                            <tr>
                                <td>Высота</td>
                                <td>{{ video.height }}</td>
                            </tr>
                            <tr>
                                <td>Битрейт</td>
                                <td>{{ Math.round(video.bitrate / 1000) }} KB/s</td>
                            </tr>
                            <tr>
                                <td>CRF</td>
                                <td>{{ video.crf }}</td>
                            </tr>
                            <tr>
                                <td>Конв. в SDR</td>
                                <td>{{ video.to_sdr ? 'да' : 'нет' }}</td>
                            </tr>
                            <tr>
                                <td>Статус</td>
                                <td>
                                    <UBadge color="gray">{{ video.status.toUpperCase() }}</UBadge>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <div v-if="video.path && video.status == FilmVideoVariantStatus.Completed"
                             class="mt-1.5">
                            <UiHlsVideo :src="fileUrl(video.path)" class="aspect-[16/9] bg-gray-950"/>
                        </div>

                        <UButton v-if="video.status == FilmVideoVariantStatus.Failed"
                                 color="gray"
                                 label="Запустить снова"
                                 class="mt-1.5"
                                 icon="i-heroicons-arrow-uturn-left"
                                 @click="(new FilmVideoVariantRepository(selectedFilm.data.id)).update({id: video.id}).then(() => loadVideoVariants())"/>
                    </div>

                    <div v-for="audio in audioVariants"
                         :key="audio.id"
                         class="bg-gray-100 dark:bg-gray-800 rounded-md p-2.5 border dark:border-gray-700">
                        <h1 class="text-lg font-semibold leading-5">Аудио #{{ audio.id }}</h1>

                        <table class="w-full">
                            <tbody>
                            <tr>
                                <td class="w-[130px]">Заголовок</td>
                                <td>{{ audio.name }}</td>
                            </tr>

                            <tr>
                                <td>Язык</td>
                                <td>{{ audio.language }}</td>
                            </tr>

                            <tr>
                                <td>Битрейт</td>
                                <td>{{ Math.round(audio.bitrate / 1000) }} KB/s</td>
                            </tr>

                            <tr>
                                <td>Поток #</td>
                                <td>{{ audio.index }}</td>
                            </tr>

                            <tr>
                                <td>Статус</td>
                                <td>
                                    <UBadge color="gray">{{ audio.status.toUpperCase() }}</UBadge>
                                </td>
                            </tr>

                            <tr>
                                <td>По умолчанию</td>
                                <td>{{ audio.is_default ? 'да' : 'нет' }}</td>
                            </tr>
                            </tbody>
                        </table>

                        <div v-if="audio.path && audio.status == FilmAudioVariantStatus.Completed"
                             class="mt-1.5">
                            <UiHlsAudio :src="fileUrl(audio.path)"/>
                        </div>

                        <UButton v-if="audio.status == FilmAudioVariantStatus.Failed"
                                 color="gray"
                                 label="Запустить снова"
                                 class="mt-1.5"
                                 icon="i-heroicons-arrow-uturn-left"
                                 @click="(new FilmAudioVariantRepository(selectedFilm.data.id)).update({id: audio.id}).then(() => loadAudioVariants())"/>

                        <UButton v-if="!audio.is_default"
                                 color="gray"
                                 label="По умолчанию"
                                 class="mt-1.5"
                                 icon="i-heroicons-check"
                                 @click="(new FilmAudioVariantRepository(selectedFilm.data.id)).markAsDefault(audio.id).then(() => loadAudioVariants())"/>
                    </div>
                </div>
            </div>
        </div>
    </UiManagementMain>

    <ModalInnerState v-model="addUrl"
                     :save="(state: any) => downloadRepo.store(state).then(() => refreshDownloads())">
        <template #title>
            Добавить URL
        </template>

        <template #default="{state}">
            <UFormGroup label="URL" name="url">
                <UInput v-model="state.url"/>
            </UFormGroup>
        </template>
    </ModalInnerState>

    <ModalEditModel v-model="attachDownload"
                    :save="(state: any) => downloadRepo.update(state).then(() => refreshFilms())">
        <template #edit-title>Привязать к фильму</template>

        <template #default="{state}">
            <UiRepoSearchSelectId :repo="new FilmRepository()"
                                  placeholder="Выберите фильм из списка"
                                  v-model="state.film_id"/>
        </template>
    </ModalEditModel>

    <ModalEditModel v-model="videoProcess"
                    :save="(state: any) => (new FilmVideoVariantRepository(selectedFilm.data.id)).store(state).then(() => loadVideoVariants())">
        <template #create-title>Отправить в обработку</template>

        <template #default="{state}">
            <UFormGroup label="Заголовок" name="name">
                <UInput v-model="state.name"/>
            </UFormGroup>

            <UFormGroup label="Битрейт" name="bitrate">
                <UInput v-model="state.bitrate"/>
            </UFormGroup>

            <UFormGroup label="CRF" name="crf">
                <UInput v-model="state.crf"/>
            </UFormGroup>

            <UFormGroup label="Ширина" name="width">
                <UInput v-model="state.width"/>
            </UFormGroup>

            <UFormGroup label="Высота" name="height">
                <UInput v-model="state.height"/>
            </UFormGroup>

            <UCheckbox v-model="state.has_hdr"
                       label="Конвертация в SDR"/>

            <div v-if="videoProcessPreviewUrl">
                <video :src="videoProcessPreviewUrl"
                       class="w-full h-[250px] bg-gray-950"
                       playsinline
                       controls></video>
            </div>
        </template>

        <template #footer="{state}">
            <UButton color="gray"
                     label="Превью"
                     :loading="videoProcessPreviewing"
                     @click="previewVideo(state)"/>
        </template>
    </ModalEditModel>

    <ModalEditModel v-model="audioProcess"
                    :save="(state: any) => (new FilmAudioVariantRepository(selectedFilm.data.id)).store(state).then(() => loadAudioVariants())">
        <template #create-title>Отправить в обработку</template>

        <template #default="{state}">
            <UFormGroup label="Заголовок" name="title">
                <UInput v-model="state.title"/>
            </UFormGroup>

            <UFormGroup label="Язык" name="language">
                <UInput v-model="state.language"/>
            </UFormGroup>

            <UFormGroup label="Битрейт" name="bitrate">
                <UInput v-model="state.bitrate"/>
            </UFormGroup>

            <UCheckbox v-model="state.is_default"
                       label="По умолчанию"/>

            <div v-if="audioProcessPreviewUrl">
                <audio :src="audioProcessPreviewUrl"
                       class="w-full"
                       controls></audio>
            </div>
        </template>

        <template #footer="{state}">
            <UButton color="gray"
                     label="Превью"
                     :loading="audioProcessPreviewing"
                     @click="previewAudio(state)"/>
        </template>
    </ModalEditModel>

    <ModalClosable v-model="watch"
                   title="Просмотр">
        <UiSimpleFilmPlayer :id="selectedFilm?.data.id"/>
    </ModalClosable>
</template>

<style scoped>

</style>