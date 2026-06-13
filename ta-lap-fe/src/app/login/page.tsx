// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";

// // export default function LoginPage() {
// //   const [showPassword, setShowPassword] = useState(false);

// //   return (
// //     <main className="min-h-screen overflow-hidden bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4">
// //       <div className="w-full max-w-md relative z-10">
// //         <div
// //           className="
// //             backdrop-blur-md
// //             bg-white/10
// //             border-[3px]
// //             border-pink-400
// //             rounded-2xl
// //             p-8
// //             shadow-[5px_5px_0px_#000,10px_10px_0px_#8b5cf6]
// //           "
// //         >
// //           <h1
// //             className="
// //               text-3xl
// //               font-bold
// //               text-center
// //               text-cyan-300
// //               mb-12
// //               drop-shadow-[0_0_10px_#00ffff]
// //             "
// //           >
// //             Login ke Akun Anda
// //           </h1>

// //           <form className="space-y-6">
// //             {/* Email */}
// //             <div>
// //               <label className="block text-cyan-200 mb-2 text-sm">
// //                 Email
// //               </label>

// //               <input
// //                 type="email"
// //                 placeholder="Masukkan email"
// //                 className="
// //                   w-full
// //                   rounded-xl
// //                   border
// //                   border-cyan-400
// //                   bg-black/40
// //                   px-4
// //                   py-3
// //                   text-white
// //                   outline-none
// //                   transition
// //                   focus:ring-2
// //                   focus:ring-cyan-400
// //                 "
// //               />
// //             </div>

// //             {/* Password */}
// //             <div>
// //               <label className="block text-cyan-200 mb-2 text-sm">
// //                 Password
// //               </label>

// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   placeholder="Masukkan password"
// //                   className="
// //                     w-full
// //                     rounded-xl
// //                     border
// //                     border-cyan-400
// //                     bg-black/40
// //                     px-4
// //                     py-3
// //                     pr-12
// //                     text-white
// //                     outline-none
// //                     transition
// //                     focus:ring-2
// //                     focus:ring-cyan-400
// //                   "
// //                 />

// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="
// //                     absolute
// //                     right-4
// //                     top-1/2
// //                     -translate-y-1/2
// //                     text-cyan-300
// //                   "
// //                 >
// //                   {showPassword ? "🙈" : "👁"}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Remember & Forgot */}
// //             <div className="flex items-center justify-between text-sm">
// //               <label className="flex items-center gap-2 text-cyan-200">
// //                 <input type="checkbox" />
// //                 Ingat Saya
// //               </label>

// //               <Link
// //                 href="/forgot-password"
// //                 className="text-cyan-300 hover:underline"
// //               >
// //                 Lupa Password?
// //               </Link>
// //             </div>

// //             {/* Button */}
// //             <button
// //               type="submit"
// //               className="
// //                 w-full
// //                 rounded-2xl
// //                 py-3
// //                 font-bold
// //                 text-white
// //                 border
// //                 border-cyan-400
// //                 bg-gradient-to-r
// //                 from-cyan-500/20
// //                 via-purple-500/20
// //                 to-pink-500/20
// //                 transition-all
// //                 hover:shadow-[0_0_15px_#00ffff]
// //                 hover:bg-pink-500
// //               "
// //             >
// //               Masuk
// //             </button>
// //           </form>

// //           {/* Register */}
// //           <div className="mt-6 text-center text-sm text-white">
// //             Belum punya akun?{" "}
// //             <Link
// //               href="/register"
// //               className="text-cyan-300 font-semibold hover:underline"
// //             >
// //               Daftar sekarang
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import { useState } from "react";

// import {
//   Eye,
//   EyeOff,
//   CalendarDays,
//   ShieldCheck,
//   Trophy,
// } from "lucide-react";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] =
//     useState(false);

//   return (
//     <main
//       className="
//         relative
//         flex
//         min-h-screen
//         overflow-hidden

//         bg-gray-50
//         text-gray-900

//         dark:bg-gradient-to-br
//         dark:from-[#0b1120]
//         dark:via-[#111827]
//         dark:to-[#0f172a]

//         dark:text-white

//         transition-all
//         duration-300
//       "
//     >
//       {/* BACKGROUND GLOW */}
//       <div
//         className="
//           absolute
//           left-[-120px]
//           top-[-120px]

//           h-72
//           w-72

//           rounded-full
//           bg-cyan-500/10

//           blur-3xl
//         "
//       />

//       <div
//         className="
//           absolute
//           bottom-[-120px]
//           right-[-120px]

//           h-72
//           w-72

//           rounded-full
//           bg-blue-500/10

//           blur-3xl
//         "
//       />

//       {/* LEFT SIDE */}
//       <section
//         className="
//           relative
//           z-10

//           hidden
//           w-1/2
//           flex-col
//           justify-center

//           px-20

