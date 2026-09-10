# Republik Nusa Indah (RNI) — Website Resmi

Website komunitas Brookhaven Roleplay dengan **Excel Online (OneDrive)** sebagai
database utama, diakses lewat **Microsoft Graph API**. Tidak ada MySQL,
Firebase, Supabase, atau MongoDB di project ini — sesuai permintaan.

```
Frontend (React + Vite + Tailwind)
        ↓
Backend (Node.js + Express)
        ↓
Microsoft Graph API
        ↓
OneDrive
        ↓
Database_Anggota_RNI_Sederhana.xlsx  (sheet: DATA ANGGOTA)
```

---

## 1. Struktur Folder

```
rni-website/
├── backend/          → API Node.js + Express (Microsoft Graph API)
│   ├── src/
│   │   ├── config/graph.js         → autentikasi Microsoft Graph
│   │   ├── services/excelService.js → baca/tulis Excel Online
│   │   ├── services/authService.js  → login admin (bcrypt + JWT)
│   │   ├── routes/registration.js   → POST pendaftaran anggota
│   │   ├── routes/admin.js          → login, dashboard, CRUD anggota
│   │   ├── routes/ktp.js            → GET data KTP publik
│   │   ├── middleware/auth.js       → proteksi route admin
│   │   └── server.js                → entry point Express
│   ├── package.json
│   └── .env.example
├── frontend/          → React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/                   → Beranda, Tentang, Pendaftaran, KTP
│   │   ├── pages/admin/              → Login, Dashboard, Members, Detail, Edit
│   │   ├── components/               → Navbar, Footer, KTPCard, AdminLayout
│   │   └── api/client.js             → pemanggil API backend
│   ├── package.json
│   └── .env.example
└── README.md          → file ini
```

---

## 2. Fitur yang Sudah Dibuat

- Beranda, Tentang RNI, Pendaftaran, Administrator (sesuai navigasi yang diminta — tidak ada halaman lain)
- Form pendaftaran → Nama Lengkap, Username Roblox, Nama IC, Umur IC, Nomor WhatsApp
- ID Anggota otomatis format `RNI-001`, `RNI-002`, dst. (mencari nomor terbesar yang sudah ada lalu +1)
- Tanggal Bergabung ditulis sebagai teks tetap (`DD/MM/YYYY`), bukan formula `TODAY()`
- Pengecekan duplikat Username Roblox sebelum menyimpan
- Antrian sederhana (mutex) di backend agar dua pendaftaran hampir bersamaan tidak bentrok ID
- KTP Digital RNI (tanpa foto, tanpa Nomor WhatsApp), bisa didownload sebagai PNG
- Login admin (bcrypt + JWT), dashboard total anggota & anggota terbaru
- Pencarian, detail, dan edit anggota di area admin (Nomor WhatsApp hanya tampil di admin)
- Struktur Excel asli (`DATA ANGGOTA` + `PETUNJUK`, 7 kolom) **tidak diubah**

---

## 3. Panduan Setup — Langkah demi Langkah (untuk Pemula)

### Langkah 1 — Pastikan Excel ada di OneDrive
Upload file `Database_Anggota_RNI_Sederhana.xlsx` ke OneDrive akun Microsoft Anda
(pastikan sheet `DATA ANGGOTA` dan `PETUNJUK` tetap ada, kolomnya jangan diubah).

### Langkah 2 — Buka Microsoft Entra ID (Azure Portal)
1. Buka https://portal.azure.com dan login dengan akun Microsoft yang memiliki file Excel tersebut.
2. Cari **Microsoft Entra ID** di kotak pencarian atas.

### Langkah 3 — Buat App Registration
1. Di menu kiri, pilih **App registrations** → **New registration**.
2. Beri nama misalnya `RNI Website Backend`.
3. Pilih **Accounts in this organizational directory only**.
4. Klik **Register**.

### Langkah 4 — Catat Client ID dan Tenant ID
Di halaman **Overview** aplikasi yang baru dibuat, salin:
- **Application (client) ID** → ini `MICROSOFT_CLIENT_ID`
- **Directory (tenant) ID** → ini `MICROSOFT_TENANT_ID`

### Langkah 5 — Buat Client Secret
1. Di menu kiri, pilih **Certificates & secrets**.
2. Klik **New client secret**, beri deskripsi, pilih masa berlaku.
3. Setelah dibuat, **segera salin nilai "Value"** (bukan Secret ID) — nilai ini hanya
   tampil sekali. Ini `MICROSOFT_CLIENT_SECRET`.

### Langkah 6 — Atur Permission Microsoft Graph API
1. Di menu kiri, pilih **API permissions** → **Add a permission**.
2. Pilih **Microsoft Graph** → **Application permissions** (bukan Delegated,
   karena backend berjalan tanpa login interaktif pengguna).
3. Tambahkan izin: `Files.ReadWrite.All`.
4. Klik **Grant admin consent** (butuh akun admin tenant) agar izin aktif.

> Catatan: `Files.ReadWrite.All` bersifat luas (bisa akses semua file di tenant
> lewat Graph app-only). Jika ingin membatasi hanya ke file Excel RNI, pertimbangkan
> fitur **application access policy** di SharePoint/OneDrive, atau gunakan akun
> Microsoft 365 khusus yang hanya menyimpan file ini.

### Langkah 7 — Dapatkan ONEDRIVE_USER_ID
Ini adalah ID atau alamat email akun OneDrive pemilik file Excel, misalnya
`nama@outlook.com`. Isi ke `.env` sebagai `ONEDRIVE_USER_ID`.

