export type Presence = {
    id: number;
    userId: number;
    enterDate: string;
    exitDate?: string;
    modifiedAt: Date;
};