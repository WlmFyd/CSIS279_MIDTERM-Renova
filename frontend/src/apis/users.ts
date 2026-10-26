import axios from "axios"
import type { User } from "../types/models";
import type { CreateUserPayload, UpdateUserPayload } from "../types/payloads";

const API_URL = "http://localhost:6767/users"

// crud
export const getUsers = () => axios.get<User[]>(API_URL);
export const getUserById = (id: number) => axios.get<User>(`${API_URL}/${id}`)
export const getUserFromComment = (id: number) => axios.get<User>(`${API_URL}/from-comment/${id}`);
export const createUser = (data: CreateUserPayload) => axios.post<User>(API_URL, data);
export const updateUser = (id: number, data: UpdateUserPayload) => axios.put<User>(`${API_URL}/${id}`, data);
export const deleteUser = (id: number) => axios.delete(`${API_URL}/${id}`);

