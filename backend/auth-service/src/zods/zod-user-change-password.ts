import { z } from 'zod';

export const ZOD_USER_CHANGE_PASSWORD = z.object({
    password: z.string().min(3).max(10),
    newPassword: z.string().min(3).max(10),
});