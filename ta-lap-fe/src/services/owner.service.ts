import api from "@/lib/api";
import { Owner, OwnerFormData, OwnerResponse } from "@/types/owner";

export const getOwners = async (): Promise<OwnerResponse> => {
  const response = await api.get("/owners");
  return response.data;
};

export const getOwnerById = async (id: string): Promise<{ data: Owner }> => {
  const response = await api.get(`/owners/${id}`);
  return response.data;
};

export const createOwner = async (
  data: OwnerFormData
): Promise<{ message: string; data: Owner }> => {
  const response = await api.post("/owners", data);
  return response.data;
};

export const updateOwner = async (
  id: string,
  data: Partial<OwnerFormData>
): Promise<{ message: string; data: Owner }> => {
  const response = await api.put(`/owners/${id}`, data);
  return response.data;
};

export const approveOwner = async (
  id: string,
  notes?: string
): Promise<{ message: string; data: Owner }> => {
  const response = await api.post(`/owners/${id}/approve`, { notes });
  return response.data;
};

export const rejectOwner = async (
  id: string,
  notes: string
): Promise<{ message: string; data: Owner }> => {
  const response = await api.post(`/owners/${id}/reject`, { notes });
  return response.data;
};

export const deleteOwner = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/owners/${id}`);
  return response.data;
};
