import {FilmFormat} from "~/types/enums/FilmFormat";

export default function (format: FilmFormat) {
    switch (format) {
        case FilmFormat.Film:
            return 'Фильм';
        case FilmFormat.MiniSeries:
            return 'Мини-сериал';
        case FilmFormat.Series:
            return 'Сериал';
    }
}