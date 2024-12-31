import CrudRepository from "~/repos/CrudRepository";
import type PersonResource from "~/resources/PersonResource";

export default class PersonRepository extends CrudRepository<PersonResource, number> {
    protected baseUrl: string   = '/management/people';
    override postFiles: boolean = true;
    override putFiles: boolean  = true;
}