export default interface PersonResource {
    id: number;
    name: string;
    photo: string | null;
    can_edit?: boolean;
}