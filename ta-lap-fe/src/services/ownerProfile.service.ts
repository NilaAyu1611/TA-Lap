import api from "@/lib/api";
import { UserPasswordFormData } from "@/types/userProfile";
import {
  OwnerProfile,
  OwnerProfileFormData,
  OwnerProfileResponse,
} from "@/types/ownerProfile";

export const getMyOwnerProfile = async (): Promise<OwnerProfileResponse> => {
  const response = await api.get("/owner/profile/me");
  return response.data;
};

export const updateMyOwnerProfile = async (
  data: Partial<OwnerProfileFormData>
): Promise<{ message: string; profile: OwnerProfile }> => {
  const response = await api.put("/owner/profile/me", data);
  return response.data;
};

export const changeMyOwnerPassword = async (
  data: UserPasswordFormData
): Promise<{ message: string }> => {
  const response = await api.put("/owner/profile/password", data);
  return response.data;
};
