export interface User {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    points: number;
    gamesPlayed: number;
    gamesOrganized: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithPassword extends User {
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
} 