//           lg:flex
//         "
//       >
//         <div className="max-w-xl">
//           {/* LOGO */}
//           <h1
//             className="
//               text-5xl
//               font-semibold
//               tracking-tight

//               text-cyan-500
//             "
//           >
//             TA-LAP
//           </h1>

//           {/* DESC */}
//           <p
//             className="
//               mt-6
//               max-w-lg

//               text-lg
//               leading-8
//               tracking-tight

//               text-gray-600
//               dark:text-gray-300
//             "
//           >
//             Platform booking lapangan modern
//             dengan sistem realtime, dashboard
//             multi-role, dan pengalaman pengguna
//             yang cepat, efisien, serta profesional.
//           </p>

//           {/* FEATURES */}
//           <div className="mt-14 space-y-8">
//             {/* ITEM */}
//             <div className="flex items-start gap-4">
//               <div
//                 className="
//                   rounded-2xl

//                   bg-cyan-100
//                   dark:bg-cyan-500/10

//                   p-3
//                 "
//               >
//                 <CalendarDays
//                   className="
//                     h-6
//                     w-6

//                     text-cyan-600
//                     dark:text-cyan-400
//                   "
//                 />
//               </div>

//               <div>
//                 <h3
//                   className="
//                     text-base
//                     font-semibold
//                     tracking-tight
//                   "
//                 >
//                   Smart Booking
//                 </h3>

//                 <p
//                   className="
//                     mt-1
//                     text-sm
//                     leading-7

//                     text-gray-500
//                     dark:text-gray-400
//                   "
//                 >
//                   Sistem booking realtime tanpa
//                   bentrok jadwal.
//                 </p>
//               </div>
//             </div>

//             {/* ITEM */}
//             <div className="flex items-start gap-4">
//               <div
//                 className="
//                   rounded-2xl

//                   bg-purple-100
//                   dark:bg-purple-500/10

//                   p-3
//                 "
//               >
//                 <ShieldCheck
//                   className="
//                     h-6
//                     w-6

//                     text-purple-600
//                     dark:text-purple-400
//                   "
//                 />
//               </div>

//               <div>
//                 <h3
//                   className="
//                     text-base
//                     font-semibold
//                     tracking-tight
//                   "
//                 >
//                   Secure Dashboard
//                 </h3>

//                 <p
//                   className="
//                     mt-1
//                     text-sm
//                     leading-7

//                     text-gray-500
//                     dark:text-gray-400
//                   "
//                 >
//                   Multi-role system untuk admin,
//                   owner, dan user.
//                 </p>
//               </div>
//             </div>

//             {/* ITEM */}
//             <div className="flex items-start gap-4">
//               <div
//                 className="
//                   rounded-2xl

//                   bg-green-100
//                   dark:bg-green-500/10

//                   p-3
//                 "
//               >
//                 <Trophy
//                   className="
//                     h-6
//                     w-6

//                     text-green-600
//                     dark:text-green-400
//                   "
//                 />
//               </div>

//               <div>
//                 <h3
//                   className="
//                     text-base
//                     font-semibold
//                     tracking-tight
//                   "
//                 >
//                   Modern Experience
//                 </h3>

//                 <p
//                   className="
//                     mt-1
//                     text-sm
//                     leading-7

//                     text-gray-500
//                     dark:text-gray-400
//                   "
//                 >
//                   Tampilan modern minimalis dan
//                   nyaman digunakan.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* RIGHT SIDE */}
//       <section
//         className="
//           relative
//           z-10

//           flex
//           w-full
//           items-center
//           justify-center

//           px-6
//           py-10

//           lg:w-1/2
//         "
//       >
//         {/* CARD */}
//         <div
//           className="
//             w-full
//             max-w-md

//             rounded-3xl
//             border

//             border-gray-200
//             dark:border-white/10

//             bg-white/90
//             dark:bg-white/5

//             p-8

//             shadow-xl
//             dark:shadow-none

//             backdrop-blur-xl
//           "
//         >
//           {/* HEADER */}
//           <div className="mb-10">
//             <h2
//               className="
//                 text-3xl
//                 font-semibold
//                 tracking-tight
//               "
//             >
//               Welcome Back
//             </h2>

//             <p
//               className="
//                 mt-3

//                 text-sm
//                 leading-7

//                 text-gray-500
//                 dark:text-gray-400
//               "
//             >
//               Login untuk masuk ke dashboard
//               TA-LAP.
//             </p>
//           </div>

//           {/* FORM */}
//           <form className="space-y-6">
//             {/* EMAIL */}
//             <div>
//               <label
//                 className="
//                   mb-2
//                   block

//                   text-sm
//                   font-medium

//                   text-gray-700
//                   dark:text-gray-300
//                 "
//               >
//                 Email
//               </label>

//               <input
//                 type="email"
//                 placeholder="Masukkan email"
//                 className="
//                   w-full
//                   rounded-2xl
//                   border

