import Repository from "~/repos/Repository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type List from "~/resources/List";
import type Collection from "~/types/Collection";
import type SearchableRepository from "~/types/repos/SearchableRepository";

export default class ListRepository extends Repository implements SearchableRepository {
    public index(request: () => string) {
        return this.client.getLazyFetch<PaginatedCollection<List>>(() => '/lists?' + request());
    }

    public store(data: List) {
        return this.client.post<void>('/lists', data);
    }

    public update(data: List) {
        return this.client.put<void>(`/lists/${data.id}`, data);
    }

    public destroy(id: number) {
        return this.client.delete<void>(`/lists/${id}`);
    }

    public destroyMany(ids: number[]) {
        return this.client.delete<void>('/lists', {ids});
    }

    public search(query: string): Promise<Collection<List>> {
        return this.client.get<Collection<List>>('/lists?' + querify({name: query}));
    }
}