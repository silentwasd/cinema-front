import Repository from "~/repos/Repository";
import type Rating from "~/resources/Rating";
import type Collection from "~/types/Collection";

export default class RatingRepository extends Repository {
    public index(filmId: number) {
        return this.client.get<Collection<Rating>>(`/films/${filmId}/ratings`);
    }

    public store(filmId: number, data: Rating) {
        return this.client.post<void>(`/films/${filmId}/ratings`, {
            ...data,
            user_id: data.user?.id
        });
    }

    public update(filmId: number, data: Rating) {
        return this.client.put<void>(`/films/${filmId}/ratings/${data.id}`, {
            ...data,
            user_id: data.user?.id
        });
    }

    public destroy(filmId: number, id: number) {
        return this.client.delete<void>(`/films/${filmId}/ratings/${id}`);
    }
}