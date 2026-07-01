import api from "@/lib/api";
import { JenisOlahraga } from "@/types/jenis";

export const getJenisOlahraga = async (): Promise<{ data: JenisOlahraga[] }> => {
  const response = await api.get("/jenis");
  return response.data;
};

export const createJenisOlahraga = async (nama: string) => {
  const response = await api.post("/jenis", { nama });
  return response.data as { message: string; data: JenisOlahraga };
};
