export default interface Film {
    id: number;
    name: string;
    cover?: string | File;
    release_date?: string;
    description?: string;
    ratings: number;
    lists: number;
}