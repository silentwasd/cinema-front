import type {FilmCinemaStatus} from "~/types/enums/FilmCinemaStatus";

export default interface FilmResource {
    id: number;
    name: string;
    cover: string | null;
    release_date: string | null;
    cinema_status: FilmCinemaStatus;
    video_variants_count?: number;
    audio_variants_count?: number;
    has_download: boolean;
}