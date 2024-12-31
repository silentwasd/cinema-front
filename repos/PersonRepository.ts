import CrudRepository from "~/repos/CrudRepository";
import type PersonResource from "~/resources/PersonResource";
import type SearchableRepository from "~/types/repos/SearchableRepository";
import type Collection from "~/types/Collection";

export default class PersonRepository extends CrudRepository<PersonResource, number> implements SearchableRepository {
    protected baseUrl: string   = '/management/people';
    override postFiles: boolean = true;
    override putFiles: boolean  = true;

    public search(query: string): Promise<Collection<PersonResource>> {
        return this.client.get(`${this.baseUrl}?` + querify({
            name          : query,
            sort_column   : 'name',
            sort_direction: 'asc'
        }).toString());
    }
}