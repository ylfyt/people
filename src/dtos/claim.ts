import { UserRole } from '@prisma/client';

export type UserClaim = {
    id: number,
    email: string;
    role: UserRole;
};