# LaundryKu — Modul DEV B (Login + Operator Lapangan)

Dokumentasi implementasi modul **DEV B** untuk aplikasi manajemen laundry **LaundryKu**, dikonversi secara presisi dari desain Stitch (Google AI Designer) ke **Next.js App Router** dengan TypeScript dan Tailwind CSS.

---

## 📁 Struktur Folder Output

```
dev-B/
├── app/
│   ├── globals.css          # Design token Material Design 3 bawaan Stitch
│   ├── layout.tsx           # Root layout (Plus Jakarta Sans + Material Symbols)
│   ├── page.tsx             # Redirect root ke /login
│   ├── login/
│   │   └── page.tsx         # Halaman Login Terpadu (5 role demo)
│   ├── register/
│   │   └── page.tsx         # Registrasi Akun Pelanggan Baru
│   ├── petugas/
│   │   └── page.tsx         # Dashboard Workshop Petugas Cuci
│   └── kurir/
│       ├── page.tsx         # Portal Kurir Logistik (Jemput & Antar)
│       └── antar/
│           └── page.tsx     # Mode Pengantaran Mobile (Max-width 430px)
├── README-dev-B.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Rute Halaman & Fitur

| Route URL | Nama Halaman / Folder Stitch | Fitur Utama |
|---|---|---|
| `/login` | `login_terpadu_laundryku` | Selector cepat 5 akun demo (`Admin`, `Kasir`, `Petugas Cuci`, `Kurir`, `Pelanggan`), toggle lihat/sembunyikan kata sandi, toast feedback, dan redirect dinamis. |
| `/register` | `registrasi_pelanggan_laundryku` | Form registrasi pelanggan, pelacak kekuatan sandi dinamis (*strength meter*), validasi konfirmasi kata sandi & persetujuan syarat ketentuan, notifikasi sukses. |
| `/petugas` | `petugas_cuci_workshop` | Dashboard workshop tanpa distraksi kasir, telemetri beban harian & kapasitas mesin, tab segmented (*Perlu Ditimbang*, *Sedang Dicuci*, *Selesai Cuci*), pengatur berat timbangan presisi ($\pm 0.25\text{ kg}$), dan simulasi cetak tag rak. |
| `/kurir` | `portal_kurir` | Portal logistik kurir, switcher tab penjemputan/pengantaran, **filter tab jadwal `[ Semua ] [ Hari Ini ] [ Besok ]`**, info baris jadwal (`Jemput: Senin, 28 Sep · 10.00`), tautan Google Maps & chat WhatsApp. |
| `/kurir/antar` | `portal_kurir_tab_antar_mobile` | **Layout mobile-first (`max-width: 430px`)**, **total tagihan tampil jelas & menonjol** di setiap card (COD tunai vs Lunas QRIS), modal verifikasi serah terima paket, dan navigasi bawah mobile. |

---

## 🛠️ Menjalankan Project

Di dalam folder `dev-B`:

```bash
# Menjalankan development server
npm run dev

# Memvalidasi type check TypeScript
npx tsc --noEmit

# Membangun bundle produksi
npm run build
```
