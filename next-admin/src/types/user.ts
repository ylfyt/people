export type User = {
    id: number;
    name: string;
    email: string;
    profil_pic_url: string;
    phone: string;
    position: string;
    role: UserRole;
};

export type UserRole = "ADMIN" | "USER";