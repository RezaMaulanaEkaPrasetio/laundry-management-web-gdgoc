# README — Modul DEV C: Admin & Halaman Publik LaundryKu

Modul ini mencakup portal manajemen Superadmin/Owner dan halaman publik konsumen untuk pelacakan laundry serta syarat dan ketentuan layanan.

## Daftar Halaman & Rute

| Halaman | Rute | Keterangan |
|---|---|---|
| Dashboard Ringkasan Bisnis | `/admin` | Ringkasan operasional, 4 kartu KPI, progress beban kerja, visualisasi pembayaran QRIS/Tunai, tabel riwayat pesanan dengan filter & detail modal |
| Manajemen Akun Operator | `/admin/users` | Daftar operator (Kasir, Cuci, Kurir), filter peran & status, toggle aktif/nonaktif, modal tambah akun baru dengan generator password |
| Pengaturan Outlet & Tarif | `/admin/pengaturan` | Form profil outlet (jam operasional, batas radius antar-jemput, kuota harian), daftar harga kiloan & satuan, konfigurasi toggle metode pembayaran |
| Lacak Pesanan Publik | `/lacak` | Pelacakan publik bagi pelanggan (input nomor resi/telepon), kartu status pesanan, timeline tahapan interaktif lengkap dengan rincian biaya & estimasi siap diambil |
| Syarat & Ketentuan Layanan | `/syarat` | Dokumen kebijakan 4 seksi (Penerimaan Cucian, Tanggung Jawab & Klaim Kerusakan, Pembayaran & Pengambilan, Kehilangan) dalam format expandable accordion |

## Arsitektur & Teknologi

* **Framework**: Next.js 15+ (App Router)
* **Styling**: Tailwind CSS terintegrasi Design System Material Design 3 (MD3) LaundryKu
* **Typography**: Plus Jakarta Sans (`next/font/google`)
* **Icons**: Google Material Symbols Outlined
* **State & Interactivity**: Client-side reactive filtering, modals, accordion, and status updates.
