# Deploy TA-LAP ke Publik (Gratis)

Panduan deploy **GitHub + Railway (backend + MySQL) + Vercel (frontend)**.

Hasil akhir contoh:
- Frontend: `https://ta-lap.vercel.app`
- Backend: `https://ta-lap-be-production.up.railway.app`

---

## Prasyarat

1. Akun [GitHub](https://github.com) — repo: `NilaAyu1611/TA-Lap`
2. Akun [Railway](https://railway.com) (login dengan GitHub)
3. Akun [Vercel](https://vercel.com) (login dengan GitHub)
4. `npm run build` di `ta-lap-fe` sudah sukses (lokal)

---

## Langkah 1 — Push kode ke GitHub

Di CMD/PowerShell:

```cmd
cd C:\Users\acer\TA-Lap
git add .
git status
git commit -m "Siapkan konfigurasi deploy Railway dan Vercel"
git push origin main
```

> Jangan commit file `.env` / `.env.local` (sudah di `.gitignore`).

---

## Langkah 2 — Railway: MySQL + Backend

### 2.1 Buat project

1. Buka https://railway.com/new
2. **Deploy from GitHub repo** → pilih `TA-Lap`
3. Railway buat service pertama dari repo

### 2.2 Tambah MySQL

1. Di project Railway → **+ New** → **Database** → **MySQL**
2. Tunggu MySQL online
3. Klik service MySQL → tab **Variables** → copy `MYSQL_URL` atau `DATABASE_URL`

### 2.3 Konfigurasi service Backend

1. Klik service **backend** (dari repo, bukan MySQL)
2. **Settings** → **Root Directory** → isi: `ta-lap-be`
3. **Settings** → **Networking** → **Generate Domain** → copy URL (mis. `https://xxx.up.railway.app`)

### 2.4 Environment Variables (service backend)

Tab **Variables** → **RAW Editor**, isi (ganti nilai yang perlu):

```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
JWT_SECRET=GANTI_DENGAN_STRING_ACAK_PANJANG_MIN_32_KARAKTER
PORT=3002
FRONTEND_URL=https://ta-lap.vercel.app
GOOGLE_CLIENT_ID=865851903561-xxxxx.apps.googleusercontent.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=email@gmail.com
SMTP_PASS=app_password_gmail
MAIL_FROM=TA-LAP <email@gmail.com>
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:email@gmail.com
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_IS_PRODUCTION=false
TOMTOM_API_KEY=
```

> `FRONTEND_URL` nanti update setelah Vercel deploy (langkah 3).

> `DATABASE_URL=${{MySQL.MYSQL_URL}}` — ganti `MySQL` dengan nama service MySQL Anda di Railway jika beda.

### 2.5 Deploy & seed database (sekali)

Setelah deploy sukses (log: `Server jalan di port 3002`):

1. Tab backend → **Settings** → **Deploy** → pastikan start command dari `railway.toml`:
   `npx prisma migrate deploy && npm start`
2. Seed data awal (opsional, via Railway CLI atau one-off command):
   ```cmd
   railway login
   railway link
   railway run npm run seed
   ```

---

## Langkah 3 — Vercel: Frontend

1. Buka https://vercel.com/new
2. **Import Git Repository** → `TA-Lap`
3. **Root Directory** → Edit → pilih `ta-lap-fe`
4. Framework: Next.js (auto)

### Environment Variables (Vercel)

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `/api` |
| `BACKEND_URL` | URL Railway backend (tanpa `/api`), mis. `https://xxx.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | `https://nama-project.vercel.app` (isi setelah deploy pertama) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | sama dengan backend |

5. Klik **Deploy**
6. Setelah dapat URL Vercel → **update** `FRONTEND_URL` di Railway → redeploy backend

---

## Langkah 4 — Google OAuth (wajib untuk login Google)

1. https://console.cloud.google.com/apis/credentials
2. Edit OAuth Client ID (Web)
3. **Authorized JavaScript origins** — tambahkan:
   - `https://ta-lap.vercel.app`
   - `https://nama-project-anda.vercel.app`
   - `http://localhost:3000` (dev lokal)
4. Simpan

---

## Langkah 5 — Midtrans (opsional, untuk bayar online)

1. Dashboard Sandbox: https://dashboard.sandbox.midtrans.com
2. Copy Server Key & Client Key ke Railway env
3. Webhook (opsional): `https://URL-RAILWAY/api/pembayaran/webhook/midtrans`

---

## Langkah 6 — Tes

1. Buka URL Vercel di HP/laptop
2. Register user → login → booking → bayar
3. Login admin (dari seed): cek `ta-lap-be/prisma/seed.js` untuk email/password default

---

## Update setelah ada perubahan kode

```cmd
git add .
git commit -m "Update fitur"
git push origin main
```

- **Vercel** redeploy otomatis
- **Railway** redeploy otomatis

---

## Catatan penting

| Topik | Keterangan |
|-------|------------|
| **Upload foto** | Railway disk sementara — foto upload bisa hilang setelah redeploy. Untuk production jangka panjang pakai Cloudinary/S3. |
| **Railway gratis** | ~$5 kredit/bulan; backend bisa sleep — buka 1–2 menit sebelum demo. |
| **ngrok** | Tidak perlu lagi kalau sudah pakai Vercel + Railway. |
| **Build gagal** | Jalankan `npm run build` lokal di `ta-lap-fe` dulu, perbaiki error TypeScript. |

---

## Troubleshooting

**Frontend tampil tapi API error**
- Cek `BACKEND_URL` di Vercel benar (HTTPS Railway, tanpa slash di akhir)
- Cek backend Railway logs

**Login Google gagal**
- Origins di Google Console harus include URL Vercel
- `GOOGLE_CLIENT_ID` sama di Vercel & Railway

**Database error**
- Pastikan `DATABASE_URL` terhubung ke MySQL Railway
- Jalankan `railway run npx prisma migrate deploy`

**502 / backend sleep (Railway)**
- Buka URL backend sekali, tunggu ~30 detik, refresh frontend

---

## Ringkasan arsitektur

```
User browser
    ↓ HTTPS
Vercel (ta-lap-fe)  — NEXT_PUBLIC_API_URL=/api
    ↓ rewrite /api/*
Railway (ta-lap-be) — Express + Prisma
    ↓
Railway MySQL
```

GitHub hanya menyimpan kode; yang melayani publik adalah **Vercel + Railway**.
