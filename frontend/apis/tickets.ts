import axios from "axios"
import { Ticket } from "../types/models";
import { ChangeTicketPropertiesPayload, CreateTicketPayload, UpdateTicketPayload } from "../types/payloads";


const API_URL = "http://localhost:6767/users"

// curd
export const getTickets = () => axios.get<Ticket[]>(API_URL);
export const getTicketById = (id: number) => axios.get<Ticket>(`${API_URL}/${id}`);
export const createTicket = (data: CreateTicketPayload) => axios.post<Ticket>(API_URL, data);
export const updateTicket = (id: number, data: UpdateTicketPayload) => axios.put<Ticket>(`${API_URL}/${id}`, data);
export const deleteTicket = (id: number) => axios.delete(`${API_URL}/${id}`);

// logic
export const changeTicketProperty = (id: number, data: ChangeTicketPropertiesPayload) => axios.put(`${API_URL}/${id}`, data);
