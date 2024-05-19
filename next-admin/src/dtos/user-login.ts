import { User } from '@/types/user';

export type UserLoginResponse = {
    duration: number;
    token: string;
    user: User;
};