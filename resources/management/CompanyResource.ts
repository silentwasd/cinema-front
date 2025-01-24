export default interface CompanyResource {
    id: number;
    name: string;
    description: string | null;
    link: string | null;
    can_edit?: boolean;
}