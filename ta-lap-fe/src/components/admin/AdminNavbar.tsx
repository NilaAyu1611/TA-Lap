// "use client";

// import Link from "next/link";

// import {
//   Bell,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   Receipt,
//   Shield,
//   Users,
//   Wallet,
//   MapPinned,
//   Settings,
//   X,
// } from "lucide-react";

// import { useState } from "react";

// import ThemeToggle from "@/components/ThemeToggle";

// export default function AdminNavbar() {
//   const [mobileMenu, setMobileMenu] = useState(false);

//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-50

//         border-b
//         border-gray-200/70
//         dark:border-white/10

//         bg-white/80
//         dark:bg-[#020817]/80

//         backdrop-blur-xl
//       "
//     >
//       <div
//         className="
//           mx-auto
//           flex
//           h-20
//           max-w-7xl
//           items-center
//           justify-between

//           px-6
//         "
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-12">
//           {/* LOGO */}
//           <div>
//             <h1
//               className="
//                 bg-gradient-to-r
//                 from-cyan-500
//                 to-blue-500

//                 bg-clip-text
//                 text-2xl
//                 font-black
//                 tracking-tight
//                 text-transparent
//               "
//             >
//               TA-LAP ADMIN
//             </h1>

//             <p
//               className="
//                 text-xs
//                 text-gray-500
//                 dark:text-gray-400
//               "
//             >
//               System Management
//             </p>
//           </div>

//           {/* DESKTOP MENU */}
//           <nav className="hidden lg:flex items-center gap-8">
//             <Link
//               href="/admin/dashboard"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <LayoutDashboard size={18} />
//               Dashboard
//             </Link>

//             <Link
//               href="/admin/users"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <Users size={18} />
//               Users
//             </Link>

//             <Link
//               href="/admin/owners"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <Shield size={18} />
//               Owners
//             </Link>

//             <Link
//               href="/admin/lapangan"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <MapPinned size={18} />
//               Lapangan
//             </Link>

//             <Link
//               href="/admin/transaksi"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <Wallet size={18} />
//               Transaksi
//             </Link>

//             <Link
//               href="/admin/laporan"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <Receipt size={18} />
//               Laporan
//             </Link>

//             <Link
//               href="/admin/settings"
//               className="
//                 flex
//                 items-center
//                 gap-2

//                 text-sm
//                 font-medium

//                 hover:text-cyan-500
//                 transition
//               "
//             >
//               <Settings size={18} />
//               Settings
//             </Link>
//           </nav>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           <ThemeToggle />

//           {/* NOTIF */}
//           <button
//             className="
//               relative
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10
//             "
//           >
//             <Bell size={18} />

//             <span
//               className="
//                 absolute
//                 right-2
//                 top-2

//                 h-2
//                 w-2

//                 rounded-full
//                 bg-red-500
//               "
//             />
//           </button>

//           {/* LOGOUT */}
//           <button
//             className="
//               hidden
//               md:flex

//               items-center
//               gap-2

//               rounded-2xl

//               border
//               border-gray-300
//               dark:border-white/10

//               px-4
//               py-2.5

//               text-sm
//               font-medium

//               transition

//               hover:border-red-500
//               hover:text-red-500
//             "
//           >
//             <LogOut size={18} />
//             Logout
//           </button>

//           {/* MOBILE BUTTON */}
//           <button
//             onClick={() => setMobileMenu(!mobileMenu)}
//             className="
//               flex
//               lg:hidden

//               h-11
//               w-11

//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10
//             "
//           >
//             {mobileMenu ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {mobileMenu && (
//         <div
//           className="
//             border-t
//             border-gray-200
//             dark:border-white/10

//             bg-white
//             dark:bg-[#020817]

//             px-6
//             py-5

//             lg:hidden
//           "
//         >
//           <div className="flex flex-col gap-5">
//             <Link href="/admin/dashboard">Dashboard</Link>
//             <Link href="/admin/users">Users</Link>
//             <Link href="/admin/owners">Owners</Link>
//             <Link href="/admin/lapangan">Lapangan</Link>
//             <Link href="/admin/transaksi">Transaksi</Link>
//             <Link href="/admin/laporan">Laporan</Link>
//             <Link href="/admin/settings">Settings</Link>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }










// "use client";

// import {
//   Bell,
//   Menu,
//   Search,
// } from "lucide-react";

// import ThemeToggle from "@/components/ThemeToggle";

// export default function AdminNavbar({
//   sidebarOpen,
//   setSidebarOpen,
// }: any) {
//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-50

