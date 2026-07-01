import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { Transaksi } from "@/types/transaksi";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;width:42%">${esc(label)}</td>
      <td style="padding:8px 0;font-size:13px;font-weight:600;text-align:right;vertical-align:top;color:#0f172a">${esc(value)}</td>
    </tr>`;
}

export function buildTransaksiReceiptHtml(transaksi: Transaksi): string {
  const tanggalMain = transaksi.tanggal_booking
    ? `${formatDate(transaksi.tanggal_booking)} · ${formatTime(transaksi.jam_mulai)} - ${formatTime(transaksi.jam_selesai)}`
    : "—";

  const tanggalBayar = transaksi.tanggal_bayar
    ? formatDate(transaksi.tanggal_bayar)
    : "—";

  const statusLabel =
    transaksi.status === "sukses"
      ? "LUNAS"
      : transaksi.status === "menunggu"
        ? "MENUNGGU"
        : transaksi.status.toUpperCase();

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="color-scheme" content="light only" />
  <title>Struk ${esc(transaksi.kode_transaksi)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: "Segoe UI", system-ui, sans-serif;
      color: #0f172a !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body { padding: 24px; }
    .receipt {
      max-width: 420px;
      margin: 0 auto;
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      padding: 24px;
      background: #ffffff;
    }
    .brand { text-align: center; margin-bottom: 20px; }
    .brand h1 { font-size: 22px; letter-spacing: -0.02em; color: #0891b2; }
    .brand p { font-size: 12px; color: #64748b; margin-top: 4px; }
    .code-box {
      text-align: center;
      background: #ecfeff;
      border: 1px dashed #67e8f9;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 18px;
    }
    .code-box .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
    .code-box .code { font-family: ui-monospace, monospace; font-size: 20px; font-weight: 700; color: #0e7490; margin-top: 6px; }
    table { width: 100%; border-collapse: collapse; }
    tr + tr td { border-top: 1px solid #f1f5f9; }
    .total {
      margin-top: 18px;
      padding: 14px;
      background: #f8fafc;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total span:first-child { font-size: 13px; color: #64748b; }
    .total span:last-child { font-size: 22px; font-weight: 700; color: #059669; }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
    }
    @media print {
      body { padding: 0; background: #fff !important; }
      .receipt { border: none; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="brand">
      <h1>TA-LAP</h1>
      <p>Bukti Pembayaran Booking Lapangan</p>
    </div>
    <div class="code-box">
      <div class="label">Kode Transaksi</div>
      <div class="code">${esc(transaksi.kode_transaksi)}</div>
    </div>
    <table>
      ${row("Kode Booking", transaksi.kode_booking || "—")}
      ${row("Lapangan", transaksi.lapangan_nama || "—")}
      ${row("Jenis", transaksi.lapangan_jenis || "—")}
      ${row("Tanggal Main", tanggalMain)}
      ${row("Metode Bayar", formatMetodePembayaran(transaksi.metode))}
      ${row("Tanggal Bayar", tanggalBayar)}
      ${row("Status", statusLabel)}
    </table>
    <div class="total">
      <span>Total Dibayar</span>
      <span>${esc(formatRupiah(transaksi.total_bayar))}</span>
    </div>
    ${
      transaksi.status === "sukses"
        ? `<p class="footer">Pembayaran terverifikasi otomatis.<br />Simpan struk ini sebagai bukti booking Anda.</p>`
        : `<p class="footer">Struk ini hanya untuk transaksi <strong>${esc(transaksi.kode_transaksi)}</strong>.</p>`
    }
  </div>
</body>
</html>`;
}

/**
 * Cetak struk satu transaksi via iframe tersembunyi.
 * Lebih andal di Firefox/Chrome daripada window.open + document.write (sering blank/hitam).
 */
export function printTransaksiReceipt(transaksi: Transaksi): boolean {
  if (typeof document === "undefined") return false;

  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;width:0;height:0;border:0;visibility:hidden;pointer-events:none;"
  );
  iframe.title = `Struk ${transaksi.kode_transaksi}`;
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = win?.document;
  if (!win || !doc) {
    iframe.remove();
    return false;
  }

  doc.open();
  doc.write(buildTransaksiReceiptHtml(transaksi));
  doc.close();

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) iframe.remove();
    }, 500);
  };

  const triggerPrint = () => {
    try {
      win.focus();
      win.print();
    } catch {
      iframe.remove();
      return false;
    }
    return true;
  };

  win.addEventListener("afterprint", cleanup, { once: true });
  setTimeout(cleanup, 15000);

  if (doc.readyState === "complete") {
    return triggerPrint();
  }

  win.addEventListener("load", () => triggerPrint(), { once: true });
  setTimeout(() => triggerPrint(), 400);

  return true;
}
