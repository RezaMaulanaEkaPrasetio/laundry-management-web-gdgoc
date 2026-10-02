'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CourierTask {
  id: string;
  type: 'pickup' | 'delivery';
  scheduleDay: 'hari-ini' | 'besok';
  scheduleText: string;
  customerName: string;
  phone: string;
  service: string;
  weight?: string;
  address: string;
  landmark: string;
  note?: string;
  totalBill?: string;
  paymentStatus?: 'cod' | 'lunas';
  mapsUrl: string;
  isConfirmed?: boolean;
}

const INITIAL_TASKS: CourierTask[] = [
  // Pickups
  {
    id: '#LKU-260925',
    type: 'pickup',
    scheduleDay: 'hari-ini',
    scheduleText: 'Jemput: Senin, 28 Sep · 10.00',
    customerName: 'Bambang Triatmojo',
    phone: '0812-9988-7711',
    service: 'Cuci Komplit Reguler',
    address: 'Jl. Kemang Timur Raya No. 45B, RT 04/RW 03, Bangka, Mampang Prapatan',
    landmark: 'Patokan: Pagar hitam depan Laundry Koin 88',
    note: 'Titip satpam cluster Sakura jika tidak ada orang.',
    mapsUrl: 'https://maps.google.com/?q=-6.261493,106.810600',
  },
  {
    id: '#LKU-260927',
    type: 'pickup',
    scheduleDay: 'hari-ini',
    scheduleText: 'Jemput: Senin, 28 Sep · 11.30',
    customerName: 'Nadia Maharani',
    phone: '0857-1122-3344',
    service: 'Cuci Kering Lipat Express',
    address: 'Apartemen Kemang Mansion, Tower Selatan Unit 12-08, Jl. Kemang Raya No. 3',
    landmark: 'Patokan: Lobby Selatan, lapor resepsionis',
    note: 'Bawa tas kantong laundry ekstra (perkiraan 10kg).',
    mapsUrl: 'https://maps.google.com/?q=-6.263124,106.815410',
  },
  {
    id: '#LKU-260928',
    type: 'pickup',
    scheduleDay: 'besok',
    scheduleText: 'Jemput: Selasa, 29 Sep · 09.00',
    customerName: 'Reza Fahlevi',
    phone: '0813-4455-6677',
    service: 'Bed Cover & Selimut',
    address: 'Jl. Bangka VIII No. 12, Pela Mampang, Jakarta Selatan',
    landmark: 'Patokan: Rumah cat hijau samping Warung Bu Joko',
    note: 'Hubungi WA 10 menit sebelum tiba di lokasi.',
    mapsUrl: 'https://maps.google.com/?q=-6.255410,106.821102',
  },
  // Deliveries
  {
    id: '#LKU-260918',
    type: 'delivery',
    scheduleDay: 'hari-ini',
    scheduleText: 'Antar: Senin, 28 Sep · 14.00',
    customerName: 'Hendra Kusuma',
    phone: '0817-0099-8811',
    service: 'Cuci Komplit (4.8 kg)',
    address: 'Jl. Ampera Raya No. 18, Gang Kancil Kav. 2, Cilandak Timur',
    landmark: 'Patokan: Rumah pagar kayu putih tingkat dua',
    totalBill: 'Rp 48.000',
    paymentStatus: 'cod',
    mapsUrl: 'https://maps.google.com/?q=-6.282100,106.818900',
  },
  {
    id: '#LKU-260920',
    type: 'delivery',
    scheduleDay: 'besok',
    scheduleText: 'Antar: Selasa, 29 Sep · 10.30',
    customerName: 'Siti Aisyah',
    phone: '0852-1199-3300',
    service: 'Setrika Uap Only (3.2 kg)',
    address: 'Jl. Duren Tiga Elok No. 7, Pancoran, Jakarta Selatan',
    landmark: 'Patokan: Masuk gang seberang Masjid Nurul Huda',
    totalBill: 'Rp 32.000',
    paymentStatus: 'lunas',
    mapsUrl: 'https://maps.google.com/?q=-6.251200,106.839800',
  },
];

