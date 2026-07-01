export type SlotStatus = "available" | "booked" | "past";

export interface LapanganTimeSlot {
  jam_mulai: string;
  jam_selesai: string;
  status: SlotStatus;
}

export interface LapanganBookedSlot {
  id: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
  kode_booking: string;
}

export interface LapanganAvailability {
  date: string;
  jam_buka: string;
  jam_tutup: string;
  slots: LapanganTimeSlot[];
  booked: LapanganBookedSlot[];
  total_booked: number;
  total_available: number;
}
