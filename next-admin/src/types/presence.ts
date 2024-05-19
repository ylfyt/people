import { UserShort } from './user';

export type Presence = {
    id: number;
    userId: number;
    enterDate: string;
    exitDate?: string;
    modifiedAt: string;
    user?: UserShort;
};