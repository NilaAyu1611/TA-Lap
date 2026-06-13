/* =========================================================
   FILE:
   app/admin/owners/page.tsx
   ========================================================= */

"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  CheckCircle2,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Store,
  Trophy,
  User2,
  XCircle,
} from "lucide-react";
import { getOwners } from "@/services/owner.service";

type Owner = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  status: string;
};

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOwners();
        setOwners(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredOwners = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-10 text-center">Loading owners...</div>;
  }
  return (
    <div className="space-y-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div
        className="
          flex
          flex-col
          gap-5

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.2em]

              text-cyan-500
            "
          >
            Admin Owners
          </p>

          <h1
            className="
              mt-2

              text-4xl
              font-black
              tracking-tight
            "
          >
            Kelola Owner Venue
          </h1>

          <p
            className="
              mt-3
              max-w-3xl

              text-base
              leading-8

              text-gray-600
              dark:text-gray-400
            "
          >
            Monitoring seluruh owner lapangan, status venue,
            dan aktivitas bisnis secara realtime.
          </p>
        </div>

        {/* ACTION */}
        <button
          className="
            inline-flex
            items-center
            gap-3

            rounded-2xl

            bg-cyan-500

            px-6
            py-4

            text-sm
            font-semibold
            text-white

            shadow-lg
            shadow-cyan-500/20

            transition-all
            duration-300

            hover:scale-[1.02]
            hover:bg-cyan-400
          "
        >
          <Plus size={18} />
          Tambah Owner
        </button>
      </div>

      {/* =========================================================
          STATS
      ========================================================= */}
      <div
        className="
          grid
          gap-6

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6

            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Total Owner
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                152
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                bg-cyan-500/10
              "
            >
              <User2 className="text-cyan-500" />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6

            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Owner Aktif
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                132
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                bg-green-500/10
              "
            >
              <CheckCircle2 className="text-green-500" />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6

            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Pending Review
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                12
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                bg-yellow-500/10
              "
            >
              <ShieldCheck className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6

            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Venue Aktif
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                248
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                bg-purple-500/10
              "
            >
              <Building2 className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FILTER
      ========================================================= */}
      <div
        className="
          flex
          flex-col
          gap-4

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        {/* SEARCH */}
        <div
          className="
            flex
            items-center
            gap-3

            rounded-2xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            px-5
            py-4

            xl:w-[420px]
          "
        >
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari owner..."
            className="
              w-full
              bg-transparent
              outline-none

              placeholder:text-gray-400
            "
          />
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3">
          <button
            className="
              rounded-2xl

              bg-cyan-500

              px-5
              py-3

              text-sm
              font-semibold
              text-white
            "
          >
            Semua
          </button>

          <button
            className="
              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              px-5
              py-3

              text-sm
              font-medium
            "
          >
            Aktif
          </button>

          <button
            className="
              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              px-5
              py-3

              text-sm
              font-medium
            "
          >
            Pending
          </button>

          <button
            className="
              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              px-5
              py-3

              text-sm
              font-medium
            "
          >
            Diblokir
          </button>
        </div>
      </div>

      {/* =========================================================
          OWNER LIST
      ========================================================= */}
      <div className="grid gap-6">
        {filteredOwners.map((owner) => (
          <div
            key={owner.id}
            className="
              rounded-[30px]

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              p-7

              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-cyan-500/30
            "
          >
            <div
              className="
                flex
                flex-col
                gap-8

                xl:flex-row
                xl:items-center
                xl:justify-between
              "
            >
              {/* LEFT */}
              <div className="flex gap-5">
                {/* AVATAR */}
                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center

                    rounded-3xl

                    bg-cyan-500/10
                  "
                >
                  <User2
                    size={34}
                    className="text-cyan-500"
                  />
                </div>

                {/* INFO */}
                <div>
                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    {owner.name}
                  </h2>

                  <p
                    className="
                      mt-2

                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Owner Venue
                  </p>

                  {/* BADGES */}
                  <div
                    className="
                      mt-5

                      flex
                      flex-wrap
                      gap-3
                    "
                  >
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-gray-100
                        dark:bg-white/5

                        px-4
                        py-2

                        text-sm
                      "
                    >
                      <Mail size={16} />
                      {owner.email}
                    </div>

                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-gray-100
                        dark:bg-white/5

                        px-4
                        py-2

                        text-sm
                      "
                    >
                      <Phone size={16} />
                      {owner.phone}
                    </div>

                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-gray-100
                        dark:bg-white/5

                        px-4
                        py-2

                        text-sm
                      "
                    >
                      <MapPin size={16} />
                      {owner.city || "-"}
                    </div>
                  </div>

                  {/* VENUE */}
                  <div
                    className="
                      mt-5

                      flex
                      flex-wrap
                      gap-3
                    "
                  >
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-cyan-500/10

                        px-4
                        py-2

                        text-sm
                        font-semibold
                        text-cyan-500
                      "
                    >
                      <Store size={16} />
                      Owner Lapangan
                    </div>

                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-purple-500/10

                        px-4
                        py-2

                        text-sm
                        font-semibold
                        text-purple-500
                      "
                    >
                      <Trophy size={16} />
                      Owner Terdaftar
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div
                className="
                  flex
                  flex-col
                  items-start
                  gap-5

                  xl:items-end
                "
              >
                {/* STATUS */}
                {owner.status === "active" && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-full

                      bg-green-500/10

                      px-5
                      py-2

                      text-sm
                      font-semibold
                      text-green-500
                    "
                  >
                    <CheckCircle2 size={16} />
                    Aktif
                  </div>
                )}

                {owner.status === "pending" && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-full

                      bg-yellow-500/10

                      px-5
                      py-2

                      text-sm
                      font-semibold
                      text-yellow-500
                    "
                  >
                    <ShieldCheck size={16} />
                    Pending
                  </div>
                )}

                {owner.status === "blocked" && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-full

                      bg-red-500/10

                      px-5
                      py-2

                      text-sm
                      font-semibold
                      text-red-500
                    "
                  >
                    <XCircle size={16} />
                    Diblokir
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3">
                  <button
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-2xl

                      border
                      border-gray-300
                      dark:border-white/10

                      px-5
                      py-3

                      text-sm
                      font-medium

                      transition-all
                      duration-300

                      hover:border-cyan-500
                      hover:text-cyan-500
                    "
                  >
                    <Eye size={16} />
                    Detail
                  </button>

                  <button
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-2xl

                      bg-cyan-500

                      px-5
                      py-3

                      text-sm
                      font-semibold
                      text-white

                      transition-all
                      duration-300

                      hover:bg-cyan-400
                    "
                  >
                    <Building2 size={16} />
                    Kelola
                  </button>

                  <button
                    className="
                      flex
                      h-[50px]
                      w-[50px]
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-gray-300
                      dark:border-white/10

                      transition-all
                      duration-300

                      hover:border-cyan-500
                    "
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}