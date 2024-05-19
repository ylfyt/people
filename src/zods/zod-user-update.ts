import { z } from 'zod';

export const ZOD_USER_UPDATE = z.object({
    phone: z.string().min(4)
});

export const ZOD_USER_UPDATE_ADMIN = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    position: z.string().min(1),
    phone: z.string().min(4),
    role: z.enum(["ADMIN", "USER"])
});