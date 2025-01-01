import type Film from "~/resources/Film";
import CrudRepository from "~/repos/CrudRepository";

export default class FilmRepository extends CrudRepository<Film, number> {
    protected baseUrl: string             = '/management/films';
    protected override postFiles: boolean = true;
    protected override putFiles: boolean  = true;
}