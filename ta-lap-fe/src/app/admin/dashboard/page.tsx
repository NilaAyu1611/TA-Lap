// import {
//   Building2,
//   CreditCard,
//   TrendingUp,
//   Users,
// } from "lucide-react";

// export default function AdminDashboardPage() {
//   return (
//     <div>
//       <div
//         className="
//           rounded-[32px]

//           border
//           border-gray-200
//           dark:border-white/10

//           bg-white
//           dark:bg-white/5

//           p-8
//         "
//       >
//         <p className="font-semibold text-cyan-500">
//           ADMIN DASHBOARD
//         </p>

//         <h1
//           className="
//             mt-4

//             text-5xl
//             font-black
//             tracking-tight
//           "
//         >
//           System Monitoring Center
//         </h1>

//         <p
//           className="
//             mt-5
//             max-w-3xl

//             leading-8

//             text-gray-600
//             dark:text-gray-300
//           "
//         >
//           Kelola seluruh user, owner, transaksi,
//           dan lapangan melalui panel admin.
//         </p>
//       </div>

//       {/* STATS */}
//       <div
//         className="
//           mt-10

//           grid
//           gap-6

//           md:grid-cols-2
//           xl:grid-cols-4
//         "
//       >
//         {[
//           {
//             title: "Total Users",
//             value: "2.421",
//             icon: <Users className="text-cyan-500" />,
//           },

//           {
//             title: "Total Owners",
//             value: "85",
//             icon: <Building2 className="text-purple-500" />,
//           },

//           {
//             title: "Total Transaksi",
//             value: "Rp 152jt",
//             icon: <CreditCard className="text-pink-500" />,
//           },

//           {
//             title: "Growth",
//             value: "+18%",
//             icon: <TrendingUp className="text-green-500" />,
//           },
//         ].map((item, index) => (
//           <div
//             key={index}
//             className="
//               rounded-3xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               p-6
//             "
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">
//                   {item.title}
//                 </p>

//                 <h3
//                   className="
//                     mt-3

//                     text-3xl
//                     font-black
//                   "
//                 >
//                   {item.value}
//                 </h3>
//               </div>

//               <div
//                 className="
//                   flex
//                   h-14
//                   w-14
//                   items-center
//                   justify-center

//                   rounded-2xl

//                   bg-gray-100
//                   dark:bg-white/10
//                 "
//               >
//                 {item.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// import {
//   CreditCard,
//   Store,
//   Users,
//   Wallet,
// } from "lucide-react";

// export default function AdminDashboardPage() {
//   return (
//     <div>
//       {/* HERO */}
//       <div
//         className="
//           rounded-[32px]

//           border
//           border-gray-200
//           dark:border-white/10

//           bg-white
//           dark:bg-white/5

//           p-8
//         "
//       >
//         <p
//           className="
//             text-sm
//             font-semibold
//             text-cyan-500
//           "
//         >
//           ADMIN DASHBOARD
//         </p>

//         <h1
//           className="
//             mt-4
//             text-4xl
//             font-black
//           "
//         >
//           Management Overview
//         </h1>

//         <p
//           className="
//             mt-4
//             max-w-3xl

//             text-gray-600
//             dark:text-gray-300
//           "
//         >
//           Kelola seluruh user, owner, transaksi,
//           pembayaran, dan monitoring sistem.
//         </p>
//       </div>

//       {/* STATS */}
//       <div
//         className="
//           mt-8

//           grid
//           gap-6

//           md:grid-cols-2
//           xl:grid-cols-4
//         "
//       >
//         {[
//           {
//             title: "Total Users",
//             value: "1,240",
//             icon: <Users className="text-cyan-500" />,
//           },
//           {
//             title: "Total Owners",
//             value: "120",
//             icon: <Store className="text-purple-500" />,
//           },
//           {
//             title: "Transactions",
//             value: "8,420",
//             icon: <CreditCard className="text-pink-500" />,
//           },
//           {
//             title: "Revenue",
//             value: "Rp 125jt",
//             icon: <Wallet className="text-green-500" />,
//           },
//         ].map((item, index) => (
//           <div
//             key={index}
//             className="
//               rounded-3xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               p-6
//             "
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p
//                   className="
//                     text-sm
//                     text-gray-500
//                   "
//                 >
//                   {item.title}
//                 </p>

//                 <h3
//                   className="
//                     mt-3
//                     text-3xl
//                     font-black
//                   "
//                 >
//                   {item.value}
//                 </h3>
//               </div>

//               <div
//                 className="
//                   flex
//                   h-14
//                   w-14
//                   items-center
//                   justify-center

//                   rounded-2xl

//                   bg-gray-100
//                   dark:bg-white/5
//                 "
//               >
//                 {item.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

import {
  CreditCard,
  Store,
  Users,
  Wallet,
} from "lucide-react";

import { getAdminDashboard } from "@/services/dashboard.service";

export default function AdminDashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [dashboard, setDashboard] =
    useState({
      totalUsers: 0,
      totalOwners: 0,
      totalBooking: 0,
      totalLapangan: 0,
      totalPemasukan: 0,
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data =
        await getAdminDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(
        "Gagal load dashboard",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <div
        className="
          rounded-[32px]
          border
          border-gray-200
          dark:border-white/10
          bg-white
          dark:bg-white/5
          p-8
        "
      >
        <p
          className="
            text-sm
            font-semibold
            text-cyan-500
          "
        >
          ADMIN DASHBOARD
        </p>

        <h1
          className="
            mt-4
            text-4xl
            font-black
          "
        >
          Management Overview
        </h1>

        <p
          className="
            mt-4
            max-w-3xl
            text-gray-600
            dark:text-gray-300
          "
        >
          Kelola seluruh user, owner,
          transaksi, pembayaran,
          dan monitoring sistem.
        </p>
      </div>

      {/* STATS */}
      <div
        className="
          mt-8
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {[
          {
            title: "Total Users",
            value:
              dashboard.totalUsers,
            icon: (
              <Users className="text-cyan-500" />
            ),
          },

          {
            title: "Total Owners",
            value:
              dashboard.totalOwners,
            icon: (
              <Store className="text-purple-500" />
            ),
          },

          {
            title: "Total Booking",
            value:
              dashboard.totalBooking,
            icon: (
              <CreditCard className="text-pink-500" />
            ),
          },

          {
            title: "Total Revenue",
            value: `Rp ${dashboard.totalPemasukan.toLocaleString(
              "id-ID"
            )}`,
            icon: (
              <Wallet className="text-green-500" />
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
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
                  {item.title}
                </p>

                <h3
                  className="
                    mt-3
                    text-3xl
                    font-black
                  "
                >
                  {item.value}
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
                  bg-gray-100
                  dark:bg-white/5
                "
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}