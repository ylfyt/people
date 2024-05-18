import { z } from 'zod';

export const ZOD_USER_REGISTER = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    position: z.string().min(1),
    phone: z.string().min(4),
    password: z.string().min(3).max(10)
});