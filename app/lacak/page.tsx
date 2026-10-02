'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LacakPesananPage() {
  const [orderQuery, setOrderQuery] = useState('LKU-260925');
  const [currentOrderId, setCurrentOrderId] = useState('#LKU-260925');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = orderQuery.trim().toUpperCase();
    if (val) {
      const formatted = val.startsWith('#') ? val : '#' + val;
      setCurrentOrderId(formatted);
      showToast(`Data pesanan ${formatted} berhasil dimuat ulang.`);
    } else {
      showToast('Silakan masukkan nomor order Anda.');
    }
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast(`Struk digital ${currentOrderId} berhasil diunduh.`);
    }, 1200);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between gap-gutter">
          <div className="flex items-center gap-space-md">
            <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">local_laundry_service</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <Link href="/login" className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                LaundryKu
              </Link>
              <span className="hidden sm:inline-flex items-center px-space-sm py-space-xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                Lacak Pesanan Mandiri
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-lg">
            <nav className="flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-label-lg rounded-lg">
              <Link
                aria-current="page"
                className="px-space-md py-space-sm transition-colors bg-primary-container text-on-primary-container font-label-lg rounded-lg"
                href="/lacak"
              >
                Lacak Pesanan
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/syarat"
              >
                Syarat &amp; Ketentuan
              </Link>
            </nav>

            <div className="flex items-center gap-space-md">
              <a
                className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg hover:bg-secondary hover:text-on-secondary transition-colors"
                href="https://wa.me/6281234567890"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Bantuan CS</span>
              </a>
              <Link
                href="/login"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-on-primary"
                title="Masuk ke Akun"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-16rem)] flex-grow">
        <div className="flex flex-col w-full">
          <div className="max-w-6xl mx-auto w-full px-margin py-space-xl flex flex-col gap-space-xl">
            {/* Search Banner Block */}
            <div className="w-full flex flex-col items-center text-center max-w-2xl mx-auto pt-space-sm">
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md mb-space-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Sistem Pelacakan Real-Time Otomatis</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-xs">
                Lacak Status Laundry Mandiri
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                Ketahui posisi cucian, transparansi timbangan, dan estimasi selesai seketika.
              </p>

              {/* Form Input Pelacakan */}
              <form
                className="w-full relative shadow-sm rounded-xl bg-surface-container-lowest p-space-xs flex flex-col sm:flex-row items-center gap-space-xs"
                onSubmit={handleSearch}
              >
                <div className="relative flex-1 w-full flex items-center pl-space-md">
                  <span className="material-symbols-outlined text-outline text-[22px]">tag</span>
                  <input
                    aria-label="Nomor Pesanan"
                    className="w-full bg-transparent px-space-sm py-3 font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none"
                    placeholder="Masukkan Kode Pesanan (Contoh: LKU-260925)"
                    type="text"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                  />
                  {orderQuery && (
                    <button
                      className="text-outline hover:text-on-surface p-1 mr-space-xs transition-colors cursor-pointer"
                      onClick={() => setOrderQuery('')}
                      title="Hapus teks"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>
                <button
                  className="w-full sm:w-auto px-space-xl py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span>Lacak Pesanan</span>
                </button>
              </form>

              <div className="flex items-center gap-space-xs mt-space-sm font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span>Mendeteksi otomatis pesanan aktif dari tautan WhatsApp notifikasi Anda.</span>
              </div>
            </div>

            {/* Order Status Detail Card */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              {/* Header Gradient */}
              <div className="p-space-lg sm:p-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                      {currentOrderId}
                    </span>
                    <span className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                      <span>Sedang Dicuci &amp; Dikeringkan</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-sm font-body-md text-body-md text-on-surface-variant">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Bambang Triatmojo</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">store</span>
                      Outlet Pusat (Kemang Raya)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-md bg-surface-container p-space-md rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[28px]">schedule</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Estimasi Siap
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">Hari ini, 17:30 WIB</span>
                    <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Sesuai target jadwal pengerjaan
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Progress */}
              <div className="px-space-lg sm:px-space-xl py-space-xl">
                <div className="flex items-center justify-between mb-space-lg">
                  <span className="font-label-lg text-label-lg text-on-surface tracking-wide uppercase font-bold">
                    Tahapan Pengerjaan Mandiri
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-space-sm py-1 rounded-md">
                    Tahap 4 dari 7 Sedang Diproses
                  </span>
                </div>

                <div className="relative w-full">
                  <div className="flex flex-col gap-space-lg relative">
                    {/* Stage 1 with special instruction: teks kecil "Kurir dijadwalkan menjemput pada [tanggal] pukul [jam]" (12px, #757575) */}
                    <div className="flex items-start gap-space-md">
                      <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">1. Terjadwal</span>
                          <span className="text-[11px] font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
                            Selesai • 08:00 WIB
                          </span>
                        </div>
                        {/* SPECIAL REQUIREMENT 1: Kurir dijadwalkan menjemput... (12px, #757575) */}
                        <p className="text-[12px] text-[#757575] mt-0.5 leading-relaxed">
                          Kurir dijadwalkan menjemput pada Senin, 28 Sep 2026 pukul 10.00 WIB
                        </p>
                      </div>
                    </div>

                    {/* Stage 2 */}
                    <div className="flex items-start gap-space-md">
                      <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            2. Menunggu Penjemputan
                          </span>
                          <span className="text-[11px] font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
                            Selesai • 08:30 WIB
                          </span>
                        </div>
                        <p className="text-[12px] text-[#757575] mt-0.5 leading-relaxed">
                          Permintaan penjemputan berhasil divalidasi
                        </p>
                      </div>
                    </div>

                    {/* Stage 3 */}
                    <div className="flex items-start gap-space-md">
                      <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">3. Sudah Dijemput</span>
                          <span className="text-[11px] font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
                            Selesai • 09:15 WIB
                          </span>
                        </div>
                        <p className="text-[12px] text-[#757575] mt-0.5 leading-relaxed">
                          Pakaian diambil oleh Kurir Aris &amp; tiba di outlet
                        </p>
                      </div>
                    </div>

                    {/* Stage 4: Active Stage */}
                    <div className="flex items-start gap-space-md">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md ring-4 ring-primary-fixed mt-0.5">
                        <span className="material-symbols-outlined text-[18px] animate-spin">cyclone</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-primary font-bold">4. Sedang Dicuci</span>
                          <span className="text-[11px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                            Tahap Aktif
                          </span>
                          <span className="text-[11px] text-primary font-semibold">• Mulai 10:20 WIB</span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                          Pakaian sedang dalam proses pencucian &amp; higienisasi
                        </p>
                      </div>
                    </div>

                    {/* Stage 5 */}
                    <div className="flex items-start gap-space-md opacity-60">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-outline"></span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-on-surface">5. Selesai Dicuci</span>
                          <span className="text-[11px] text-on-surface-variant">Menunggu giliran</span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">Est. 13:00 WIB</p>
                      </div>
                    </div>

                    {/* Stage 6 */}
                    <div className="flex items-start gap-space-md opacity-60">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-outline"></span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-on-surface">6. Siap Diantar</span>
                          <span className="text-[11px] text-on-surface-variant">Menunggu giliran</span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">Est. 17:30 WIB</p>
                      </div>
                    </div>

                    {/* Stage 7 */}
                    <div className="flex items-start gap-space-md opacity-60">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-outline"></span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-on-surface">7. Menunggu Pembayaran</span>
                          <span className="text-[11px] text-on-surface-variant">Menunggu pelunasan / belum tiba</span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">Pelunasan saat penerimaan cucian</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details & Pricing Transparency Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column: Laundry Specification */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl shadow-sm flex flex-col gap-space-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">laundry</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                        Rincian Cucian &amp; Layanan
                      </h2>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Data penimbangan dan instruksi penanganan
                      </span>
                    </div>
                  </div>
                  <span className="px-space-sm py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase font-bold">
                    Higienis Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Paket Layanan
                    </span>
                    <div className="mt-space-xs">
                      <span className="font-label-lg text-label-lg text-on-surface block font-bold">
                        Cuci Komplit Reguler
                      </span>
                      <span className="font-body-sm text-body-sm text-primary flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">water_drop</span>
                        Aroma: Ocean Fresh Premium
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Berat Riil Timbangan
                      </span>
                      <span className="font-display-scale-weight text-display-scale-weight text-on-surface font-extrabold tracking-tight">
                        4.8 <span className="font-body-lg text-body-lg text-on-surface-variant font-medium">kg</span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-xl">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">edit_note</span>
                    Catatan Khusus Pelanggan
                  </span>
                  <p className="font-body-md text-body-md text-on-surface bg-surface-container-lowest p-space-sm rounded-lg">
                    “Pakaian kemeja putih jangan dicampur warna gelap. Bagian kerah mohon dibantu ekstra bersih.”
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex flex-col">
                    <span className="text-outline">Waktu Masuk Workshop</span>
                    <span className="font-label-md text-label-md text-on-surface mt-0.5 font-semibold">
                      24 Sep 2026, 09:45
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline">Metode Penerimaan</span>
                    <span className="font-label-md text-label-md text-on-surface mt-0.5 font-semibold">
                      Pick-up Door-to-Door
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <span className="text-outline">Operator Penanggung Jawab</span>
                    <span className="font-label-md text-label-md text-on-surface mt-0.5 font-semibold">
                      Rina Handayani (Shift 1)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Cost Transparency */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl shadow-sm flex flex-col justify-between gap-space-lg">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Transparansi Biaya</h2>
                    </div>
                    <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      LUNAS
                    </span>
                  </div>

                  <div className="p-space-md bg-secondary-container/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-[24px]">qr_code_scanner</span>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface block font-bold">
                          Pembayaran via QRIS Auto-Verify
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Ref: TRX-9921402 • 09:50 WIB
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                  </div>

                  <div className="flex flex-col gap-space-sm pt-space-xs">
                    <div className="flex justify-between items-center font-body-md text-body-md text-on-surface">
                      <div className="flex flex-col">
                        <span>Cuci Komplit Reguler</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">4.8 kg × Rp 8.000 / kg</span>
                      </div>
                      <span className="font-label-lg text-label-lg font-semibold">Rp 38.400</span>
                    </div>

                    <div className="flex justify-between items-center font-body-md text-body-md text-on-surface">
                      <div className="flex flex-col">
                        <span>Ongkir Jemput &amp; Antar</span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium">
                          Voucher Promo Gratis Ongkir
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="line-through text-outline font-body-sm text-body-sm mr-1">Rp 10.000</span>
                        <span className="font-label-lg text-label-lg text-secondary font-bold">Rp 0</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                      <span>Biaya Penanganan Higienis &amp; Packing</span>
                      <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">Gratis</span>
                    </div>
                  </div>

                  <div className="bg-surface-container p-space-md rounded-xl flex items-center justify-between mt-space-xs">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Total Akhir Terbayar</span>
                    <span className="font-headline-md text-headline-md text-primary font-extrabold">Rp 38.400</span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <button
                    className="w-full py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors cursor-pointer"
                    id="downloadInvoiceBtn"
                    onClick={handleDownloadInvoice}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">cyclone</span>
                        <span>Menyiapkan PDF...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px] text-primary">download</span>
                        <span>Unduh Struk Digital (PDF Resmi)</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Bukti pembayaran sah tercatat di pembukuan Cloud POS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Care Banner */}
            <div className="w-full bg-secondary-container rounded-2xl p-space-lg sm:p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md text-on-secondary-container">
              <div className="flex items-center gap-space-md">
                <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[30px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm font-bold">
                    Ada instruksi khusus tambahan atau pertanyaan?
                  </span>
                  <p className="font-body-md text-body-md text-on-secondary-container/90">
                    Customer Desk LaundryKu siap merespons via WhatsApp dalam 2-5 menit.
                  </p>
                </div>
              </div>
              <a
                className="w-full md:w-auto px-space-xl py-3.5 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm hover:opacity-95 transition-transform active:scale-95 shrink-0"
                href="https://wa.me/6281234567890?text=Halo%20LaundryKu,%20saya%20ingin%20menanyakan%20status%20pesanan%20%23LKU-260925"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Chat WhatsApp Customer Care</span>
              </a>
            </div>

            {/* SPECIAL REQUIREMENT 2: Satu baris teks + ikon WhatsApp "Ada kendala? Hubungi kami di [nomor WA]" */}
            <div className="w-full py-space-sm flex items-center justify-center text-center">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-body-md text-on-surface hover:underline transition-colors"
              >
                <span className="text-[#25D366] flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.39C8.94 7.39 8.67 7.46 8.44 7.7C8.21 7.95 7.55 8.57 7.55 9.83C7.55 11.09 8.47 12.31 8.6 12.49C8.73 12.66 10.4 15.24 12.96 16.34C13.57 16.6 14.05 16.76 14.42 16.88C15.03 17.07 15.58 17.05 16.02 16.98C16.51 16.91 17.53 16.36 17.74 15.77C17.95 15.17 17.95 14.66 17.89 14.56C17.82 14.45 17.65 14.39 17.39 14.26C17.13 14.13 15.86 13.5 15.63 13.42C15.39 13.33 15.22 13.29 15.05 13.55C14.88 13.8 14.4 14.39 14.25 14.56C14.11 14.73 13.96 14.75 13.7 14.62C13.45 14.5 12.62 14.23 11.64 13.35C10.87 12.67 10.35 11.83 10.2 11.57C10.05 11.31 10.18 11.18 10.31 11.05C10.43 10.93 10.57 10.74 10.7 10.59C10.83 10.44 10.87 10.33 10.96 10.16C11.05 9.99 11 9.84 10.94 9.71C10.87 9.59 10.36 8.33 10.15 7.82C9.94 7.32 9.73 7.39 9.57 7.38C9.42 7.38 9.25 7.39 9.11 7.39Z"></path>
                  </svg>
                </span>
                <span>
                  Ada kendala? Hubungi kami di <strong className="font-semibold">+62 812-3456-7890</strong> (WhatsApp)
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div
          className={`fixed bottom-6 right-6 transform transition-all duration-300 z-50 flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-lg font-body-md text-body-md ${
            toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
          }`}
          id="toastNotification"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <span id="toastMessage">{toastMessage}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low mt-space-xl shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-margin py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl pb-space-lg">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">LaundryKu</span>
                <span className="inline-block px-space-xs py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  Outlet Resmi
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Layanan binatu modern bersih higienis dengan sistem penimbangan transparan, pelacakan pengerjaan real-time, dan standar higienitas terjamin.
              </p>
            </div>
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">Lokasi &amp; Kontak Outlet</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                Jl. Surya Kencana No. 42, Central Hub
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                +62 812-3456-7890
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                halo@laundryku.id
              </p>
            </div>
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">Jam Operasional Drop &amp; Pick</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                Senin - Sabtu: 07:00 - 21:00 WIB
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                Minggu &amp; Hari Libur: 08:00 - 18:00 WIB
              </p>
              <div className="pt-space-xs">
                <span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Outlet Buka Melayani Pesanan
                </span>
              </div>
            </div>
          </div>
          <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-variant/30">
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 LaundryKu. Hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-space-md">
              <Link href="/syarat" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Syarat &amp; Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
