import Repository from "~/repos/Repository";
import type PaginatedCollection from "~/types/PaginatedCollection";
import type Film from "~/resources/Film";
import type Collection from "~/types/Collection";
import type User from "~/resources/User";

export default class FilmRepository extends Repository {
    public index(request: () => string) {
        return this.client.getLazyFetch<PaginatedCollection<Film>>(() => '/films?' + request());
    }

    public indexGet(request: any) {
        return this.client.get<PaginatedCollection<Film>>('/films?' + querify(request));
    }

    public store(data: Film) {
        return this.client.post<void>('/films', {
            ...data,
            cover: data.cover instanceof File ? data.cover : null
        }, true);
    }

    public update(data: Film) {
        return this.client.put<void>(`/films/${data.id}`, {
            ...data,
            cover: data.cover instanceof File ? data.cover : null
        }, true);
    }

    public destroy(id: number) {
        return this.client.delete<void>(`/films/${id}`);
    }

    public destroyMany(ids: number[]) {
        return this.client.delete<void>('/films', {ids});
    }

    public listUsers(filmId: number, listId: number) {
        return this.client.get<Collection<User>>(`/films/${filmId}/list/${listId}/users`);
    }

    public updateList(filmId: number, listId: number, users: number[]) {
        return this.client.patch<void>(`/films/${filmId}/list/${listId}/users`, {users});
    }

    public updateListMany(films: number[], listId: number, users: number[]) {
        return this.client.patch<void>(`/films/update-list/${listId}`, {films, users});
    }
}