import axios from "axios"
import type { Ticket } from "../types/models";
import type { ChangeTicketPropertiesPayload, CreateTicketPayload, UpdateTicketPayload } from "../types/payloads";


const API_URL = "http://localhost:6767/tickets"

// curd
export const getTickets = () => axios.get<Ticket[]>(API_URL);
export const getTicketById = (id: number) => axios.get<Ticket>(`${API_URL}/${id}`);
export const createTicket = (data: CreateTicketPayload) => axios.post<Ticket>(API_URL, data);
export const updateTicket = (id: number, data: UpdateTicketPayload) => axios.put<Ticket>(`${API_URL}/${id}`, data);
export const deleteTicket = (id: number) => axios.delete(`${API_URL}/${id}`);

// logic
export const changeTicketProperty = (id: number, data: ChangeTicketPropertiesPayload) => axios.put(`${API_URL}/update-properties/${id}`, data);
