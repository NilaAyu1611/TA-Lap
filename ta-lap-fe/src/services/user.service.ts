import api from "@/lib/api";
import { User, UserFormData, UserResponse } from "@/types/user";

export const getUsers = async (): Promise<UserResponse> => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id: string): Promise<{ data: User }> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (
  data: UserFormData
): Promise<{ message: string; data: User }> => {
  const response = await api.post("/users", data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: Partial<UserFormData>
): Promise<{ message: string; data: User }> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
