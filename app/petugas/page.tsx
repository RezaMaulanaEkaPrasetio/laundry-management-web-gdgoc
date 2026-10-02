'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WorkshopOrder {
  id: string;
  category: 'need-weight' | 'washing' | 'completed';
  customerName: string;
  service: string;
  arrivalTime?: string;
  courier?: string;
  specialNote?: string;
  specialNoteType?: 'warning' | 'info' | 'scent';
  weight: number;
  drum?: string;
  rack?: string;
  completedTime?: string;
  timerDuration?: string;
  targetTime?: string;
  isTransferred?: boolean;
}

const INITIAL_ORDERS: WorkshopOrder[] = [
  {
    id: '#LKU-260918',
    category: 'need-weight',
    customerName: 'Bpk. Hendra Gunawan',
    service: 'Reguler Cuci Kering Lipat',
    arrivalTime: '10:15 WIB',
    courier: 'Aris Nugraha',
    specialNote: 'Pisahkan kemeja putih dan baju rajut halus. Gunakan kantong jaring laundry (laundry net).',
    specialNoteType: 'warning',
    weight: 4.25,
  },
  {
    id: '#LKU-260920',
    category: 'need-weight',
    customerName: 'Bpk. Rahmat Hidayat',
    service: 'Cuci Selimut / Bedcover',
    arrivalTime: '10:30 WIB',
    courier: 'Fajar Malik',
    specialNote: 'Bedcover King Size tebal + 2 sarung bantal guling. Cuci terpisah di mesin drum 10kg.',
    specialNoteType: 'info',
    weight: 6.5,
  },
  {
    id: '#LKU-260915',
    category: 'washing',
    customerName: 'Ibu Siti Rahma',
    service: 'Express Cuci Komplit',
    drum: 'Tabung 03',
    weight: 5.8,
    specialNote: 'Pewangi Lavender Ekstra (Hypoallergenic)',
    specialNoteType: 'scent',
    timerDuration: '35:12',
    targetTime: '11:15 WIB',
  },
  {
    id: '#LKU-260912',
    category: 'completed',
    customerName: 'Ny. Dewi Sartika',
    service: 'Cuci Kering Setrika',
    rack: 'Rak P-04',
    weight: 3.0,
    completedTime: '09:40 WIB',
  },
];

