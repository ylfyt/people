export type User = {
    id: number;
    name: string;
    email: string;
    profil_pic_url: string;
    phone: string;
    position: string;
    role: UserRole;
    createdAt: string;
    updatedAt?: string;
};

export type UserRole = "ADMIN" | "USER";