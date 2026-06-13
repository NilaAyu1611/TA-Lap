import api from "@/lib/api";

export const getLapangan =
  async () => {
    const response = await api.get(
      "/lapangan"
    );

    return response.data;
  };

export const createLapangan =
  async (data: any) => {
    const response = await api.post(
      "/lapangan",
      data
    );

    return response.data;
  };

export const updateLapangan =
  async (
    id: string,
    data: any
  ) => {
    const response = await api.put(
      `/lapangan/${id}`,
      data
    );

    return response.data;
  };

export const deleteLapangan =
  async (id: string) => {
    const response = await api.delete(
      `/lapangan/${id}`
    );

    return response.data;
  };