### Langkah 8 — Dapatkan EXCEL_FILE_ID
Cara termudah: buka file di OneDrive web, lihat URL-nya, atau gunakan Graph
Explorer (https://developer.microsoft.com/graph/graph-explorer) dengan query:
```
GET https://graph.microsoft.com/v1.0/users/{ONEDRIVE_USER_ID}/drive/root:/Database_Anggota_RNI_Sederhana.xlsx
```
Salin nilai `id` dari hasilnya sebagai `EXCEL_FILE_ID`.

### Langkah 9 — Isi file `.env` backend
1. Masuk ke folder `backend/`, salin `.env.example` menjadi `.env`.
2. Isi semua nilai yang sudah didapat (Client ID, Client Secret, Tenant ID, File ID, User ID).
3. Biarkan `EXCEL_WORKSHEET_NAME=DATA ANGGOTA`.

### Langkah 10 — Buat akun admin
Password admin disimpan sebagai **hash bcrypt**, bukan teks biasa. Untuk membuatnya:

1. Pastikan Node.js sudah terinstall (lihat Langkah 11).
2. Di folder `backend/`, jalankan:
   ```bash
   node -e "import('bcryptjs').then(b => console.log(b.hashSync('password_anda', 10)))"
   ```
3. Salin hasilnya ke `.env`:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=<hasil hash tadi>
   JWT_SECRET=<string acak yang panjang, misal hasil dari: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   ```

### Langkah 11 — Install Node.js
Download dan install dari https://nodejs.org (pilih versi LTS).

### Langkah 12 — Install dependency
Buka terminal di folder project, lalu jalankan:
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Langkah 13 — Jalankan backend
```bash
cd backend
npm run dev
```
Backend akan berjalan di `http://localhost:5000`.

### Langkah 14 — Jalankan frontend
Buka terminal baru:
```bash
cd frontend
cp .env.example .env
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`.

### Langkah 15 — Uji pendaftaran
1. Buka `http://localhost:5173/pendaftaran` di browser.
2. Isi form dan klik **Daftar**.
3. Jika berhasil, KTP Digital RNI akan muncul dan bisa didownload.

### Langkah 16 — Pastikan data masuk ke Excel Online
Buka file `Database_Anggota_RNI_Sederhana.xlsx` di OneDrive web, cek sheet
`DATA ANGGOTA` — baris baru dengan ID `RNI-001` (atau nomor berikutnya) harus muncul.

---

## 4. Login sebagai Admin

Buka `http://localhost:5173/admin/login`, masuk dengan `ADMIN_USERNAME` dan
password asli (bukan hash) yang tadi di-hash di Langkah 10.

Dari dashboard admin, Anda bisa:
- Melihat total anggota & anggota terbaru
- Mencari anggota (ID, Nama Lengkap, Username Roblox, Nama IC)
- Melihat detail lengkap termasuk Nomor WhatsApp
- Mengedit data anggota
- Membuka KTP anggota tertentu

---

## 5. Catatan Penting

- **Struktur Excel tidak diubah.** Kolom tetap: Nama Lengkap, Username Roblox,
  Nama IC, Umur IC, Nomor WhatsApp, ID Anggota, Tanggal Bergabung. Sheet
  `PETUNJUK` tetap dibiarkan apa adanya.
- **Status Anggota** belum menjadi kolom di Excel. Untuk versi pertama, semua
  anggota otomatis dianggap `AKTIF` di tampilan (dashboard/KTP), tanpa menyimpan
  status ke Excel. Jika ke depannya Anda butuh status seperti `NONAKTIF`,
  `SUSPEND`, atau `DIBERHENTIKAN`, tambahkan kolom **Status** ke sheet
  `DATA ANGGOTA` secara manual, lalu beri tahu saya (atau developer Anda) agar
  kode backend diperbarui untuk membaca/menulis kolom tersebut.
- **Rahasia (Client Secret, JWT Secret)** hanya ada di file `.env` backend dan
  **tidak pernah** dikirim ke frontend.
- **Rate limiting** sederhana sudah aktif di endpoint pendaftaran (maks. 5x/10
  menit per IP) dan login admin (maks. 10x/15 menit per IP).
- **Race condition saat pendaftaran bersamaan**: backend memakai antrian
  in-memory sehingga proses "cek ID terakhir → tulis baris baru" tidak tumpang
  tindih selama backend berjalan sebagai satu proses. Jika nanti dijalankan di
  banyak server sekaligus, ini perlu ditingkatkan (lihat komentar di
  `backend/src/utils/mutex.js`).
- **Deploy ke internet**: saat production, ganti `FRONTEND_URL` di `.env`
  backend dan `VITE_API_BASE_URL` di `.env` frontend sesuai domain asli Anda,
  lalu build frontend dengan `npm run build` di folder `frontend/`.

---

## 6. Troubleshooting Singkat

| Gejala | Kemungkinan Penyebab |
|---|---|
| "Konfigurasi admin belum lengkap" saat login | `ADMIN_PASSWORD_HASH` atau `JWT_SECRET` belum diisi di `.env` |
| Pendaftaran gagal terus / error 502 | Cek `MICROSOFT_CLIENT_ID/SECRET/TENANT_ID`, `EXCEL_FILE_ID`, `ONEDRIVE_USER_ID` di `.env` backend, serta pastikan permission `Files.ReadWrite.All` sudah di-*grant admin consent* |
| Data tidak update di Excel padahal pendaftaran "berhasil" | Pastikan `EXCEL_WORKSHEET_NAME` sama persis dengan nama sheet (`DATA ANGGOTA`) |
| Error CORS di browser | Pastikan `FRONTEND_URL` di `.env` backend sesuai alamat frontend yang diakses |
