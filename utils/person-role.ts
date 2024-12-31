import {PersonRole} from "~/types/enums/PersonRole";

export default function (role: PersonRole) {
    switch (role) {
        case PersonRole.Director:
            return 'Режиссер';
        case PersonRole.Actor:
            return 'Актер';
    }
}