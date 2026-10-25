import axios from "axios"
import type { Building } from "../types/models"
import type { CreateBuildingPayload, UpdateBuildingPayload } from "../types/payloads";

const API_URL = "http://localhost:6767/buildings"

// crud
export const getBuildings = () => axios.get<Building[]>(API_URL);
export const createBuilding = (data: CreateBuildingPayload) => axios.post<Building>(API_URL, data);
export const updateBuilding = (id: number, data: UpdateBuildingPayload) => axios.put(`${API_URL}/${id}`, data);
export const deleteBuilding = (id: number) => axios.delete(`${API_URL}/${id}`);

// logic
export const joinBuilding = (id: number, data: number) => axios.post(`${API_URL}/${id}/join`, data);
export const leaveBuilding = (id: number, data: number) => axios.post(`${API_URL}/${id}/leave`, data);
