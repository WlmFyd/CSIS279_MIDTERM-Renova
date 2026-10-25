import axios from "axios"
import { User } from "../types/models";

const API_URL = "http://localhost:6767/users"

// crud
export const getUsers = () => axios.get<User[]>(API_URL);
export const getUserById = (id: number) => axios.get<User>(`${API_URL}/${id}`)
export const createUser = (data: Omit<User, 'id'>) => axios.post<User>(API_URL, data);
export const updateUser = (id: number, data: Omit<User, 'id'>) => axios.put<User>(`${API_URL}/${id}`, data);
export const deleteUser = (id: number) => axios.delete(`${API_URL}/${id}`);

