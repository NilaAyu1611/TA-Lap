"use client";

import {
  BadgeCheck,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  User2,
  Wallet,
  X,
} from "lucide-react";
import { User } from "@/types/user";
import UserStatusBadge from "./UserStatusBadge";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onEdit: (user: User) => void;
};

export default function UserDetailModal({
  open,
  user,
  onClose,
  onEdit,
}: Props) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-[28px] border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-500">
              Detail User
            </p>
            <h2 className="mt-2 text-2xl font-black">{user.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 p-2 transition hover:border-cyan-500 dark:border-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-cyan-500/10">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-3xl object-cover"
              />
            ) : (
              <User2 size={40} className="text-cyan-500" />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <UserStatusBadge status={user.status} />

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem
                icon={Phone}
                label="Telepon"
                value={user.phone || "-"}
              />
              <InfoItem icon={MapPin} label="Kota" value={user.city || "-"} />
              <InfoItem
                icon={CalendarDays}
                label="Bergabung"
                value={new Date(user.joined).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
            <div className="flex items-center gap-3 text-purple-500">
              <BadgeCheck size={20} />
              <span className="text-sm font-medium">Total Booking</span>
            </div>
            <p className="mt-3 text-3xl font-black">{user.totalBooking}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
            <div className="flex items-center gap-3 text-green-500">
              <Wallet size={20} />
              <span className="text-sm font-medium">Total Pembayaran</span>
            </div>
            <p className="mt-3 text-3xl font-black">
              Rp {user.totalPayment.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 dark:border-white/10"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            className="flex-1 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Icon size={16} />
        {label}
      </div>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
