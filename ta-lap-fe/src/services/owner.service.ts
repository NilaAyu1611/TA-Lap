import api from "@/lib/api";

export const getOwners = async () => {
  const response = await api.get("/owners");
  return response.data;
};

export const deleteOwner = async (id: string) => {
  const response = await api.delete(`/owners/${id}`);
  return response.data;
};
