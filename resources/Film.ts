import type {FilmFormat} from "~/types/enums/FilmFormat";
import type Rating from "~/resources/Rating";
import type FilmPersonResource from "~/resources/FilmPersonResource";

export default interface Film {
    id: number;
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
}