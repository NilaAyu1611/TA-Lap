export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatar: string | null;
  role: string;
  status: string;
  email_verified: boolean;
  joined: string;
  created_at: string;
  updated_at: string;
  totalBooking: number;
  totalSpending: number;
  lastLogin: {
    created_at: string;
    ip_address: string | null;
    device: string | null;
  } | null;
}

export interface UserProfileFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
}

export interface UserPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfileResponse {
  data: UserProfile;
}
