// "use client";

// import { useState } from "react";

// import AdminNavbar from "@/components/admin/AdminNavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div
//       className="
//         min-h-screen
//         bg-gray-50
//         text-gray-900

//         dark:bg-[#020817]
//         dark:text-white
//       "
//     >
//       {/* SIDEBAR */}
//       <AdminSidebar
//         sidebarOpen={sidebarOpen}
//       />

//       {/* CONTENT */}
//       <div
//         className={`
//           transition-all
//           duration-300

//           ${
//             sidebarOpen
//               ? "lg:ml-[280px]"
//               : "lg:ml-[90px]"
//           }
//         `}
//       >
//         {/* NAVBAR */}
//         <AdminNavbar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* PAGE */}
//         <main
//           className="
//             w-full
//             overflow-x-hidden

//             px-6
//             py-8
//           "
//         >
//           <div
//             className="
//               mx-auto
//               w-full
//               max-w-[1600px]
//             "
//           >
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useState } from "react";

// import AdminNavbar from "@/components/admin/AdminNavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] =
//     useState(true);

//   return (
//     <div
//       className="
//         flex
//         min-h-screen

//         bg-gray-100
//         text-gray-900

//         dark:bg-[#020817]
//         dark:text-white
//       "
//     >
//       {/* SIDEBAR */}
//       <AdminSidebar
//         sidebarOpen={sidebarOpen}
//       />

//       {/* RIGHT SIDE */}
//       <div
//         className="
//           flex
//           min-w-0
//           flex-1
//           flex-col
//         "
//       >
//         {/* NAVBAR */}
//         <AdminNavbar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* PAGE CONTENT */}
//         <main
//           className="
//             flex-1
//             overflow-x-hidden

//             px-4
//             py-6

//             sm:px-6
//             lg:px-8
//           "
//         >
//           <div
//             className="
//               mx-auto
//               w-full
//               max-w-[1700px]
//             "
//           >
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";

// import AdminNavbar from "@/components/admin/AdminNavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div
//       className="
//         min-h-screen
//         bg-gray-50
//         text-gray-900

//         dark:bg-[#020817]
//         dark:text-white
//       "
//     >
//       {/* SIDEBAR */}
//       <AdminSidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* CONTENT */}
//       <div
//         className={`
//           transition-all
//           duration-300

//           ${
//             sidebarOpen
//               ? "lg:ml-[280px]"
//               : "lg:ml-[90px]"
//           }
//         `}
//       >
//         {/* NAVBAR */}
//         <AdminNavbar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* PAGE */}
//         <main
//           className="
//             w-full
//             overflow-x-hidden

//             px-6
//             py-8
//           "
//         >
//           <div
//             className="
//               mx-auto
//               w-full
//               max-w-[1600px]
//             "
//           >
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";

// import AdminNavbar from "@/components/admin/AdminNavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   /* DESKTOP */
//   const [collapsed, setCollapsed] =
//     useState(false);

//   /* MOBILE */
//   const [mobileOpen, setMobileOpen] =
//     useState(false);

//   return (
//     <div
//       className="
//         min-h-screen
//         bg-gray-50
//         text-gray-900

//         dark:bg-[#020817]
//         dark:text-white
//       "
//     >
//       {/* SIDEBAR */}
//       <AdminSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         mobileOpen={mobileOpen}
//         setMobileOpen={setMobileOpen}
//       />

//       {/* CONTENT */}
//       <div
//         className={`
//           transition-all
//           duration-300

//           ${
//             collapsed
//               ? "lg:ml-[90px]"
//               : "lg:ml-[280px]"
//           }
//         `}
//       >
//         {/* NAVBAR */}
//         <AdminNavbar
//           setMobileOpen={setMobileOpen}
//         />

//         {/* PAGE */}
//         <main
//           className="
//             w-full
//             overflow-x-hidden

//             px-4
//             py-6

//             md:px-6
//             lg:px-8
//           "
//         >
//           <div
//             className="
//               mx-auto
//               w-full
//               max-w-[1600px]
//             "
//           >
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";

// import AdminNavbar from "@/components/admin/AdminNavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // DESKTOP COLLAPSE
//   const [collapsed, setCollapsed] =
//     useState(false);

//   // MOBILE SIDEBAR
//   const [mobileOpen, setMobileOpen] =
//     useState(false);

//   return (
//     <div
//       className="
//         min-h-screen
//         bg-gray-50
//         text-gray-900

//         dark:bg-[#020817]
//         dark:text-white
//       "
//     >
//       {/* SIDEBAR */}
//       <AdminSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         mobileOpen={mobileOpen}
//         setMobileOpen={setMobileOpen}
//       />

//       {/* CONTENT */}
//       <div
//         className={`
//           ml-0

//           transition-all
//           duration-300

//           ${
//             collapsed
//               ? "lg:ml-[90px]"
//               : "lg:ml-[280px]"
//           }
//         `}
//       >
//         {/* NAVBAR */}
//         <AdminNavbar
//           setMobileOpen={setMobileOpen}
//         />

//         {/* PAGE */}
//         <main
//           className="
//             w-full
//             overflow-x-hidden

//             px-4
//             py-6

//             md:px-6
//             lg:px-8
//           "
//         >
//           <div
//             className="
//               mx-auto
//               w-full
//               max-w-[1600px]
//             "
//           >
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DESKTOP SIDEBAR
  const [collapsed, setCollapsed] =
    useState(false);

  // MOBILE SIDEBAR
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        text-gray-900

        dark:bg-[#020817]
        dark:text-white
      "
    >
      {/* SIDEBAR */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* CONTENT */}
      <div
        className={`
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:ml-[90px]"
              : "lg:ml-[280px]"
          }
        `}
      >
        {/* NAVBAR */}
        <AdminNavbar
          setMobileOpen={setMobileOpen}
        />

        {/* PAGE */}
        <main
          className="
            w-full
            overflow-x-hidden

            p-4
            md:p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}