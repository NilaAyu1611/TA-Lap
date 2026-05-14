// "use client";

// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";

// export default function ThemeToggle() {
//   const { resolvedTheme, setTheme } = useTheme();

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Hindari hydration mismatch
//   if (!mounted) {
//     return (
//       <button
//         className="
//           rounded-xl
//           border
//           border-cyan-400
//           p-2
//         "
//       >
//         <Sun size={20} />
//       </button>
//     );
//   }

//   return (
//     <button
//       onClick={() =>
//         setTheme(resolvedTheme === "dark" ? "light" : "dark")
//       }
//       className="
//         rounded-xl
//         border
//         border-cyan-400
//         p-2
//         transition
//         hover:bg-cyan-400
//         hover:text-black
//       "
//     >
//       {resolvedTheme === "dark" ? (
//         <Sun size={20} />
//       ) : (
//         <Moon size={20} />
//       )}
//     </button>
//   );
// }

// "use client";

// export default function ThemeToggle() {
//   const toggleTheme = () => {
//     document.documentElement.classList.toggle("dark");
//   };

//   return (
//     <button onClick={toggleTheme}>
//       Toggle Theme
//     </button>
//   );
// }

"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        rounded-xl
        border
        border-cyan-400
        p-2
        transition
        hover:bg-cyan-400
        hover:text-black
      "
    >
      {darkMode ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}