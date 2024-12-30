import CrudRepository from "~/repos/CrudRepository";
import type FilmWatcher from "~/resources/FilmWatcher";

export default class FilmWatcherRepository extends CrudRepository<FilmWatcher, number> {
    protected baseUrl: string = '/management/film-watchers';
}