export default function PetugasWorkshopPage() {
  const [activeTab, setActiveTab] = useState<'need-weight' | 'washing' | 'completed'>('need-weight');
  const [orders, setOrders] = useState<WorkshopOrder[]>(INITIAL_ORDERS);
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  // Tab counts
  const needWeightCount = orders.filter((o) => o.category === 'need-weight').length;
  const washingCount = orders.filter((o) => o.category === 'washing').length;
  const completedCount = orders.filter((o) => o.category === 'completed').length;

  // Filtered orders
  const displayedOrders = orders.filter((o) => o.category === activeTab);

  const handleAdjustWeight = (id: string, delta: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const newWeight = Math.max(0.1, +(o.weight + delta).toFixed(2));
          return { ...o, weight: newWeight };
        }
        return o;
      })
    );
  };

  const handleWeightInputChange = (id: string, val: string) => {
    const num = parseFloat(val);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return { ...o, weight: isNaN(num) ? 0 : num };
        }
        return o;
      })
    );
  };

  const handleSaveAndStartWash = (id: string) => {
    setSavingOrderId(id);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === id) {
            return {
              ...o,
              category: 'washing',
              drum: 'Tabung 05',
              timerDuration: '45:00',
              targetTime: '12:00 WIB',
            };
          }
          return o;
        })
      );
      setSavingOrderId(null);
      setActiveTab('washing');
    }, 700);
  };

  const handleMarkCompleted = (id: string) => {
    setSavingOrderId(id);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === id) {
            return {
              ...o,
              category: 'completed',
              rack: 'Rak P-09',
              completedTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            };
          }
          return o;
        })
      );
      setSavingOrderId(null);
      setActiveTab('completed');
    }, 600);
  };

  const handleTransferToPacking = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return { ...o, isTransferred: true };
        }
        return o;
      })
    );
  };

  const handlePrintRackTag = (id: string) => {
    alert(`Mencetak Struk Tag Rak untuk ${id} ke printer thermal workshop 80mm.`);
  };

  const handleScaleSyncSimulation = () => {
    alert('Status Sensor: Timbangan Digital USB Merk Henherr (Model W-30) terhubung secara presisi.');
  };

  const counterLabel = {
    'need-weight': `Menampilkan ${needWeightCount} antrean timbang prioritas kedatangan kurir`,
    washing: `Menampilkan ${washingCount} mesin cuci dalam siklus aktif`,
    completed: `Menampilkan ${completedCount} order siap disetrika & packing`,
  }[activeTab];

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-lg shrink-0">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[22px]">local_laundry_service</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">LaundryKu</span>
            </div>
            <div className="hidden xl:flex items-center gap-space-sm pl-space-md py-1 bg-surface-container-low rounded-full pr-space-md">
              <span className="material-symbols-outlined text-outline text-[18px]">storefront</span>
              <span className="font-label-md text-label-md text-on-surface">Outlet Utama</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>Buka
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl">
            <Link
              className="font-label-lg text-label-lg px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/kasir"
            >
              Dashboard Kasir
            </Link>
            <Link
              className="font-label-lg text-label-lg px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/kasir/order/baru"
            >
              Input Order Baru
            </Link>
            <Link
              aria-current="page"
              className="px-space-md py-2 transition-colors whitespace-nowrap bg-primary-container text-on-primary-container font-label-lg rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              href="/petugas"
            >
              Petugas Cuci (Workshop)
            </Link>
            <Link
              className="font-label-lg text-label-lg px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              href="/kasir/riwayat"
            >
              Riwayat &amp; Transaksi
            </Link>
          </nav>

          <div className="flex items-center gap-space-md shrink-0">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="font-label-md text-label-md text-on-surface">Kamis, 24 Okt 2026</span>
              <span className="font-body-sm text-body-sm text-outline">14:32:05 WIB</span>
            </div>
            <button
              aria-label="Notifikasi Operasional"
              className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
            </button>
            <div className="flex items-center gap-space-xs">
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer"
                title="Ganti Peran atau Cabang"
                type="button"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span className="hidden xl:inline">Switch</span>
              </button>
              <button
                className="p-1.5 rounded-lg hover:bg-error-container text-outline hover:text-on-error-container transition-colors cursor-pointer"
                title="Keluar dari Aplikasi"
                type="button"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 bg-background">
        <div className="flex flex-col w-full">
          <div className="w-full px-margin py-space-lg flex flex-col gap-space-lg">
            {/* Top Area: Operational Title + Telemetry Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    Workshop Aktif
                  </span>
                  <span className="text-outline font-label-md text-label-md">• Shift Pagi (08:00 - 16:00)</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Workshop Pencucian</h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Kelola cucian masuk dari kurir, input berat timbangan riil, dan perbarui proses cuci tanpa distraksi finansial.
                </p>
              </div>

              {/* Machine Telemetry Widget */}
              <div className="flex items-center gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Kapasitas Mesin
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">6 / 8 Aktif</span>
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-px bg-surface-variant"></div>
                <div className="flex flex-col pr-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Total Beban Hari Ini
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    148.5 <span className="font-label-md text-label-md text-on-surface-variant font-normal">kg</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Navigation Filters */}
            <div className="w-full bg-surface-container-low p-1.5 rounded-xl flex flex-wrap gap-space-xs">
              <button
                className={`flex-1 min-w-[240px] flex items-center justify-between px-space-md py-3 rounded-lg font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeTab === 'need-weight'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('need-weight')}
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-primary">scale</span>
                  <span>Cucian Tiba / Perlu Ditimbang</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
                  {needWeightCount}
                </span>
              </button>

              <button
                className={`flex-1 min-w-[240px] flex items-center justify-between px-space-md py-3 rounded-lg font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeTab === 'washing'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('washing')}
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-tertiary">water_drop</span>
                  <span>Sedang Dicuci (Mesin Aktif)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
                  {washingCount}
                </span>
              </button>

              <button
                className={`flex-1 min-w-[240px] flex items-center justify-between px-space-md py-3 rounded-lg font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('completed')}
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
                  <span>Selesai Cuci (Siap Setrika / Packing)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                  {completedCount}
                </span>
              </button>
            </div>

            {/* Active Task Overview Indicator */}
            <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sort</span>
                <span>{counterLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
                  onClick={handleScaleSyncSimulation}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">sensors</span>
                  <span>Cek Koneksi Timbangan Digital</span>
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg w-full">
              {displayedOrders.map((order) => {
                const isWeightValid = order.weight >= 0.1;
                const isSaving = savingOrderId === order.id;

                if (order.category === 'need-weight') {
                  return (
                    <article
                      key={order.id}
                      className="workshop-card flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-lg justify-between transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col gap-space-md">
                        {/* Top Row: Order ID + Status Badge */}
                        <div className="flex items-center justify-between gap-space-sm">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                              {order.id}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-outline font-label-sm text-label-sm uppercase font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            Sudah Dijemput
                          </span>
                        </div>

                        {/* Middle Details */}
                        <div className="grid grid-cols-2 gap-space-md bg-surface-container-low p-space-md rounded-lg">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pelanggan</span>
                            <span className="font-headline-sm text-[18px] leading-tight text-on-surface font-bold mt-0.5">
                              {order.customerName}
                            </span>
                            <span className="font-body-sm text-body-sm text-outline mt-1">
                              Layanan: <strong className="text-on-surface font-medium">{order.service}</strong>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                              Tiba di Workshop
                            </span>
                            <div className="flex items-center gap-1 mt-0.5 text-on-surface font-label-lg text-label-lg font-bold">
                              <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                              {order.arrivalTime}
                            </div>
                            <span className="font-body-sm text-body-sm text-primary font-medium mt-1">
                              Kurir: {order.courier}
                            </span>
                          </div>
                        </div>

                        {/* Special Notice */}
                        {order.specialNote && (
                          <div
                            className={`flex items-start gap-2.5 p-3 rounded-lg ${
                              order.specialNoteType === 'warning'
                                ? 'bg-tertiary-fixed/30 text-on-surface'
                                : 'bg-surface-container text-on-surface'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] shrink-0 ${
                                order.specialNoteType === 'warning' ? 'text-tertiary' : 'text-outline'
                              }`}
                            >
                              {order.specialNoteType === 'warning' ? 'warning' : 'info'}
                            </span>
                            <div className="flex flex-col">
                              <span
                                className={`font-label-md text-label-md font-bold leading-tight ${
                                  order.specialNoteType === 'warning' ? 'text-tertiary' : 'text-on-surface'
                                }`}
                              >
                                {order.specialNoteType === 'warning' ? 'Instruksi Khusus Kasir:' : 'Spesifikasi Cucian:'}
                              </span>
                              <p className="font-body-sm text-body-sm text-on-surface mt-0.5">{order.specialNote}</p>
                            </div>
                          </div>
                        )}

                        {/* Weight Display & Quick Buttons */}
                        <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <label className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider">
                              Berat Timbangan Riil
                            </label>
                            <span className="text-primary font-label-sm text-label-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              Timbangan USB Terhubung
                            </span>
                          </div>
                          <div className="flex items-center gap-space-sm">
                            <button
                              className="h-14 w-14 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center font-headline-md text-headline-md shadow-sm active:scale-95 transition-all cursor-pointer"
                              onClick={() => handleAdjustWeight(order.id, -0.25)}
                              title="Kurang 0.25 kg"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[24px]">remove</span>
                            </button>
                            <div className="relative flex-1 flex items-center justify-center bg-surface-container-lowest rounded-lg px-space-md h-14 shadow-sm focus-within:ring-2 focus-within:ring-primary">
                              <input
                                className="w-full text-center bg-transparent border-0 font-display-scale-weight text-display-scale-weight text-on-surface font-extrabold focus:outline-none"
                                min="0.1"
                                step="0.05"
                                type="number"
                                value={order.weight || ''}
                                onChange={(e) => handleWeightInputChange(order.id, e.target.value)}
                              />
                              <span className="absolute right-4 font-headline-sm text-headline-sm text-outline font-bold select-none">
                                kg
                              </span>
                            </div>
                            <button
                              className="h-14 w-14 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center font-headline-md text-headline-md shadow-sm active:scale-95 transition-all cursor-pointer"
                              onClick={() => handleAdjustWeight(order.id, 0.25)}
                              title="Tambah 0.25 kg"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[24px]">add</span>
                            </button>
                          </div>
                          <div
                            className={`font-body-sm text-body-sm mt-2 text-center ${
                              isWeightValid ? 'text-outline' : 'text-error font-bold'
                            }`}
                          >
                            {isWeightValid
                              ? `Minimal 0.1 kg (Presisi timbangan: ${order.weight.toFixed(2)} kg)`
                              : 'Peringatan: Berat tidak valid! Minimal 0.1 kg'}
                          </div>
                        </div>
                      </div>

                      {/* Primary Action Button */}
                      <div className="mt-space-lg pt-space-md flex flex-col gap-2">
                        <button
                          className="w-full h-12 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                          onClick={() => handleSaveAndStartWash(order.id)}
                          type="button"
                          disabled={!isWeightValid || isSaving}
                        >
                          {isSaving ? (
                            <>
                              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                              <span>Menyimpan ke Sistem...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[20px]">water_lux</span>
                              <span>Simpan Berat &amp; Mulai Cuci</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                }

                if (order.category === 'washing') {
                  return (
                    <article
                      key={order.id}
                      className="workshop-card flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-lg justify-between transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col gap-space-md">
                        {/* Top Row: Order ID + Status Badge */}
                        <div className="flex items-center justify-between gap-space-sm">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-tertiary text-[20px]">local_laundry_service</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                              {order.id}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm uppercase font-bold">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-spin"></span>
                            Sedang Dicuci
                          </span>
                        </div>

                        {/* Middle Details */}
                        <div className="grid grid-cols-2 gap-space-md bg-surface-container-low p-space-md rounded-lg">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pelanggan</span>
                            <span className="font-headline-sm text-[18px] leading-tight text-on-surface font-bold mt-0.5">
                              {order.customerName}
                            </span>
                            <span className="font-body-sm text-body-sm text-outline mt-1">
                              Layanan: <strong className="text-on-surface font-medium">{order.service}</strong>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                              Alokasi Workshop
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-md text-label-md font-bold">
                                {order.drum}
                              </span>
                              <span className="font-label-md text-label-md text-primary font-bold">{order.weight} kg</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-secondary font-semibold mt-1">
                              ✓ Berat Terverifikasi
                            </span>
                          </div>
                        </div>

                        {/* Special Note Tag */}
                        {order.specialNote && (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface">
                            <span className="material-symbols-outlined text-primary text-[18px]">spa</span>
                            <span className="font-body-sm text-body-sm">
                              Catatan Cuci: <strong>{order.specialNote}</strong>
                            </span>
                          </div>
                        )}

                        {/* Live Washing Timer Display */}
                        <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-lowest text-tertiary">
                              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-surface-variant"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                ></path>
                                <path
                                  className="text-tertiary stroke-current"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  strokeDasharray="70, 100"
                                  strokeLinecap="round"
                                  strokeWidth="3"
                                ></path>
                              </svg>
                              <span className="material-symbols-outlined absolute text-[20px] animate-spin">refresh</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                                Durasi Putaran Mesin
                              </span>
                              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                                {order.timerDuration}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Target Selesai</span>
                            <span className="font-label-lg text-label-lg font-bold text-on-surface">{order.targetTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Primary Action Button */}
                      <div className="mt-space-lg pt-space-md flex flex-col gap-2">
                        <button
                          className="w-full h-12 rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                          onClick={() => handleMarkCompleted(order.id)}
                          type="button"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                              <span>Memperbarui Kasir &amp; Kurir...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[20px]">task_alt</span>
                              <span>Tandai Selesai Dicuci</span>
                            </>
                          )}
                        </button>
                        <span className="text-center font-body-sm text-body-sm text-outline">
                          Memicu notifikasi tagihan ke kasir &amp; antrean lipat/packing
                        </span>
                      </div>
                    </article>
                  );
                }

                // Completed Card
                return (
                  <article
                    key={order.id}
                    className="workshop-card flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-lg justify-between transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col gap-space-md">
                      {/* Top Row: Order ID + Status Badge */}
                      <div className="flex items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                            {order.id}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-bold">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          Selesai Dicuci
                        </span>
                      </div>

                      {/* Middle Details */}
                      <div className="grid grid-cols-2 gap-space-md bg-surface-container-low p-space-md rounded-lg">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pelanggan</span>
                          <span className="font-headline-sm text-[18px] leading-tight text-on-surface font-bold mt-0.5">
                            {order.customerName}
                          </span>
                          <span className="font-body-sm text-body-sm text-outline mt-1">
                            Layanan: <strong className="text-on-surface font-medium">{order.service}</strong>
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                            Berat &amp; Rak Alokasi
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">
                              {order.weight.toFixed(2)} kg
                            </span>
                            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
                              {order.rack}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-outline mt-1">Selesai: {order.completedTime}</span>
                        </div>
                      </div>

                      {/* Stage Progress */}
                      <div className="flex flex-col gap-2 p-space-md rounded-xl bg-surface-container-low">
                        <div className="flex items-center justify-between font-label-md text-label-md">
                          <span className="text-on-surface font-bold">Status Serah Terima:</span>
                          <span className="text-secondary font-semibold">
                            {order.isTransferred ? 'Sudah Diserahkan ke Packing' : 'Siap Packing / Setrika'}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full rounded-full w-full"></div>
                        </div>
                        <div className="flex items-center justify-between font-body-sm text-body-sm text-outline">
                          <span>Cuci &amp; Pengeringan Selesai</span>
                          <span>Menunggu Pengambilan Kurir / Kasir</span>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Actions */}
                    <div className="mt-space-lg pt-space-md flex flex-col gap-2">
                      <div className="flex items-center gap-space-sm">
                        <button
                          className="flex-1 h-12 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                          onClick={() => handlePrintRackTag(order.id)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[20px]">print</span>
                          <span>Cetak Tag Rak</span>
                        </button>
                        <button
                          className="flex-1 h-12 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                          onClick={() => handleTransferToPacking(order.id)}
                          type="button"
                          disabled={order.isTransferred}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {order.isTransferred ? 'done_all' : 'arrow_forward'}
                          </span>
                          <span>{order.isTransferred ? 'Diserahkan' : 'Kirim ke Packing'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Quick Manual Barcode Scanner Simulation */}
            <div className="w-full bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Input Cepat via Barcode Kantong Laundry
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Pindai tag laundry yang ditempelkan kurir untuk langsung membuka kartu penimbangan
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-60"
                  placeholder="Scan Barcode / ID..."
                  type="text"
                  value={barcodeSearch}
                  onChange={(e) => setBarcodeSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && barcodeSearch) {
                      alert(`Memindai barcode ID: ${barcodeSearch}`);
                    }
                  }}
                />
                <button
                  className="h-10 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors shrink-0 cursor-pointer"
                  type="button"
                  onClick={() => {
                    if (barcodeSearch) alert(`Memindai barcode ID: ${barcodeSearch}`);
                  }}
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-sm shadow-[0_-1px_4px_rgba(0,0,0,0.02)]">
        <div className="w-full px-margin flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span>© 2026 LaundryKu POS Operational Engine. Seluruh hak cipta dilindungi.</span>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5 text-secondary font-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Sistem Cloud Terhubung
            </span>
            <span className="text-outline">v2.4.0-desktop</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
