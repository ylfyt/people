import { z } from 'zod';

export const ZOD_USER_LOGIN = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(10)
});