import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Eye,
  Mail,
  MapPin,
  Phone,
  User2,
  Wallet,
  XCircle,
  ShieldAlert,
} from "lucide-react";

import { User } from "@/types/user";

type Props = {
  user: User;

  onDetail: (
    user: User
  ) => void;

  onEdit: (
    user: User
  ) => void;

  onDelete: (
    user: User
  ) => void;
};

export default function UserCard({
  user,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-3xl border p-6">

      <h2 className="text-2xl font-bold">
        {user.name}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">

        <div>
          <Mail size={14} />
          {user.email}
        </div>

        <div>
          <Phone size={14} />
          {user.phone}
        </div>

        <div>
          <MapPin size={14} />
          {user.city}
        </div>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">

        <div>
          <CalendarDays size={14} />
          {new Date(
            user.joined
          ).toLocaleDateString("id-ID")}
        </div>

        <div>
          <BadgeCheck size={14} />
          {user.totalBooking}
        </div>

        <div>
          <Wallet size={14} />
          Rp
          {user.totalPayment.toLocaleString(
            "id-ID"
          )}
        </div>

      </div>

      <div className="mt-5">
        {user.status ===
          "active" && (
          <div className="text-green-500">
            <CheckCircle2 />
            Aktif
          </div>
        )}

        {user.status ===
          "pending" && (
          <div className="text-yellow-500">
            <ShieldAlert />
            Pending
          </div>
        )}

        {user.status ===
          "blocked" && (
          <div className="text-red-500">
            <XCircle />
            Diblokir
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">

        <button
          onClick={() =>
            onDetail(user)
          }
        >
          <Eye />
        </button>

        <button
          onClick={() =>
            onEdit(user)
          }
        >
          Edit
        </button>

        <button
          onClick={() =>
            onDelete(user)
          }
        >
          Delete
        </button>

      </div>

    </div>
  );
}