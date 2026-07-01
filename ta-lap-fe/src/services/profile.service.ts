import api from "@/lib/api";
import {
  UserPasswordFormData,
  UserProfile,
  UserProfileFormData,
  UserProfileResponse,
} from "@/types/userProfile";

export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const response = await api.get("/profile/me");
  return response.data;
};

export const updateMyProfile = async (
  data: Partial<UserProfileFormData>
): Promise<{ message: string; profile: UserProfile }> => {
  const response = await api.put("/profile/me", data);
  return response.data;
};

export const changeMyPassword = async (
  data: UserPasswordFormData
): Promise<{ message: string }> => {
  const response = await api.put("/profile/password", data);
  return response.data;
};
