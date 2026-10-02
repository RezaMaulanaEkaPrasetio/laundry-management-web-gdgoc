'use client';

import { useState } from 'react';
import Link from 'next/link';

interface KiloanPackage {
  id: string;
  name: string;
  desc: string;
  minOrder: string;
  sla: string;
  price: number;
  isActive: boolean;
  isExpress?: boolean;
}

interface SatuanItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
}

const INITIAL_KILOAN: KiloanPackage[] = [
  {
    id: 'kiloan-1',
    name: 'Cuci Komplit Reguler',
    desc: 'Proses: Cuci Bersih + Pengering Mesin + Setrika Uap Rapi',
    minOrder: '3.0 kg',
    sla: '48 Jam',
    price: 8000,
    isActive: true,
  },
  {
    id: 'kiloan-2',
    name: 'Cuci Kering Lipat',
    desc: 'Proses: Cuci Higienis + Mesin Pengering 100% + Pelipatan Rapi (Tanpa Gosok)',
    minOrder: '3.0 kg',
    sla: '24 Jam',
    price: 6000,
    isActive: true,
  },
  {
    id: 'kiloan-3',
    name: 'Cuci Kilat / Express',
    desc: 'Prioritas Antrean Mesin Utama (Selesai 12 Jam Hari yang Sama)',
    minOrder: '2.0 kg',
    sla: '12 Jam',
    price: 12000,
    isActive: true,
    isExpress: true,
  },
];

const INITIAL_SATUAN: SatuanItem[] = [
  { id: 'sat-1', name: 'Bedcover Besar / King Size', category: 'Linen & Selimut Tebal', price: 35000, isActive: true },
  { id: 'sat-2', name: 'Bedcover Sedang / Single', category: 'Linen & Selimut Sedang', price: 25000, isActive: true },
  { id: 'sat-3', name: 'Jas Formal & Blazer', category: 'Dry Clean & Hand Steam', price: 30000, isActive: true },
  { id: 'sat-4', name: 'Selimut Tebal Wool / Bulu', category: 'Linen Lembut', price: 20000, isActive: true },
  { id: 'sat-5', name: 'Sepatu Sneakers / Canvas', category: 'Deep Clean (Pasang)', price: 35000, isActive: true },
];

