import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads/setoran");

/** Simpan bukti transfer base64 ke disk, return path publik. */
export async function saveBuktiSetoranBase64(base64, ownerId) {
  const raw = String(base64 || "").trim();
  const match = raw.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
  if (!match) {
    throw new Error("Bukti harus berupa gambar JPG/PNG/WebP");
  }

  const ext = match[1].toLowerCase().includes("png")
    ? "png"
    : match[1].toLowerCase().includes("webp")
      ? "webp"
      : "jpg";

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > 2 * 1024 * 1024) {
    throw new Error("Ukuran bukti maksimal 2 MB");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `setoran-${ownerId}-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/setoran/${filename}`;
}
