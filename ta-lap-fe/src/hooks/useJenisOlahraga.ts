import { useCallback, useEffect, useState } from "react";
import { createJenisOlahraga, getJenisOlahraga } from "@/services/jenis.service";
import { JenisOlahraga } from "@/types/jenis";

export function useJenisOlahraga() {
  const [items, setItems] = useState<JenisOlahraga[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getJenisOlahraga();
      setItems(result.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addJenis = async (nama: string) => {
    const result = await createJenisOlahraga(nama);
    await load();
    return result.data;
  };

  return { items, loading, reload: load, addJenis };
}
