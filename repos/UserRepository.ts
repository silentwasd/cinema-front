import Repository from "~/repos/Repository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type User from "~/resources/User";
import type Collection from "~/types/Collection";
import type SearchableRepository from "~/types/repos/SearchableRepository";

export default class ListRepository extends Repository implements SearchableRepository {
    public index(request: () => string) {
        return this.client.getLazyFetch<PaginatedCollection<User>>(() => '/users?' + request());
    }

    public store(data: User) {
        return this.client.post<void>('/users', data);
    }

    public update(data: User) {
        return this.client.put<void>(`/users/${data.id}`, data);
    }

    public destroy(id: number) {
        return this.client.delete<void>(`/users/${id}`);
    }

    public destroyMany(ids: number[]) {
        return this.client.delete<void>('/users', {ids});
    }

    public search(query: string): Promise<Collection<User>> {
        return this.client.get<Collection<User>>('/users?' + querify({name: query}));
    }
}