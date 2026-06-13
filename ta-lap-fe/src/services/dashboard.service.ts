import api from "@/lib/api";

export const getAdminDashboard =
  async () => {
    const response = await api.get(
      "/dashboard/admin"
    );

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