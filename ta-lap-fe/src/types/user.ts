export type UserStatus = "active" | "pending" | "blocked" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatar: string | null;
  status: UserStatus;
  email_verified?: boolean;
  joined: string;
  totalBooking: number;
  totalPayment: number;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  blocked: number;
  suspended?: number;
}

export interface UserResponse {
  stats: UserStats;
  data: User[];
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  phone: string;
  city: string;
  status: UserStatus;
}
