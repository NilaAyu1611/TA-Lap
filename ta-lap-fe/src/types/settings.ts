export interface PlatformSettings {
  id: number;
  app_name: string;
  app_email: string | null;
  app_phone: string | null;
  logo: string | null;
  favicon: string | null;
  komisi_persen: number;
  batal_potongan_persen: number;
  timezone: string;
  language: string;
  maintenance_mode: boolean;
  booking_notification: boolean;
  owner_notification: boolean;
  payment_notification: boolean;
  backup_notification: boolean;
  login_notification: boolean;
  auto_payout_enabled: boolean;
  platform_bank_code: string | null;
  platform_bank_account_number: string | null;
  platform_bank_account_holder: string | null;
  platform_ewallet_note: string | null;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatar: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  created_at: string;
  ip_address: string | null;
  device: string | null;
  activity_type: string | null;
}

export interface BackupLogEntry {
  id: string;
  file_name: string;
  size: string | null;
  status: "success" | "failed" | null;
  created_at: string;
}

export interface SettingsResponse {
  fetchedAt: string;
  sessionStartedAt: string | null;
  currentIp: string | null;
  settings: PlatformSettings;
  profile: AdminProfile;
  lastLogin: ActivityLogEntry | null;
  previousLogin: ActivityLogEntry | null;
  backups: BackupLogEntry[];
}

export interface SettingsFormData {
  app_name: string;
  app_email: string;
  app_phone: string;
  komisi_persen: number;
  batal_potongan_persen: number;
  timezone: string;
  language: string;
  maintenance_mode: boolean;
  booking_notification: boolean;
  owner_notification: boolean;
  payment_notification: boolean;
  backup_notification: boolean;
  login_notification: boolean;
  auto_payout_enabled: boolean;
  platform_bank_code: string;
  platform_bank_account_number: string;
  platform_bank_account_holder: string;
  platform_ewallet_note: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  city: string;
}
