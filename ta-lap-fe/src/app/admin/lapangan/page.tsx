"use client";

import {
  Building2,
  CheckCircle2,
  MapPinned,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Store,
  Users,
  XCircle,
} from "lucide-react";

const lapanganData = [
  {
    id: 1,
    name: "Futsal Arena Elite",
    owner: "Ahmad Sport Center",
    location: "Depok, Jawa Barat",
    category: "Futsal",
    status: "active",
    rating: 4.9,
    bookings: 245,
  },
  {
    id: 2,
    name: "Badminton Hall Pro",
    owner: "Rizky Arena",
    location: "Jakarta Selatan",
    category: "Badminton",
    status: "pending",
    rating: 4.7,
    bookings: 182,
  },
  {
    id: 3,
    name: "Mini Soccer Prime",
    owner: "Elite Stadium",
    location: "Bandung",
    category: "Mini Soccer",
    status: "blocked",
    rating: 4.5,
    bookings: 98,
  },
];

export default function AdminLapanganPage() {
  return (
    <div>
      {/* HERO */}
      <div
        className="
          relative
          overflow-hidden

          rounded-[32px]

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-white/5

          p-8
          md:p-10
        "
      >
        {/* GLOW */}
        <div
          className="
            absolute
            right-[-100px]
            top-[-100px]

            h-72
            w-72

            rounded-full

            bg-cyan-500/10

            blur-3xl
          "
        />

        <div className="relative z-10">
          <div
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              bg-cyan-500/10

              px-4
              py-2

              text-sm
              font-semibold
              text-cyan-500
            "
          >
            <Store size={16} />
            ADMIN LAPANGAN
          </div>

          <h1
            className="
              mt-6

              text-4xl
              font-black
              tracking-tight

              md:text-5xl
            "
          >
            Kelola Semua Lapangan
          </h1>

          <p
            className="
              mt-5
              max-w-3xl

              text-base
              leading-8

              text-gray-600
              dark:text-gray-300
            "
          >
            Monitoring seluruh venue, owner lapangan,
            status lapangan, performa booking,
            dan validasi venue secara realtime.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          mt-10

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
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Total Lapangan
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                245
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-cyan-500/10
              "
            >
              <Building2 className="text-cyan-500" />
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
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Venue Aktif
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                212
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
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
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Pending Review
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                18
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
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
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Owner Aktif
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                89
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-purple-500/10
              "
            >
              <Users className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div
        className="
          mt-10

          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-center
          lg:justify-between
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

            px-4
            py-3

            lg:w-[350px]
          "
        >
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari lapangan..."
            className="
              w-full
              bg-transparent
              outline-none

              placeholder:text-gray-400
            "
          />
        </div>

        {/* ACTION */}
        <button
          className="
            flex
            items-center
            gap-2

            rounded-2xl

            bg-cyan-500

            px-5
            py-3

            text-sm
            font-semibold
            text-white

            transition
            hover:bg-cyan-400
          "
        >
          <Plus size={18} />
          Tambah Lapangan
        </button>
      </div>

      {/* LIST */}
      <div
        className="
          mt-8

          grid
          gap-6
        "
      >
        {lapanganData.map((item) => (
          <div
            key={item.id}
            className="
              rounded-[28px]

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              p-6

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
                gap-6

                xl:flex-row
                xl:items-center
                xl:justify-between
              "
            >
              {/* LEFT */}
              <div className="flex gap-5">
                {/* ICON */}
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
                  <Store className="text-cyan-500" />
                </div>

                {/* INFO */}
                <div>
                  <h3
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    {item.name}
                  </h3>

                  <p
                    className="
                      mt-1

                      text-sm

                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Owner: {item.owner}
                  </p>

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
                        flex
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
                      <MapPinned size={16} />
                      {item.location}
                    </div>

                    <div
                      className="
                        rounded-xl

                        bg-gray-100
                        dark:bg-white/5

                        px-4
                        py-2

                        text-sm
                      "
                    >
                      {item.category}
                    </div>

                    <div
                      className="
                        flex
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
                      <Star
                        size={16}
                        className="text-yellow-500"
                      />
                      {item.rating}
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
                  gap-4

                  xl:items-end
                "
              >
                <div>
                  <h4
                    className="
                      text-3xl
                      font-black
                    "
                  >
                    {item.bookings}
                  </h4>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Total Booking
                  </p>
                </div>

                {/* STATUS */}
                {item.status === "active" && (
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
                    Active
                  </div>
                )}

                {item.status === "pending" && (
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

                {item.status === "blocked" && (
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
                    Blocked
                  </div>
                )}

                {/* BUTTON */}
                <div className="flex gap-3">
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

                      transition

                      hover:border-cyan-500
                    "
                  >
                    Detail
                  </button>

                  <button
                    className="
                      rounded-2xl

                      bg-cyan-500

                      px-5
                      py-3

                      text-sm
                      font-semibold
                      text-white

                      transition

                      hover:bg-cyan-400
                    "
                  >
                    Kelola
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