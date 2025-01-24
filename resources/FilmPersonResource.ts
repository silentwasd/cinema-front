import type {PersonRole} from "~/types/enums/PersonRole";
import type PersonResource from "~/resources/PersonResource";
import type FilmResource from "~/resources/public/FilmResource";

export default interface FilmPersonResource {
    id: number;
    film_id: number;
    person_id: number;
    role: PersonRole;
    role_details: string | null;
    person?: PersonResource;
    film?: FilmResource;
}