export const ENV = {
    AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL as string,
    PEOPLE_BASE_URL: process.env.NEXT_PUBLIC_PEOPLE_BASE_URL as string,
} as const;
