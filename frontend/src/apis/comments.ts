import axios from "axios"
import type { Comment } from "../types/models";
import type { CreateCommentPayload, UpdateCommentPayload } from "../types/payloads";

const API_URL = "http://localhost:6767/comments"

// crud
export const getComments = () => axios.get<Comment[]>(API_URL);
export const getCommentsFromTicket = (ticketId: number) => axios.get<Comment[]>(`${API_URL}/from-ticket/${ticketId}`);
export const getCommentById  = (id: number) => axios.get<Comment>(`${API_URL}/${id}`);
export const createComment = (data: CreateCommentPayload, userId: number) => axios.post<Comment>(API_URL, {...data, userId})
export const updateComment = (id: number, data: UpdateCommentPayload) => axios.put<Comment>(`${API_URL}/${id}`, data);
export const deleteComment = (id: number) => axios.delete(`${API_URL}/${id}`);
