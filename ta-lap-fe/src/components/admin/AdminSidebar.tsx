// "use client";

// import Link from "next/link";

// import {
//   CalendarDays,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard,
//   FileBarChart2,
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   ShieldCheck,
//   Store,
//   Users,
//   X,
// } from "lucide-react";

// import { usePathname } from "next/navigation";

// interface AdminSidebarProps {
//   collapsed: boolean;
//   setCollapsed: (value: boolean) => void;

//   mobileOpen: boolean;
//   setMobileOpen: (value: boolean) => void;
// }

// export default function AdminSidebar({
//   collapsed,
//   setCollapsed,
//   mobileOpen,
//   setMobileOpen,
// }: AdminSidebarProps) {
//   const pathname = usePathname();

//   const menus = [
//     {
//       name: "Dashboard",
//       icon: <LayoutDashboard size={20} />,
//       href: "/admin/dashboard",
//     },
//     {
//       name: "Users",
//       icon: <Users size={20} />,
//       href: "/admin/users",
//     },
//     {
//       name: "Owners",
//       icon: <ShieldCheck size={20} />,
//       href: "/admin/owners",
//     },
//     {
//       name: "Lapangan",
//       icon: <Store size={20} />,
//       href: "/admin/lapangan",
//     },
//     {
//       name: "Pesanan",
//       icon: <CalendarDays size={20} />,
//       href: "/admin/pesanan",
//     },
//     {
//       name: "Transaksi",
//       icon: <CreditCard size={20} />,
//       href: "/admin/transaksi",
//     },
//     {
//       name: "Laporan",
//       icon: <FileBarChart2 size={20} />,
//       href: "/admin/laporan",
//     },
//     {
//       name: "Settings",
//       icon: <Settings size={20} />,
//       href: "/admin/settings",
//     },
//   ];

//   return (
//     <>
//       {/* MOBILE OVERLAY */}
//       {mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           className="
//             fixed
//             inset-0
//             z-40
//             bg-black/50

//             lg:hidden
//           "
//         />
//       )}

//       <aside
//         className={`
//           fixed
//           left-0
//           top-0
//           z-50

//           h-screen

//           border-r
//           border-gray-200
//           dark:border-white/10

//           bg-white
//           dark:bg-[#020817]

//           transition-all
//           duration-300

//           ${
//             collapsed
//               ? "lg:w-[90px]"
//               : "lg:w-[280px]"
//           }

//           w-[280px]

//           ${
//             mobileOpen
//               ? "translate-x-0"
//               : "-translate-x-full lg:translate-x-0"
//           }
//         `}
//       >
//         <div className="flex h-full flex-col">
//           {/* HEADER */}
//           <div
//             className="
//               flex
//               items-center
//               justify-between

//               border-b
//               border-gray-200
//               dark:border-white/10

//               p-6
//             "
//           >
//             {!collapsed && (
//               <div>
//                 <h2
//                   className="
//                     text-xl
//                     font-black
//                     text-cyan-500
//                   "
//                 >
//                   ADMIN PANEL
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   Super Management
//                 </p>
//               </div>
//             )}

//             {/* DESKTOP TOGGLE */}
//             <button
//               onClick={() =>
//                 setCollapsed(!collapsed)
//               }
//               className="
//                 hidden
//                 lg:flex

//                 h-11
//                 w-11

//                 items-center
//                 justify-center

//                 rounded-2xl

//                 border
//                 border-gray-200
//                 dark:border-white/10
//               "
//             >
//               {collapsed ? (
//                 <ChevronRight size={20} />
//               ) : (
//                 <ChevronLeft size={20} />
//               )}
//             </button>

//             {/* MOBILE CLOSE */}
//             <button
//               onClick={() =>
//                 setMobileOpen(false)
//               }
//               className="lg:hidden"
//             >
//               <X />
//             </button>
//           </div>

//           {/* MENUS */}
//           <div className="flex-1 space-y-2 p-4">
//             {menus.map((item, index) => (
//               <Link
//                 key={index}
//                 href={item.href}
//                 onClick={() =>
//                   setMobileOpen(false)
//                 }
//                 className={`
//                   flex
//                   items-center

//                   ${
//                     collapsed
//                       ? "lg:justify-center"
//                       : "gap-3"
//                   }

//                   rounded-2xl

//                   px-4
//                   py-3