export default function CourierPortalPage() {
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>('pickup');
  const [scheduleFilter, setScheduleFilter] = useState<'semua' | 'hari-ini' | 'besok'>('semua');
  const [tasks, setTasks] = useState<CourierTask[]>(INITIAL_TASKS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter tasks by activeTab (pickup vs delivery) and scheduleFilter (semua / hari-ini / besok)
  const currentTasks = tasks.filter((t) => {
    if (t.type !== activeTab) return false;
    if (scheduleFilter === 'semua') return true;
    return t.scheduleDay === scheduleFilter;
  });

  const pickupCount = tasks.filter((t) => t.type === 'pickup' && !t.isConfirmed).length;
  const deliveryCount = tasks.filter((t) => t.type === 'delivery' && !t.isConfirmed).length;

  const handleConfirmAction = (task: CourierTask) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          return { ...t, isConfirmed: true };
        }
        return t;
      })
    );
    const actionLabel = task.type === 'pickup' ? 'dijemput' : 'diantar';
    setToastMessage(`Order ${task.id} berhasil dikonfirmasi ${actionLabel}!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-lg shrink-0">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_laundry_service
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">LaundryKu</span>
            </div>
            <div className="hidden md:flex items-center gap-2 pl-space-md bg-transparent">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Outlet Pusat (Aktif)</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl">
            <Link
              className="font-label-md text-label-md px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/kasir"
            >
              Dashboard Kasir
            </Link>
            <Link
              className="font-label-md text-label-md px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/kasir/order/baru"
            >
              Input Order Baru
            </Link>
            <Link
              className="font-label-md text-label-md px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/petugas"
            >
              Petugas Cuci
            </Link>
            <Link
              aria-current="page"
              className="font-label-md px-space-md py-1.5 rounded-lg transition-colors whitespace-nowrap bg-primary text-on-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              href="/kurir"
            >
              Kurir
            </Link>
            <Link
              className="font-label-md text-label-md px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/kurir/antar"
            >
              Mode Antar Mobile
            </Link>
          </nav>

          <div className="flex items-center gap-space-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold font-label-md">
                AW
              </div>
              <span className="hidden sm:inline font-label-md text-label-md text-on-surface font-medium">
                Aris Wicaksono
              </span>
            </div>
            <button
              className="p-1.5 rounded-lg text-outline hover:text-on-surface transition-colors cursor-pointer"
              title="Keluar"
              type="button"
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-16 min-h-[calc(100vh-48px)] bg-background">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-6xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
            {/* Courier Profile Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Portal Kurir Logistik
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Operasi Lapangan</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Tugas Jemput &amp; Antar</h1>
                <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">two_wheeler</span>
                  <span className="font-label-md text-label-md text-on-surface">Aris Wicaksono</span>
                  <span className="text-outline">•</span>
                  <span>Outlet Pusat (Kemang Raya)</span>
                </div>
              </div>

              {/* Task Stat Counters */}
              <div className="flex items-center gap-space-sm bg-surface-container-low p-1.5 rounded-xl">
                <div className="flex items-center gap-2 px-space-md py-2 bg-surface-container-lowest rounded-lg shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Jemput</span>
                    <span className="font-label-lg text-label-lg text-on-surface" id="stat-pickup-count">
                      {pickupCount} Tugas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-space-md py-2 bg-surface-container-lowest rounded-lg shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Antar</span>
                    <span className="font-label-lg text-label-lg text-on-surface" id="stat-delivery-count">
                      {deliveryCount} Tugas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Controls & Filter Tabs */}
            <div className="flex flex-col gap-space-md">
              {/* Type Switcher: Penjemputan / Pengantaran */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="inline-flex p-1 bg-surface-container-low rounded-xl gap-1" role="tablist">
                  <button
                    aria-selected={activeTab === 'pickup'}
                    className={`px-space-lg py-2.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'pickup'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    id="tab-btn-pickup"
                    onClick={() => setActiveTab('pickup')}
                    role="tab"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">package_2</span>
                    <span>Penjemputan</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                        activeTab === 'pickup'
                          ? 'bg-on-primary text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {pickupCount}
                    </span>
                  </button>

                  <button
                    aria-selected={activeTab === 'delivery'}
                    className={`px-space-lg py-2.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'delivery'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    id="tab-btn-delivery"
                    onClick={() => setActiveTab('delivery')}
                    role="tab"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    <span>Pengantaran</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                        activeTab === 'delivery'
                          ? 'bg-on-primary text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {deliveryCount}
                    </span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-outline font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Sistem sinkronisasi live GPS</span>
                </div>
              </div>

              {/* SPECIAL REQUIREMENT: Schedule Filter Tabs [ Semua ] [ Hari Ini ] [ Besok ] */}
              <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setScheduleFilter('semua')}
                  className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                    scheduleFilter === 'semua'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleFilter('hari-ini')}
                  className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                    scheduleFilter === 'hari-ini'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleFilter('besok')}
                  className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                    scheduleFilter === 'besok'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Besok
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {currentTasks.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-outline bg-surface-container-lowest rounded-xl shadow-xs">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-outline">done_all</span>
                    <p className="font-label-lg text-label-lg">Tidak ada tugas pada filter jadwal ini.</p>
                  </div>
                ) : (
                  currentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col gap-space-md">
                        {/* Top Header of Card */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                              Order ID
                            </span>
                            <p className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                              {task.id}
                            </p>
                          </div>
                          {task.isConfirmed ? (
                            <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Selesai
                            </span>
                          ) : task.type === 'pickup' ? (
                            <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-tertiary-fixed/30 text-tertiary font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                              Menunggu Penjemputan
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-secondary-fixed/40 text-secondary font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              Siap Diantar
                            </span>
                          )}
                        </div>

                        {/* Customer Info */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h2 className="font-label-lg text-label-lg text-on-surface font-bold">{task.customerName}</h2>
                            <a
                              className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary hover:underline"
                              href={`https://wa.me/62${task.phone.replace(/[^0-9]/g, '').slice(1)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                              <span>{task.phone}</span>
                            </a>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            Layanan: <strong className="text-on-surface font-medium">{task.service}</strong>
                          </p>

                          {/* SPECIAL REQUIREMENT: Satu baris info jadwal (12px, warna #757575) */}
                          <div className="flex items-center gap-1.5 mt-1" style={{ color: '#757575', fontSize: '12px' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ color: '#757575' }}>
                              calendar_today
                            </span>
                            <span className="font-medium">{task.scheduleText}</span>
                          </div>
                        </div>

                        {/* Address Block */}
                        <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">
                              location_on
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                                {task.type === 'pickup' ? 'Alamat Jemput:' : 'Alamat Pengantaran:'}
                              </span>
                              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                {task.address}
                              </p>
                              <p className="font-body-sm text-body-sm text-primary font-medium mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">flag</span>
                                <span>{task.landmark}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Note or Payment Box */}
                        {task.type === 'pickup' && task.note && (
                          <div className="p-2.5 bg-surface-container rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">info</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Catatan: <span className="font-semibold text-on-surface">{task.note}</span>
                            </span>
                          </div>
                        )}

                        {task.type === 'delivery' && task.totalBill && (
                          <div className="bg-surface-container p-space-md rounded-lg flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                                Total Tagihan
                              </span>
                              <span
                                className={`font-headline-sm text-headline-sm font-bold ${
                                  task.paymentStatus === 'cod' ? 'text-error' : 'text-secondary'
                                }`}
                              >
                                {task.totalBill}
                              </span>
                            </div>
                            {task.paymentStatus === 'cod' ? (
                              <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container font-bold">
                                Tunai / COD
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Lunas (QRIS)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-space-md flex flex-col gap-2 mt-4">
                        <a
                          className="w-full py-2.5 px-space-md rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center justify-center gap-2"
                          href={task.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-primary">directions</span>
                          <span>Buka Google Maps</span>
                        </a>

                        <button
                          className={`w-full py-3 px-space-md rounded-lg transition-colors font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                            task.isConfirmed
                              ? 'bg-surface-container text-outline'
                              : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
                          }`}
                          onClick={() => handleConfirmAction(task)}
                          type="button"
                          disabled={task.isConfirmed}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {task.isConfirmed ? 'check' : task.type === 'pickup' ? 'task_alt' : 'verified'}
                          </span>
                          <span>
                            {task.isConfirmed
                              ? task.type === 'pickup'
                                ? 'Sudah Dijemput'
                                : 'Sudah Diantar'
                              : task.type === 'pickup'
                              ? 'Konfirmasi Sudah Dijemput'
                              : 'Konfirmasi Sudah Diantar'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="w-full bg-surface-container-low p-space-md rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                <span>Butuh koordinasi darurat dengan workshop atau pelanggan?</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  className="flex-1 sm:flex-none text-center px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                  href="tel:0217988899"
                >
                  Hubungi Admin Outlet
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div
          className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-lg flex items-center gap-space-sm ${
            toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
          id="toast"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-[22px]">check_circle</span>
          <span className="font-body-md text-body-md font-medium" id="toast-text">
            {toastMessage}
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-sm border-t border-surface-variant/30">
        <div className="w-full max-w-6xl mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span>© 2026 LaundryKu Driver Operational Logistics.</span>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5 text-secondary font-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>GPS Active
            </span>
            <span className="text-outline">v2.4.0-mobile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
