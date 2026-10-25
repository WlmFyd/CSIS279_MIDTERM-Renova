import { BuildingType, TicketStatus, TicketUrgency } from "./enums";

// create payloads
export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
};

export interface CreateBuildingPayload {
    name: string;
    type?: BuildingType;
};

export interface CreateTicketPayload {
    title: string;
    desc: string;
    buildingId: number;
    urgency?: TicketUrgency;
    allowComments?: boolean;
};

export interface CreateCommentPayload {
    text: string;
    ticketId: number;
};

// update payloads
export type UpdateUserPayload = Partial<CreateUserPayload>;
export type UpdateBuildingPayload = Partial<CreateBuildingPayload>;
export type UpdateTicketPayload = Partial<CreateTicketPayload>;
export type UpdateCommentPayload = Partial<CreateCommentPayload>;

// extra payloads
export interface ChangeTicketPropertiesPayload {
    status?: TicketStatus,
    urgency?: TicketUrgency,
    allowComments?: boolean
};