//                   transition-all

//                   ${
//                     pathname === item.href
//                       ? `
//                         bg-cyan-500
//                         text-white
//                       `
//                       : `
//                         text-gray-600
//                         dark:text-gray-300

//                         hover:bg-cyan-500/10
//                         hover:text-cyan-500
//                       `
//                   }
//                 `}
//               >
//                 {item.icon}

//                 {!collapsed && (
//                   <span>{item.name}</span>
//                 )}
//               </Link>
//             ))}
//           </div>

//           {/* LOGOUT */}
//           <div className="p-4">
//             <button
//               className="
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-3

//                 rounded-2xl

//                 border
//                 border-red-500/30

//                 px-4
//                 py-3

//                 text-red-500
//               "
//             >
//               <LogOut size={18} />

//               {!collapsed && "Logout"}
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }




"use client";

import Link from "next/link";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileBarChart2,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Store,
  Users,
  X,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { handleLogout } from "@/lib/auth";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;

  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      href: "/admin/users",
    },
    {
      name: "Owners",
      icon: <ShieldCheck size={20} />,
      href: "/admin/owners",
    },
    {
      name: "Lapangan",
      icon: <Store size={20} />,
      href: "/admin/lapangan",
    },
    {
      name: "Pesanan",
      icon: <CalendarDays size={20} />,
      href: "/admin/pesanan",
    },
    {
      name: "Transaksi",
      icon: <CreditCard size={20} />,
      href: "/admin/transaksi",
    },
    {
      name: "Laporan",
      icon: <FileBarChart2 size={20} />,
      href: "/admin/laporan",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      href: "/admin/settings",
    },
  ];

  return (
    <>
      {/* OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/50

            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50

          h-screen

          border-r
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#020817]

          transition-all
          duration-300

          ${
            collapsed
              ? "lg:w-[90px]"
              : "lg:w-[280px]"
          }

          w-[280px]

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div
            className="
              flex
              items-center
              justify-between

              border-b
              border-gray-200
              dark:border-white/10

              p-6
            "
          >
            {/* LOGO */}
            <div
              className={`
                overflow-hidden
                transition-all
                duration-300

                ${
                  collapsed
                    ? "lg:w-0 lg:opacity-0"
                    : "w-auto opacity-100"
                }
              `}
            >
              <h2
                className="
                  whitespace-nowrap
                  text-xl
                  font-black
                  text-cyan-500
                "
              >
                ADMIN PANEL
              </h2>

              <p
                className="
                  whitespace-nowrap
                  text-sm
                  text-gray-500
                "
              >
                Super Management
              </p>
            </div>

            {/* DESKTOP TOGGLE */}
            <button
              onClick={() =>
                setCollapsed(!collapsed)
              }
              className="
                hidden
                lg:flex

                h-11
                w-11

                items-center
                justify-center

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10
              "
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>

            {/* MOBILE CLOSE */}
            <button
              onClick={() =>
                setMobileOpen(false)
              }
              className="lg:hidden"
            >
              <X size={22} />
            </button>
          </div>

          {/* MENUS */}
          <div
            className="
              flex-1
              space-y-2
              overflow-y-auto

              p-4
            "
          >
            {menus.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`
                  flex
                  items-center

                  rounded-2xl

                  py-3

                  transition-all
                  duration-300

                  ${
                    collapsed
                      ? "lg:justify-center lg:px-0 px-4 gap-3"
                      : "gap-3 px-4"
                  }

                  ${
                    pathname === item.href
                      ? `
                        bg-cyan-500
                        text-white
                      `
                      : `
                        text-gray-600
                        dark:text-gray-300

                        hover:bg-cyan-500/10
                        hover:text-cyan-500
                      `
                  }
                `}
              >
                {item.icon}

                {/* TEXT */}
                <span
                  className={`
                    whitespace-nowrap

                    ${
                      collapsed
                        ? "lg:hidden"
                        : "block"
                    }
                  `}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* LOGOUT */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                justify-center

                rounded-2xl

                border
                border-red-500/30

                px-4
                py-3

                text-red-500

                transition-all
                duration-300

                hover:bg-red-500
                hover:text-white
              "
            >
              <LogOut size={18} />

              <span
                className={`
                  ml-2

                  ${
                    collapsed
                      ? "lg:hidden"
                      : "block"
                  }
                `}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}