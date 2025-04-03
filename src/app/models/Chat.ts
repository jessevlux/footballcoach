import { User } from './User';
import { Match } from './Match';

export interface Message {
    _id?: string;
    sender: User | string;
    content: string;
    timestamp: Date;
}

export interface Chat {
    _id?: string;
    match: Match | string;
    messages: Message[];
    participants: (User | string)[];
    createdAt: Date;
    updatedAt: Date;
} 