import type {FilmFormat} from "~/types/enums/FilmFormat";

export default interface Film {
    id: number;
    name: string;
    format: FilmFormat;
    cover?: string | File;
    release_date?: string;
    description?: string;
    ratings: number;
    lists: number;
}