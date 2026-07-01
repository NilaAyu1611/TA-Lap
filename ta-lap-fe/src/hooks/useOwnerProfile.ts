import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import {
  changeMyOwnerPassword,
  getMyOwnerProfile,
  updateMyOwnerProfile,
} from "@/services/ownerProfile.service";
import {
  OwnerProfile,
  OwnerProfileFormData,
} from "@/types/ownerProfile";
import { UserPasswordFormData } from "@/types/userProfile";
import { getStoredUser, storeUser } from "@/lib/auth";

export function useOwnerProfile() {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyOwnerProfile();
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

  const saveProfile = async (form: OwnerProfileFormData) => {
    setSaving(true);
    try {
      const result = await updateMyOwnerProfile(form);
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
      const result = await changeMyOwnerPassword(form);
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
