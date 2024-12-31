import type {FilmFormat} from "~/types/enums/FilmFormat";
import type Rating from "~/resources/Rating";

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
    ratings?: Rating[];
}