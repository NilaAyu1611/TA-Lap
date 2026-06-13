// "use client";

// import { useState } from "react";

// import AdminNavbar from "./AdminNavbar";
// import AdminSidebar from "./AdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <main
//       className="
//         min-h-screen
//         bg-gray-50
//         dark:bg-[#020817]
//         text-gray-900
//         dark:text-white
//       "
//     >
//       {/* BACKGROUND */}
//       <div
//         className="
//           fixed
//           inset-0
//           -z-10
//           bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_25%)]
//         "
//       />

//       {/* NAVBAR */}
//       <AdminNavbar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       <div className="flex">
//         {/* SIDEBAR */}
//         <AdminSidebar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* CONTENT */}
//         <section
//           className="
//             flex-1
//             lg:ml-[280px]

//             px-6
//             py-8
//           "
//         >
//           {children}
//         </section>
//       </div>
//     </main>
//   );
// }