import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "@/services/profile.service";
import {
  UserPasswordFormData,
  UserProfile,
  UserProfileFormData,
} from "@/types/userProfile";
import { getStoredUser, storeUser } from "@/lib/auth";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyProfile();
      setProfile(result.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Gagal memuat profil"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = async (form: UserProfileFormData) => {
    setSaving(true);
    try {
      const result = await updateMyProfile(form);
      const stored = getStoredUser();
      if (stored) {
        storeUser({
          ...stored,
          name: result.profile.name,
          email: result.profile.email,
          phone: result.profile.phone || undefined,
          city: result.profile.city || undefined,
          avatar: result.profile.avatar || undefined,
        });
      }
      await load();
      return result.message;
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (form: UserPasswordFormData) => {
    setSaving(true);
    try {
      const result = await changeMyPassword(form);
      return result.message;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    reload: load,
    saveProfile,
    savePassword,
  };
}
