import api from "@/lib/api";
import { AdminDashboardData } from "@/types/adminDashboard";

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get<AdminDashboardData>("/dashboard/admin");
  return response.data;
};

export const getOwnerDashboard =
  async () => {
    const response = await api.get(
      "/dashboard/owner"
    );

    return response.data;
  };

export const getUserDashboard =
  async () => {
    const response = await api.get(
      "/dashboard/user"
    );

    return response.data;
  };