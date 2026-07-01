export interface JenisOlahraga {
  id: number;
  nama: string;
  label: string;
  icon: string | null;
  totalLapangan?: number;
  created_at?: string;
}

export interface JenisOlahragaFormValue {
  jenis_id?: number;
  jenis?: string;
}
