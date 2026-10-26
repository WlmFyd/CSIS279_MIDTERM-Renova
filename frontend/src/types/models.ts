import type {
    UserType,
    BuildingType,
    TicketUrgency,
    TicketStatus
} from "./enums";

export type User = {
    id: number;
    name: string;
    email: string;
    type: UserType;
}

export type Building = {
    id: number;
    name: string;
    type: BuildingType;
}

export type Ticket = {
    id: number;
    title: string;
    desc: string;
    urgency: TicketUrgency;
    status: TicketStatus;
    allowComments: boolean;
    fromUser: User;
}

export type Comment = {
    id: number;
    text: string;
    fromUser: User;
}