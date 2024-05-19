import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL as string,
    IS_PROD: process.env.ENV_MODE === "PROD",
    ADMIN_BASE_PATH: process.env.ADMIN_BASE_PATH ?? ''
} as const;