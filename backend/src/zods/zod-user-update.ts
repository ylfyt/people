import { z } from 'zod';

export const ZOD_USER_UPDATE = z.object({
    phone: z.string().min(4)
});