export default function PengaturanOutletTarifPage() {
  const [csPhone, setCsPhone] = useState('0812-9844-1290');
  const [outletAddress, setOutletAddress] = useState(
    'Jl. Bangka Raya No. 42, Mampang Prapatan, Jakarta Selatan 12720'
  );
  const [openHour, setOpenHour] = useState('07:30 WIB');
  const [closeHour, setCloseHour] = useState('21:00 WIB');
  const [dailyQuota, setDailyQuota] = useState(250);

  const [kiloanList, setKiloanList] = useState<KiloanPackage[]>(INITIAL_KILOAN);
  const [satuanList, setSatuanList] = useState<SatuanItem[]>(INITIAL_SATUAN);
  const [qrisActive, setQrisActive] = useState(true);
  const [cashActive, setCashActive] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleKiloan = (id: string) => {
    setKiloanList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, isActive: !k.isActive } : k))
    );
  };

  const handlePriceKiloanChange = (id: string, val: string) => {
    const clean = parseInt(val.replace(/\D/g, ''), 10);
    setKiloanList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, price: isNaN(clean) ? 0 : clean } : k))
    );
  };

  const handlePriceSatuanChange = (id: string, val: string) => {
    const clean = parseInt(val.replace(/\D/g, ''), 10);
    setSatuanList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: isNaN(clean) ? 0 : clean } : s))
    );
  };

  const handleSave = () => {
    setToastMessage('Pengaturan berhasil disimpan! Tarif terbaru langsung disinkronkan ke kasir.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh konfigurasi tarif ke nilai default outlet?')) {
      setCsPhone('0812-9844-1290');
      setOutletAddress('Jl. Bangka Raya No. 42, Mampang Prapatan, Jakarta Selatan 12720');
      setOpenHour('07:30 WIB');
      setCloseHour('21:00 WIB');
      setDailyQuota(250);
      setKiloanList(INITIAL_KILOAN);
      setSatuanList(INITIAL_SATUAN);
      setQrisActive(true);
      setCashActive(true);
    }
  };

  const handleTambahSatuan = () => {
    const nama = prompt('Masukkan nama item satuan baru:');
    if (!nama) return;
    const hargaStr = prompt('Masukkan tarif standar (Rp):', '15000');
    const harga = parseInt(hargaStr || '15000', 10);
    const newItem: SatuanItem = {
      id: `sat-${Date.now()}`,
      name: nama,
      category: 'Perawatan Khusus',
      price: isNaN(harga) ? 15000 : harga,
      isActive: true,
    };
    setSatuanList((prev) => [...prev, newItem]);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">LaundryKu</span>
            </div>
            <div className="h-5 w-px bg-outline-variant/50 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Outlet Utama (Kemang)</span>
            </div>
            <nav className="hidden lg:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container">
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/admin"
              >
                Dashboard Admin
              </Link>
              <Link
                aria-current="page"
                className="px-space-md py-space-sm rounded-lg font-label-lg transition-colors bg-primary-container text-on-primary-container"
                href="/admin/pengaturan"
              >
                Pengaturan Outlet &amp; Tarif
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/admin/users"
              >
                Manajemen User
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/lacak"
              >
                Halaman Pelanggan
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold font-label-sm">
                HW
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight font-semibold">
                  Hendra Wijaya
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                  Owner &amp; Superadmin
                </span>
              </div>
            </div>
            <div className="w-px h-6 bg-outline-variant/40 hidden sm:block"></div>
            <Link
              className="flex items-center justify-center p-space-xs rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
              href="/login"
              title="Keluar dari Portal"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
            {/* Top Action Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <span>Konfigurasi Sistem</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-primary font-bold">Outlet &amp; Tarif Master</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Pengaturan Outlet &amp; Tarif Layanan
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                  Kelola informasi operasional outlet tunggal, jam operasional penerimaan, dan konfigurasi master tarif kiloan serta satuan untuk kasir.
                </p>
              </div>
              <div className="flex items-center gap-space-sm self-start md:self-center shrink-0">
                <button
                  className="h-11 px-space-md bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-lg text-label-lg rounded-lg transition-colors flex items-center gap-space-xs cursor-pointer"
                  id="btn-reset"
                  onClick={handleReset}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span>Reset Perubahan</span>
                </button>
                <button
                  className="h-11 px-space-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm transition-colors flex items-center gap-space-xs cursor-pointer"
                  id="btn-simpan"
                  onClick={handleSave}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </div>

            {/* Alert / Status Banner MVP Fase 1 */}
            <div className="flex items-center justify-between p-space-md rounded-xl bg-secondary-fixed/40 text-on-secondary-fixed-variant">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg font-bold">Mode Operasional MVP Fase 1 Aktif</span>
                  <span className="font-body-sm text-body-sm opacity-90">
                    Satu outlet fisik terdaftar: <strong className="font-semibold">Outlet Utama (Kemang)</strong>. Konfigurasi tarif disinkronkan langsung ke layar POS Kasir.
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-lowest/80 px-space-sm py-1 rounded-full text-secondary font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>Terhubung Real-Time</span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* LEFT COLUMN: Profil Outlet (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-[24px]">storefront</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Profil Outlet</h2>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant font-bold">
                      Tunggal
                    </span>
                  </div>

                  {/* Outlet Header Card */}
                  <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[26px]">local_laundry_service</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">Kemang Raya Workshop</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                        Kemang, Jakarta Selatan
                      </span>
                    </div>
                  </div>

                  {/* Field 1: Nama Outlet */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
                      <span>Nama Outlet Workshop</span>
                      <span className="text-outline font-label-sm text-label-sm">Read-only (MVP)</span>
                    </label>
                    <div className="h-11 px-3 bg-surface-container-low rounded-lg flex items-center justify-between text-on-surface font-body-md text-body-md">
                      <span className="font-semibold">LaundryKu - Outlet Pusat (Kemang)</span>
                      <span className="material-symbols-outlined text-[18px] text-outline">lock</span>
                    </div>
                  </div>

                  {/* Field 2: Kontak CS */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1" htmlFor="outlet-phone">
                      <span>Nomor WhatsApp CS Outlet</span>
                      <span className="text-error font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 pointer-events-none">
                        phone_iphone
                      </span>
                      <input
                        className="w-full h-11 pl-10 pr-3 bg-surface rounded-lg text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#1a73e8] transition-all"
                        id="outlet-phone"
                        type="text"
                        value={csPhone}
                        onChange={(e) => setCsPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Field 3: Alamat Lengkap */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="outlet-address">
                      Alamat Lengkap Workshop
                    </label>
                    <textarea
                      className="w-full p-3 bg-surface rounded-lg text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#1a73e8] transition-all resize-none leading-relaxed"
                      id="outlet-address"
                      rows={3}
                      value={outletAddress}
                      onChange={(e) => setOutletAddress(e.target.value)}
                    />
                  </div>

                  {/* Field 4: Jam Operasional */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">Jam Penerimaan Cucian</label>
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-outline">Buka Kasir</span>
                        <div className="h-11 px-3 bg-surface rounded-lg flex items-center gap-2 text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                          <input
                            className="w-full bg-transparent focus:outline-none font-semibold"
                            type="text"
                            value={openHour}
                            onChange={(e) => setOpenHour(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-outline">Tutup Kasir</span>
                        <div className="h-11 px-3 bg-surface rounded-lg flex items-center gap-2 text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[16px] text-error">door_back</span>
                          <input
                            className="w-full bg-transparent focus:outline-none font-semibold"
                            type="text"
                            value={closeHour}
                            onChange={(e) => setCloseHour(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field 5: Kuota Maksimal Harian */}
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md font-bold text-on-surface" htmlFor="daily-quota">
                        Kapasitas Maksimal Harian
                      </label>
                      <span className="font-label-sm text-label-sm text-primary font-bold">Kapasitas Mesin Cuci</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-28 h-11 px-3 bg-surface-container-lowest rounded-lg font-headline-sm text-headline-sm text-primary text-center font-bold focus:outline-none focus:shadow-[0_0_0_2px_#1a73e8]"
                        id="daily-quota"
                        type="number"
                        value={dailyQuota}
                        onChange={(e) => setDailyQuota(parseInt(e.target.value, 10) || 0)}
                      />
                      <span className="font-label-lg text-label-lg text-on-surface-variant font-semibold">
                        kg / hari kerja
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5 mt-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">info</span>
                      <p className="font-body-sm text-body-sm leading-tight text-outline">
                        Sistem POS akan memberi peringatan kuning ketika antrean cucian aktif hari ini melampaui kapasitas ini untuk menjaga SLA.
                      </p>
                    </div>
                  </div>

                  {/* Field 6: Estimasi SLA */}
                  <div className="flex flex-col gap-space-sm pt-2">
                    <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                      Estimasi SLA Pengerjaan (Default Struk)
                    </span>
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div className="p-space-sm bg-surface rounded-lg flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-outline">Layanan Reguler</span>
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">48 Jam (2 Hari)</span>
                      </div>
                      <div className="p-space-sm bg-surface rounded-lg flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-outline">Layanan Kilat</span>
                        <span className="font-label-lg text-label-lg text-primary font-bold">12 Jam (Same Day)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Summary Mini-card */}
                <div className="p-space-md rounded-xl bg-surface-container text-on-surface flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[24px]">point_of_sale</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold">Sinkronisasi Kasir POS</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Status terminal kasir meja depan</span>
                    </div>
                  </div>
                  <span className="px-space-sm py-1 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold rounded-full">
                    Aktif
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Service Tariffs & Payment Policy (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                {/* SUB-PANEL 1: Tarif Layanan Kiloan */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">scale</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Tarif Layanan Kiloan (Per Kg)
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Dihitung otomatis berdasarkan integrasi timbangan digital kasir
                        </p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider self-start sm:self-auto font-semibold">
                      {kiloanList.length} Paket Master
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    {kiloanList.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-md"
                      >
                        <div className="flex items-start gap-space-md">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              pkg.isExpress
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                : 'bg-surface-container-highest text-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {pkg.isExpress ? 'bolt' : 'local_laundry_service'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-space-sm">
                              <span className="font-label-lg text-label-lg text-on-surface font-bold">{pkg.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                                  pkg.isActive
                                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                                    : 'bg-surface-container-highest text-outline'
                                }`}
                              >
                                {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                              {pkg.isExpress && (
                                <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary-fixed-dim/30 text-tertiary font-bold">
                                  Prioritas
                                </span>
                              )}
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{pkg.desc}</span>
                            <div className="flex items-center gap-space-xs mt-1 text-outline font-label-sm text-label-sm">
                              <span className="material-symbols-outlined text-[14px]">info</span>
                              <span>
                                Minimal Order: <strong className="text-on-surface font-semibold">{pkg.minOrder}</strong> | Estimasi: {pkg.sla}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-space-md shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="font-label-sm text-label-sm text-outline">Tarif per Kg</span>
                            <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm">
                              <span className="font-label-md text-label-md text-on-surface-variant">Rp</span>
                              <input
                                className="w-24 bg-transparent text-right font-headline-sm text-headline-sm text-on-surface font-bold focus:outline-none"
                                type="text"
                                value={pkg.price.toLocaleString('id-ID')}
                                onChange={(e) => handlePriceKiloanChange(pkg.id, e.target.value)}
                              />
                            </div>
                          </div>
                          <button
                            aria-label={`Toggle ${pkg.name}`}
                            className={`w-12 h-6 rounded-full relative p-0.5 flex items-center cursor-pointer transition-colors ${
                              pkg.isActive ? 'bg-primary-container' : 'bg-surface-container-highest'
                            }`}
                            onClick={() => handleToggleKiloan(pkg.id)}
                            type="button"
                          >
                            <span
                              className={`w-5 h-5 bg-surface-container-lowest rounded-full shadow-sm transform transition-transform ${
                                pkg.isActive ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUB-PANEL 2: Tarif Layanan Satuan (Per Pcs) */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">checkroom</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Tarif Layanan Satuan (Per Pcs)
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Item non-kiloan khusus penanganan individual (linen besar, jas, sepatu)
                        </p>
                      </div>
                    </div>
                    <button
                      className="h-9 px-space-md bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md font-bold rounded-lg transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                      id="btn-tambah-satuan"
                      onClick={handleTambahSatuan}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>Tambah Item Satuan</span>
                    </button>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                          <th className="py-2.5 px-4 rounded-l-lg font-semibold">Nama Item Satuan</th>
                          <th className="py-2.5 px-4 font-semibold">Kategori Perawatan</th>
                          <th className="py-2.5 px-4 font-semibold">Tarif Standar (Rp)</th>
                          <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                          <th className="py-2.5 px-4 rounded-r-lg font-semibold text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-0 text-body-md font-body-md text-on-surface">
                        {satuanList.map((item, idx) => (
                          <tr
                            key={item.id}
                            className={`hover:bg-surface-container-low/50 transition-colors ${
                              idx % 2 === 1 ? 'bg-surface-container-low/20' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                              <span>{item.name}</span>
                            </td>
                            <td className="py-3 px-4 text-on-surface-variant text-body-sm font-body-sm">
                              {item.category}
                            </td>
                            <td className="py-3 px-4">
                              <div className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-md">
                                <span className="text-body-sm font-body-sm text-outline">Rp</span>
                                <input
                                  className="w-20 bg-transparent text-right font-bold text-on-surface focus:outline-none"
                                  type="text"
                                  value={item.price.toLocaleString('id-ID')}
                                  onChange={(e) => handlePriceSatuanChange(item.id, e.target.value)}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
                                {item.isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                aria-label={`Ubah ${item.name}`}
                                className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                                type="button"
                                onClick={() => {
                                  const p = prompt(`Ubah tarif untuk ${item.name}:`, item.price.toString());
                                  if (p) handlePriceSatuanChange(item.id, p);
                                }}
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SUB-PANEL 3: Kebijakan Pembayaran Kasir MVP */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Metode Pembayaran Kasir (MVP)
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Konfigurasi metode transaksi yang tampil pada modal pembayaran kasir
                        </p>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-bold">
                      Manual Settlement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Method 1: QRIS */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-primary text-[24px]">qr_code_2</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">
                              QRIS Kasir (Statis / Dinamis)
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              BCA / Gopay / OVO / ShopeePay
                            </span>
                          </div>
                        </div>
                        <button
                          aria-label="Toggle QRIS Kasir"
                          className={`w-12 h-6 rounded-full relative p-0.5 flex items-center cursor-pointer transition-colors shrink-0 ${
                            qrisActive ? 'bg-primary-container' : 'bg-surface-container-highest'
                          }`}
                          onClick={() => setQrisActive(!qrisActive)}
                          type="button"
                        >
                          <span
                            className={`w-5 h-5 bg-surface-container-lowest rounded-full shadow-sm transform transition-transform ${
                              qrisActive ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></span>
                        </button>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-lowest text-body-sm font-body-sm text-on-surface-variant flex items-center justify-between">
                        <span>Status Verifikasi:</span>
                        <span className="font-semibold text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">task_alt</span>
                          Manual Kasir
                        </span>
                      </div>
                    </div>

                    {/* Method 2: Cash */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-secondary text-[24px]">payments</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">
                              Uang Tunai di Kasir
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Kalkulator kembalian otomatis
                            </span>
                          </div>
                        </div>
                        <button
                          aria-label="Toggle Uang Tunai"
                          className={`w-12 h-6 rounded-full relative p-0.5 flex items-center cursor-pointer transition-colors shrink-0 ${
                            cashActive ? 'bg-primary-container' : 'bg-surface-container-highest'
                          }`}
                          onClick={() => setCashActive(!cashActive)}
                          type="button"
                        >
                          <span
                            className={`w-5 h-5 bg-surface-container-lowest rounded-full shadow-sm transform transition-transform ${
                              cashActive ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></span>
                        </button>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-lowest text-body-sm font-body-sm text-on-surface-variant flex items-center justify-between">
                        <span>Laci Kasir Fisik:</span>
                        <span className="font-semibold text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          Tersedia di Meja
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-high/60 flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">policy</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Catatan Arsitektur MVP Fase 1:</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Seluruh pembayaran diselesaikan di kasir tanpa gateway otomatis bank pihak ketiga (Xendit/Midtrans). Kasir memeriksa struk bukti transfer atau menghitung uang cash secara fisik sebelum menandai pesanan lunas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div
          className={`fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm z-50 transform transition-all duration-300 ${
            toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
          id="save-toast"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-[24px]">check_circle</span>
          <div className="flex flex-col">
            <span className="font-label-lg text-label-lg font-bold">Pengaturan Berhasil Disimpan</span>
            <span className="font-body-sm text-body-sm opacity-80">{toastMessage}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-lg mt-auto">
        <div className="w-full px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-on-surface font-semibold">LaundryKu Portal Operasional</span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Outlet Utama (Kemang)</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 LaundryKu Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