//         border-b
//         border-gray-200/70
//         dark:border-white/10

//         bg-white/80
//         dark:bg-[#020817]/80

//         backdrop-blur-xl
//       "
//     >
//       <div
//         className="
//           flex
//           h-20
//           items-center
//           justify-between

//           px-6
//         "
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               lg:hidden
//             "
//           >
//             <Menu size={20} />
//           </button>

//           <div>
//             <h1
//               className="
//                 text-2xl
//                 font-black
//                 tracking-tight
//                 text-cyan-500
//               "
//             >
//               TA-LAP ADMIN
//             </h1>

//             <p
//               className="
//                 text-xs
//                 text-gray-500
//                 dark:text-gray-400
//               "
//             >
//               Management System
//             </p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           {/* SEARCH */}
//           <div
//             className="
//               hidden
//               md:flex
//               items-center
//               gap-3

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               px-4
//               py-3
//             "
//           >
//             <Search
//               size={18}
//               className="text-gray-400"
//             />

//             <input
//               type="text"
//               placeholder="Search..."
//               className="
//                 bg-transparent
//                 outline-none
//                 text-sm
//               "
//             />
//           </div>

//           <ThemeToggle />

//           {/* NOTIF */}
//           <button
//             className="
//               relative
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10
//             "
//           >
//             <Bell size={18} />

//             <span
//               className="
//                 absolute
//                 right-2
//                 top-2

//                 h-2
//                 w-2

//                 rounded-full
//                 bg-red-500
//               "
//             />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }












// "use client";

// import Link from "next/link";

// import {
//   Bell,
//   Menu,
//   Search,
//   Settings,
// } from "lucide-react";

// import ThemeToggle from "@/components/ThemeToggle";

// interface AdminNavbarProps {
//   setMobileOpen: (value: boolean) => void;
// }

// export default function AdminNavbar({
//   setMobileOpen,
// }: AdminNavbarProps) {
//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-30

//         border-b
//         border-gray-200
//         dark:border-white/10

//         bg-white/80
//         dark:bg-[#020817]/80

//         backdrop-blur-xl
//       "
//     >
//       <div
//         className="
//           flex
//           items-center
//           justify-between

//           gap-4

//           px-4
//           py-4

//           md:px-6
//         "
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-3">
//           {/* MOBILE MENU */}
//           <button
//             onClick={() => setMobileOpen(true)}
//             className="
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               lg:hidden
//             "
//           >
//             <Menu size={20} />
//           </button>

//           {/* TITLE */}
//           <div>
//             <h1
//               className="
//                 text-xl
//                 font-black
//                 text-cyan-500

//                 md:text-2xl
//               "
//             >
//               TA-LAP ADMIN
//             </h1>

//             <p
//               className="
//                 text-xs
//                 text-gray-500
//                 dark:text-gray-400

//                 md:text-sm
//               "
//             >
//               Management System
//             </p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           {/* SEARCH */}
//           <div
//             className="
//               hidden
//               items-center
//               gap-3

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               px-4
//               py-3

//               xl:flex
//               xl:w-[320px]
//             "
//           >
//             <Search
//               size={18}
//               className="text-gray-400"
//             />

//             <input
//               type="text"
//               placeholder="Search..."
//               className="
//                 w-full
//                 bg-transparent
//                 outline-none

//                 placeholder:text-gray-400
//               "
//             />
//           </div>

//           <ThemeToggle />

//           {/* SETTINGS */}
//           <Link
//             href="/admin/settings"
//             className="
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               transition-all

//               hover:border-cyan-500
//               hover:text-cyan-500
//             "
//           >
//             <Settings size={20} />
//           </Link>

//           {/* NOTIFICATION */}
//           <button
//             className="
//               relative

//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5
//             "
//           >
//             <Bell size={20} />

//             <span
//               className="
//                 absolute
//                 right-3
//                 top-3

//                 h-2
//                 w-2

//                 rounded-full
//                 bg-red-500
//               "
//             />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }



// "use client";

// import Link from "next/link";

// import {
//   Bell,
//   Menu,
//   Search,
//   Settings,
// } from "lucide-react";

// import ThemeToggle from "@/components/ThemeToggle";

// interface AdminNavbarProps {
//   setMobileOpen: (value: boolean) => void;
// }

// export default function AdminNavbar({
//   setMobileOpen,
// }: AdminNavbarProps) {
//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-30

//         border-b
//         border-gray-200
//         dark:border-white/10

//         bg-white/80
//         dark:bg-[#020817]/80

