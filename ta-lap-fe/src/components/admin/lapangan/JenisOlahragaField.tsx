"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formInputClass,
  formLabelClass,
  formSelectClass,
} from "@/components/admin/lapangan/formStyles";
import { formatJenisLabel } from "@/lib/jenis";
import { createJenisOlahraga, getJenisOlahraga } from "@/services/jenis.service";
import { JenisOlahraga } from "@/types/jenis";

const NEW_JENIS = "__new__";

type Props = {
  valueNama?: string | null;
  valueId?: number | null;
  onChange: (payload: { jenis_id?: number; jenis?: string }) => void;
};

export default function JenisOlahragaField({
  valueNama,
  valueId,
  onChange,
}: Props) {
  const [list, setList] = useState<JenisOlahraga[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectValue, setSelectValue] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const loadList = async () => {
    setLoadingList(true);
    try {
      const res = await getJenisOlahraga();
      setList(res.data);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (valueId) {
      setSelectValue(String(valueId));
      setNewName("");
      return;
    }
    if (valueNama) {
      const match = list.find((item) => item.nama === valueNama);
      if (match) {
        setSelectValue(String(match.id));
      } else {
        setSelectValue(NEW_JENIS);
        setNewName(formatJenisLabel(valueNama));
      }
    }
  }, [valueId, valueNama, list]);

  const handleSelect = (val: string) => {
    setSelectValue(val);
    setError("");
    if (val === NEW_JENIS) {
      onChange({ jenis: newName.trim() || undefined });
      return;
    }
    if (val) {
      onChange({ jenis_id: Number(val) });
    }
  };

  const handleNewNameChange = (val: string) => {
    setNewName(val);
    onChange({ jenis: val.trim() });
  };

  const handleAddJenis = async () => {
    const trimmed = newName.trim();
    if (trimmed.length < 2) {
      setError("Nama jenis minimal 2 karakter");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const result = await createJenisOlahraga(trimmed);
      await loadList();
      setSelectValue(String(result.data.id));
      onChange({ jenis_id: result.data.id });
      setNewName("");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menambah jenis";
      setError(message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className={formLabelClass}>Jenis Olahraga</label>
        {loadingList ? (
          <div className="flex items-center gap-2 py-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Memuat jenis olahraga...
          </div>
        ) : (
          <select
            value={selectValue}
            onChange={(e) => handleSelect(e.target.value)}
            className={formSelectClass}
          >
            <option value="">Pilih jenis...</option>
            {list.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label || formatJenisLabel(item.nama)}
              </option>
            ))}
            <option value={NEW_JENIS}>+ Tambah jenis baru...</option>
          </select>
        )}
      </div>

      {selectValue === NEW_JENIS && (
        <div className="rounded-lg border border-dashed border-cyan-200 bg-cyan-50/50 p-3 dark:border-cyan-500/20 dark:bg-cyan-500/5">
          <label className={formLabelClass}>Nama jenis baru</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => handleNewNameChange(e.target.value)}
              placeholder="Contoh: Tenis Meja, Basket, Voli"
              className={formInputClass}
            />
            <button
              type="button"
              onClick={handleAddJenis}
              disabled={adding}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {adding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Simpan
            </button>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Jenis tersimpan untuk semua owner — bisa dipakai ulang saat daftar
            lapangan lain.
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
