import { User } from './User';

export interface Location {
    name: string;
    address: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface Match {
    _id?: string;
    title: string;
    description?: string;
    date: Date;
    location: Location;
    maxPlayers: number;
    organizer: User | string;
    players: (User | string)[];
    ballCarrier?: User | string;
    status: 'planned' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export interface MatchResponse {
    success: boolean;
    message: string;
    match?: Match;
} 