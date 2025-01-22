import type {FilmFormat} from "~/types/enums/FilmFormat";
import type Rating from "~/resources/Rating";
import type FilmPersonResource from "~/resources/FilmPersonResource";
import type GenreResource from "~/resources/management/GenreResource";
import type CountryResource from "~/resources/management/CountryResource";

export default interface Film {
    id: number;
    author_id?: number;
    name: string;
    format: FilmFormat;
    cover?: string | File;
    release_date?: string;
    description?: string;
    is_mine?: boolean;
    has_rating?: boolean;
    can_edit?: boolean;
    can_watch?: boolean;
    ratings?: Rating[];
    people?: FilmPersonResource[];
    genres?: GenreResource[] | number[];
    countries?: CountryResource[] | number[];
}