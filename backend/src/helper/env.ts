import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    PORT: process.env.PORT
} as const;