//                   border-gray-300
//                   dark:border-white/10

//                   bg-gray-100
//                   dark:bg-black/20

//                   px-4
//                   py-3

//                   text-sm

//                   text-black
//                   dark:text-white

//                   outline-none

//                   transition-all
//                   duration-300

//                   placeholder:text-gray-400

//                   focus:border-cyan-500
//                   focus:ring-4
//                   focus:ring-cyan-500/10
//                 "
//               />
//             </div>

//             {/* PASSWORD */}
//             <div>
//               <label
//                 className="
//                   mb-2
//                   block

//                   text-sm
//                   font-medium

//                   text-gray-700
//                   dark:text-gray-300
//                 "
//               >
//                 Password
//               </label>

//               <div className="relative">
//                 <input
//                   type={
//                     showPassword
//                       ? "text"
//                       : "password"
//                   }
//                   placeholder="Masukkan password"
//                   className="
//                     w-full
//                     rounded-2xl
//                     border

//                     border-gray-300
//                     dark:border-white/10

//                     bg-gray-100
//                     dark:bg-black/20

//                     px-4
//                     py-3
//                     pr-12

//                     text-sm

//                     text-black
//                     dark:text-white

//                     outline-none

//                     transition-all
//                     duration-300

//                     placeholder:text-gray-400

//                     focus:border-cyan-500
//                     focus:ring-4
//                     focus:ring-cyan-500/10
//                   "
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowPassword(
//                       !showPassword
//                     )
//                   }
//                   className="
//                     absolute
//                     right-4
//                     top-1/2

//                     -translate-y-1/2

//                     text-gray-500

//                     transition
//                     hover:text-cyan-500
//                   "
//                 >
//                   {showPassword ? (
//                     <EyeOff size={18} />
//                   ) : (
//                     <Eye size={18} />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* OPTIONS */}
//             <div
//               className="
//                 flex
//                 items-center
//                 justify-between

//                 text-sm
//               "
//             >
//               <label
//                 className="
//                   flex
//                   items-center
//                   gap-2

//                   text-gray-600
//                   dark:text-gray-400
//                 "
//               >
//                 <input type="checkbox" />
//                 Ingat Saya
//               </label>

//               <Link
//                 href="/forgot-password"
//                 className="
//                   font-medium

//                   text-cyan-600
//                   dark:text-cyan-400

//                   hover:underline
//                 "
//               >
//                 Lupa Password?
//               </Link>
//             </div>

//             {/* BUTTON */}
//             <button
//               type="submit"
//               className="
//                 w-full
//                 rounded-2xl

//                 bg-cyan-500

//                 py-3

//                 text-sm
//                 font-medium
//                 text-white

//                 transition-all
//                 duration-300

//                 hover:bg-cyan-400
//               "
//             >
//               Masuk ke Dashboard
//             </button>
//           </form>

//           {/* FOOTER */}
//           <div
//             className="
//               mt-8

//               text-center
//               text-sm

//               text-gray-500
//               dark:text-gray-400
//             "
//           >
//             Belum punya akun?{" "}

//             <Link
//               href="/register"
//               className="
//                 font-semibold

//                 text-cyan-600
//                 dark:text-cyan-400

//                 hover:underline
//               "
//             >
//               Daftar sekarang
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { login } from "@/services/auth.service";
import { storeToken, storeUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // const response = await axios.post(
      //   "http://localhost:3002/api/auth/login",
      //   {
      //     email,
      //     password,
      //   }
      // );

      // const data = response.data;

      const data = await login(email, password);

      console.log(data);

      storeToken(data.token);
      storeUser(data.user);

      // REDIRECT BERDASARKAN ROLE
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "owner") {
        router.push("/owner/dashboard");
      } else if (data.user.role === "user") {
        router.push("/user/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.log(err);

      setError(err.response?.data?.message || "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#020817]
        px-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
        "
      >
        <h1
          className="
            mb-2
            text-4xl
            font-bold
            text-white
          "
        >
          Welcome Back
        </h1>

        <p className="mb-8 text-gray-400">Login untuk masuk dashboard.</p>

        {/* ERROR */}
        {error && (
          <div
            className="
              mb-6
              rounded-2xl
              bg-red-500/10
              p-4
              text-red-400
            "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/20
                px-4
                py-3
                text-white
                outline-none
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/20
                  px-4
                  py-3
                  pr-12
                  text-white
                  outline-none
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-2xl
              bg-cyan-500
              py-3
              font-semibold
              text-white
              transition-all
              hover:bg-cyan-400
            "
          >
            {loading ? "Loading..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div
          className="
            mt-8
            text-center
            text-sm
            text-gray-400
          "
        >
          Belum punya akun?{" "}
          <Link href="/register" className="text-cyan-400">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </main>
  );
}
