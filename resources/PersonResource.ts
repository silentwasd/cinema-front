import type CountryResource from "~/resources/management/CountryResource";
import type {PersonRole} from "~/types/enums/PersonRole";

export default interface PersonResource {
    id: number;
    name: string;
    photo: string | null;
    can_edit?: boolean;
    country?: CountryResource | null;
    country_id?: number | null;
    films_count?: number;
    roles?: PersonRole[];
}