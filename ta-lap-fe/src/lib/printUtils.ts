/** Buka dialog cetak dengan tema terang agar teks tidak putih di kertas. */
export function invokePrint() {
  const root = document.documentElement;
  const hadDark = root.classList.contains("dark");

  const cleanup = () => {
    if (hadDark) root.classList.add("dark");
    root.classList.remove("printing-laporan");
    window.removeEventListener("afterprint", cleanup);
  };

  root.classList.add("printing-laporan");
  if (hadDark) root.classList.remove("dark");

  window.addEventListener("afterprint", cleanup);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.print());
  });
}
