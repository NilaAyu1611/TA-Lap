import { useCallback, useEffect, useState } from "react";
import {
  approveOwner,
  createOwner,
  deleteOwner,
  getOwners,
  rejectOwner,
  updateOwner,
} from "@/services/owner.service";
import { Owner, OwnerFormData, OwnerStats } from "@/types/owner";

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [stats, setStats] = useState<OwnerStats>({
    total: 0,
    active: 0,
    pending: 0,
    blocked: 0,
    pendingReview: 0,
    totalVenues: 0,
    sudahLaku: 0,
    belumLaku: 0,
    tanpaLapangan: 0,
  });

  const loadOwners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getOwners();
      setOwners(result.data);
      setStats(result.stats);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memuat data owner";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwners();
  }, [loadOwners]);

  const handleCreate = async (data: OwnerFormData) => {
    setActionLoading(true);
    try {
      await createOwner(data);
      await loadOwners();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<OwnerFormData>) => {
    setActionLoading(true);
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      await updateOwner(id, payload);
      await loadOwners();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      await deleteOwner(id);
      await loadOwners();
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (id: string, notes?: string) => {
    setActionLoading(true);
    try {
      const result = await approveOwner(id, notes);
      await loadOwners();
      return result;
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string, notes: string) => {
    setActionLoading(true);
    try {
      const result = await rejectOwner(id, notes);
      await loadOwners();
      return result;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    owners,
    stats,
    loading,
    error,
    actionLoading,
    reload: loadOwners,
    createOwner: handleCreate,
    updateOwner: handleUpdate,
    deleteOwner: handleDelete,
    approveOwner: handleApprove,
    rejectOwner: handleReject,
  };
}