//         backdrop-blur-xl
//       "
//     >
//       <div
//         className="
//           flex
//           items-center
//           justify-between

//           gap-4

//           px-4
//           py-4

//           md:px-6
//         "
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-4">
//           {/* MOBILE MENU */}
//           <button
//             onClick={() => setMobileOpen(true)}
//             className="
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               lg:hidden
//             "
//           >
//             <Menu size={20} />
//           </button>

//           {/* TITLE */}
//           <div>
//             <h1
//               className="
//                 text-2xl
//                 font-black
//                 text-cyan-500
//               "
//             >
//               TA-LAP ADMIN
//             </h1>

//             <p
//               className="
//                 text-sm
//                 text-gray-500
//                 dark:text-gray-400
//               "
//             >
//               Management System
//             </p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           {/* SEARCH */}
//           <div
//             className="
//               hidden
//               items-center
//               gap-3

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               px-4
//               py-3

//               md:flex
//               md:w-[320px]
//             "
//           >
//             <Search
//               size={18}
//               className="text-gray-400"
//             />

//             <input
//               type="text"
//               placeholder="Search..."
//               className="
//                 w-full
//                 bg-transparent
//                 outline-none

//                 placeholder:text-gray-400
//               "
//             />
//           </div>

//           {/* THEME */}
//           <ThemeToggle />

//           {/* SETTINGS */}
//           <Link
//             href="/admin/settings"
//             className="
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               transition-all
//               duration-300

//               hover:border-cyan-500
//               hover:text-cyan-500
//             "
//           >
//             <Settings size={20} />
//           </Link>

//           {/* NOTIFICATION */}
//           <button
//             className="
//               relative

//               flex
//               h-11
//               w-11
//               items-center
//               justify-center

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5
//             "
//           >
//             <Bell size={20} />

//             <span
//               className="
//                 absolute
//                 right-3
//                 top-3

//                 h-2
//                 w-2

//                 rounded-full
//                 bg-red-500
//               "
//             />
//           </button>

//           {/* PROFILE */}
//           <button
//             className="
//               hidden
//               items-center
//               gap-3

//               rounded-2xl

//               border
//               border-gray-200
//               dark:border-white/10

//               bg-white
//               dark:bg-white/5

//               px-4
//               py-2

//               lg:flex
//             "
//           >
//             <div
//               className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center

//                 rounded-xl

//                 bg-cyan-500/10

//                 font-bold
//                 text-cyan-500
//               "
//             >
//               A
//             </div>

//             <div className="text-left">
//               <p className="text-sm font-semibold">
//                 Admin
//               </p>

//               <p
//                 className="
//                   text-xs
//                   text-gray-500
//                   dark:text-gray-400
//                 "
//               >
//                 Super Admin
//               </p>
//             </div>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }





"use client";

import Link from "next/link";

import {
  Bell,
  Menu,
  Search,
  Settings,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

interface AdminNavbarProps {
  setMobileOpen: (value: boolean) => void;
}

export default function AdminNavbar({
  setMobileOpen,
}: AdminNavbarProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-30

        border-b
        border-gray-200
        dark:border-white/10

        bg-white/80
        dark:bg-[#020817]/80

        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between

          gap-4

          px-4
          py-4

          md:px-6
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileOpen(true)}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              lg:hidden
            "
          >
            <Menu size={20} />
          </button>

          {/* TITLE */}
          <div>
            <h1
              className="
                text-xl
                font-black

                text-cyan-500

                md:text-2xl
              "
            >
              TA-LAP ADMIN
            </h1>

            <p
              className="
                hidden
                text-sm

                text-gray-500
                dark:text-gray-400

                sm:block
              "
            >
              Management System
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* SEARCH */}
          <div
            className="
              hidden
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

              xl:flex
              xl:w-[320px]
            "
          >
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                bg-transparent
                outline-none
              "
            />
          </div>

          {/* THEME */}
          <ThemeToggle />

          {/* SETTINGS */}
          <Link
            href="/admin/settings"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5
            "
          >
            <Settings size={20} />
          </Link>

          {/* NOTIFICATION */}
          <button
            className="
              relative

              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5
            "
          >
            <Bell size={20} />

            <span
              className="
                absolute
                right-3
                top-3

                h-2
                w-2

                rounded-full
                bg-red-500
              "
            />
          </button>

          {/* PROFILE */}
          <button
            className="
              hidden
              items-center
              gap-3

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              px-4
              py-2

              lg:flex
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-cyan-500/10

                font-bold
                text-cyan-500
              "
            >
              A
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">
                Admin
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Super Admin
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}