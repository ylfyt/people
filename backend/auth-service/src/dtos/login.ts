import { User } from '@prisma/client';

export type UserLoginDto = {
    user: User;
    token: string;
    duration: number;
};