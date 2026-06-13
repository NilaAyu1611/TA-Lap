import { useCallback, useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/services/user.service";
import { User, UserFormData, UserStats } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    pending: 0,
    blocked: 0,
    suspended: 0,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers();
      setUsers(result.data);
      setStats(result.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (data: UserFormData) => {
    setActionLoading(true);
    try {
      await createUser(data);
      await loadUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<UserFormData>) => {
    setActionLoading(true);
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      await updateUser(id, payload);
      await loadUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      await deleteUser(id);
      await loadUsers();
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    stats,
    loading,
    actionLoading,
    reload: loadUsers,
    createUser: handleCreate,
    updateUser: handleUpdate,
    deleteUser: handleDelete,
  };
}
