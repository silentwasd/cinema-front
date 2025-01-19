import type User from "~/resources/User";

export default interface FeedbackResource {
    id: number;
    user?: User;
    text: string | null;
    reaction: number;
    created_at: string;
    updated_at: string;
}