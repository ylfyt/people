export type Presence = {
    id: number;
    userId: number;
    createdAt: string;
    type: "ENTER" | "EXIT";
};