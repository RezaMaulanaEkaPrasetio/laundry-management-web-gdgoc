'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MobileTask {
  id: string;
  type: 'pickup' | 'delivery';
  scheduleDay: 'semua' | 'hari-ini' | 'besok';
  serviceType: string;
  statusBadge: string;
  badgeType: 'ready' | 'scheduled' | 'completed';
  customerName: string;
  serviceDesc: string;
  weight: string;
  weightSub: string;
  phone: string;
  scheduleText: string;
  paymentType: 'cod' | 'prepaid' | 'scheduled';
  totalBill: string;
  paymentNotice?: string;
  address: string;
  landmark: string;
  note?: string;
  mapsUrl: string;
  accentColor: string;
  isConfirmed?: boolean;
}

const INITIAL_MOBILE_TASKS: MobileTask[] = [
  {
    id: '#LKU-260920',
    type: 'delivery',
    scheduleDay: 'hari-ini',
    serviceType: 'Reguler',
    statusBadge: 'Siap Diantar',
    badgeType: 'ready',
    customerName: 'Bpk. Rahmat Hidayat',
    serviceDesc: 'Cuci Komplit Reguler (Kiloan)',
    weight: '6.2 kg',
    weightSub: '(1 Kantong Segel)',
    phone: '081298765432',
    scheduleText: 'Jemput: Senin, 28 Sep · 10.00',
    paymentType: 'cod',
    totalBill: 'Rp 49.600',
    paymentNotice: 'Wajib tagih tunai atau minta scan QRIS kurir sebelum serah terima.',
    address: 'Jl. Ampera Raya No. 18, Cilandak Timur, Pasar Minggu, Jakarta Selatan',
    landmark: 'Pagar kayu cokelat sebelah Indomaret Ampera',
    note: '"Bel di pagar rusak, mohon telepon/WA jika sudah di depan gerbang."',
    mapsUrl: 'https://maps.google.com/?q=Jl.+Ampera+Raya+No.+18+Cilandak+Timur',
    accentColor: 'bg-tertiary-fixed-dim',
  },
  {
    id: '#LKU-260912',
    type: 'delivery',
    scheduleDay: 'hari-ini',
    serviceType: 'Express',
    statusBadge: 'Siap Diantar',
    badgeType: 'ready',
    customerName: 'Ny. Dewi Sartika',
    serviceDesc: 'Cuci Kering Lipat Express (Kiloan)',
    weight: '4.5 kg',
    weightSub: '(1 Tas Tenteng LaundryKu)',
    phone: '081311223344',
    scheduleText: 'Jemput: Senin, 28 Sep · 10.00',
    paymentType: 'prepaid',
    totalBill: 'Rp 36.000 (LUNAS QRIS)',
    paymentNotice: 'Tidak perlu menagih ongkos apa pun.',
    address: 'Apartemen Kemang Village, Tower Ritz Lantai 15 Unit 15C, Jl. Pangeran Antasari No. 36',
    landmark: 'Drop di lobi receptionist atau titip concierge',
    note: '"Sudah lunas via QRIS. Foto bukti serah terima ke resepsionis."',
    mapsUrl: 'https://maps.google.com/?q=Kemang+Village+Tower+Ritz',
    accentColor: 'bg-secondary',
  },
  {
    id: '#LKU-260935',
    type: 'delivery',
    scheduleDay: 'besok',
    serviceType: 'Reguler',
    statusBadge: 'Terjadwal',
    badgeType: 'scheduled',
    customerName: 'Ibu Maya Lestari',
    serviceDesc: 'Cuci Komplit Reguler (Kiloan)',
    weight: '5.0 kg',
    weightSub: '(Estimasi Penjemputan)',
    phone: '081288997766',
    scheduleText: 'Jemput: Senin, 28 Sep · 10.00',
    paymentType: 'scheduled',
    totalBill: 'Rp 40.000 (Estimasi)',
    paymentNotice: 'Sesuai slot request pelanggan (10:00 - 11:30)',
    address: 'Jl. Bangka Raya No. 42, RT 05 / RW 02, Mampang Prapatan, Jakarta Selatan',
    landmark: 'Pagar hitam, seberang Apotek K-24',
    mapsUrl: 'https://maps.google.com/?q=Jl.+Bangka+Raya+No.+42',
    accentColor: 'bg-primary',
  },
];

export default function MobileCourierAntarPage() {
  const [activeTab, setActiveTab] = useState<'antar' | 'jemput'>('antar');
  const [scheduleFilter, setScheduleFilter] = useState<'semua' | 'hari-ini' | 'besok'>('hari-ini');
  const [tasks, setTasks] = useState<MobileTask[]>(INITIAL_MOBILE_TASKS);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    orderId: string;
    amount?: string;
    isCOD: boolean;
  }>({
    isOpen: false,
    orderId: '',
    isCOD: false,
  });

  const displayedTasks = tasks.filter((t) => {
    if (scheduleFilter === 'semua') return true;
    return t.scheduleDay === scheduleFilter;
  });

  const handleOpenModal = (task: MobileTask) => {
    setModalState({
      isOpen: true,
      orderId: task.id,
      amount: task.totalBill,
      isCOD: task.paymentType === 'cod',
    });
  };

  const handleCloseModal = (isSuccess: boolean) => {
    if (isSuccess && modalState.orderId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === modalState.orderId ? { ...t, isConfirmed: true, statusBadge: 'Selesai' } : t))
      );
      alert(`Tugas ${modalState.orderId} berhasil diselesaikan! Data tersinkron ke POS kasir.`);
    }
    setModalState({ isOpen: false, orderId: '', isCOD: false });
  };

  return (
    <div className="bg-surface-dim min-h-screen flex justify-center selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Mobile Frame Container max-w-[430px] */}
      <div className="w-full max-w-[430px] bg-surface font-body-md text-on-surface antialiased flex flex-col min-h-screen relative shadow-2xl overflow-x-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_laundry_service
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-primary tracking-tight truncate">LaundryKu</span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container">
                    Kurir
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Penugasan Mobile</span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-md text-label-md text-on-surface whitespace-nowrap">Aris • Lapangan</span>
              </div>
              <Link
                href="/kurir"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary"
                title="Desktop View"
              >
                <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Main Section */}
        <main className="flex flex-col relative w-full pb-32 px-margin bg-surface flex-grow">
          <div className="flex flex-col w-full pb-6 pt-2">
            {/* Location Info Banner */}
            <div className="flex items-center justify-between mb-space-sm pt-space-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface">
                <span
                  className="material-symbols-outlined text-[16px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  storefront
                </span>
                <span className="font-label-sm text-label-sm font-semibold tracking-wide">Outlet Kemang Raya</span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                <span>Sinkronisasi Aktif</span>
              </div>
            </div>

            {/* Operational Header Title */}
            <div className="flex flex-col mb-space-md">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-bold">
                Tugas Lapangan Hari Ini
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Antarkan cucian bersih &amp; tagih pembayaran bila belum lunas.
              </p>
            </div>

            {/* Segmented Control / Filter Tabs */}
            <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl gap-1 mb-space-lg shadow-sm">
              <button
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'jemput'
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => {
                  setActiveTab('jemput');
                  window.location.href = '/kurir';
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span className="font-label-lg text-label-lg">Jemput</span>
                <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                  3
                </span>
              </button>

              <button
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'antar'
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('antar')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_shipping
                </span>
                <span className="font-label-lg text-label-lg font-bold">Antar</span>
                <span className="px-1.5 py-0.2 rounded-full bg-on-primary/20 text-on-primary font-label-sm text-label-sm font-bold">
                  {displayedTasks.length}
                </span>
              </button>
            </div>

            {/* Route Overview Glance Widget */}
            <div className="bg-surface-container-low rounded-xl p-space-md mb-space-lg flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">check_box</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Target Pengantaran Siang
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Selesaikan sebelum 15:00 WIB</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {displayedTasks.filter((t) => t.isConfirmed).length} / {displayedTasks.length}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Selesai</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-space-sm overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setScheduleFilter('semua')}
                className={`px-3 py-1 rounded-full text-label-sm font-label-sm transition-colors whitespace-nowrap cursor-pointer ${
                  scheduleFilter === 'semua'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setScheduleFilter('hari-ini')}
                className={`px-3 py-1 rounded-full text-label-sm font-label-sm transition-colors whitespace-nowrap cursor-pointer ${
                  scheduleFilter === 'hari-ini'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setScheduleFilter('besok')}
                className={`px-3 py-1 rounded-full text-label-sm font-label-sm transition-colors whitespace-nowrap cursor-pointer ${
                  scheduleFilter === 'besok'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Besok
              </button>
            </div>

            {/* Delivery Queue Task Cards */}
            <div className="flex flex-col gap-space-lg">
              {displayedTasks.map((task) => (
                <article
                  key={task.id}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col gap-space-md relative overflow-hidden"
                >
                  {/* Top Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${task.accentColor}`}></div>

                  {/* Header: ID + Badges */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface tracking-tight font-mono">
                        {task.id}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-dim"></span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                        {task.serviceType}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                        task.isConfirmed
                          ? 'bg-secondary-container text-on-secondary-container'
                          : task.badgeType === 'scheduled'
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          task.isConfirmed
                            ? 'bg-secondary'
                            : task.badgeType === 'scheduled'
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                      ></span>
                      {task.isConfirmed ? 'Selesai' : task.statusBadge}
                    </span>
                  </div>

                  {/* Customer Detail & Callout */}
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-lg text-body-lg font-bold text-on-surface truncate">
                        {task.customerName}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-primary">local_laundry_service</span>
                        <span className="font-body-sm text-body-sm font-medium">{task.serviceDesc}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-outline">scale</span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">{task.weight}</span>
                        <span className="text-on-surface-variant font-body-sm text-body-sm">{task.weightSub}</span>
                      </div>
                    </div>

                    <a
                      aria-label="Telepon Pelanggan"
                      className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm flex-shrink-0"
                      href={`tel:${task.phone}`}
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        call
                      </span>
                    </a>
                  </div>

                  {/* Schedule Line */}
                  <div className="flex items-center gap-1.5 px-0.5 text-[12px] font-body-sm" style={{ color: '#757575' }}>
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>{task.scheduleText}</span>
                  </div>

                  {/* SPECIAL REQUIREMENT: TOTAL TAGIHAN TAMPIL JELAS */}
                  {task.paymentType === 'cod' && (
                    <div className="rounded-xl p-3 bg-tertiary-fixed/30 text-on-surface flex items-start gap-2.5 border border-tertiary-fixed-dim/40">
                      <div className="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-bold">
                            Tagihan COD
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                            Belum Lunas
                          </span>
                        </div>
                        {/* Total Tagihan Tampil Jelas & Menonjol */}
                        <span className="font-headline-sm text-headline-sm font-black text-on-surface mt-0.5">
                          {task.totalBill}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {task.paymentNotice}
                        </span>
                      </div>
                    </div>
                  )}

                  {task.paymentType === 'prepaid' && (
                    <div className="rounded-xl p-3 bg-secondary-container/40 text-on-surface flex items-center justify-between border border-secondary/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            {/* Total Tagihan Tampil Jelas & Menonjol */}
                            <span className="font-label-lg text-label-lg font-black text-secondary">
                              {task.totalBill}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {task.paymentNotice}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-secondary text-[24px]">task_alt</span>
                    </div>
                  )}

                  {task.paymentType === 'scheduled' && (
                    <div className="rounded-xl p-3 flex items-center justify-between bg-primary-fixed/30 border border-primary/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                        </div>
                        <div className="flex flex-col">
                          {/* Total Tagihan Tampil Jelas & Menonjol */}
                          <span className="font-label-lg text-label-lg font-black text-primary">
                            {task.totalBill}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {task.paymentNotice}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Box */}
                  <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span
                        className="material-symbols-outlined text-[18px] text-error flex-shrink-0 mt-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        location_on
                      </span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">Alamat Tujuan:</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          {task.address}
                        </p>
                      </div>
                    </div>
                    <div className="bg-surface-container rounded-lg p-2.5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <span className="material-symbols-outlined text-[15px] text-outline">signpost</span>
                        <span className="font-label-sm text-label-sm font-bold">Patokan:</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{task.landmark}</span>
                      </div>
                      {task.note && (
                        <div className="flex items-start gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-[15px] text-tertiary flex-shrink-0 mt-0.5">
                            sticky_note_2
                          </span>
                          <span className="font-label-sm text-label-sm font-bold text-tertiary flex-shrink-0">
                            Catatan:
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant italic">
                            {task.note}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-1">
                    <a
                      className="w-full h-11 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                      href={task.mapsUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">map</span>
                      <span>Buka Google Maps</span>
                    </a>

                    {task.paymentType === 'cod' ? (
                      <button
                        className="w-full h-12 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
                        onClick={() => handleOpenModal(task)}
                        type="button"
                        disabled={task.isConfirmed}
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          paid
                        </span>
                        <span className="font-bold">
                          {task.isConfirmed ? 'Pembayaran Diterima' : 'Terima Pembayaran &amp; Antar'}
                        </span>
                      </button>
                    ) : task.paymentType === 'prepaid' ? (
                      <button
                        className="w-full h-12 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
                        onClick={() => handleOpenModal(task)}
                        type="button"
                        disabled={task.isConfirmed}
                      >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span className="font-bold">
                          {task.isConfirmed ? 'Sudah Diantar' : 'Konfirmasi Sudah Diantar'}
                        </span>
                      </button>
                    ) : (
                      <button
                        className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:opacity-90 transition-colors shadow-sm active:scale-[0.99] cursor-pointer"
                        type="button"
                        onClick={() => alert(`Memulai penjemputan untuk order ${task.id}`)}
                      >
                        <span className="material-symbols-outlined text-[20px]">directions_run</span>
                        <span className="font-bold">Mulai Penjemputan</span>
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Dispatcher Assistance Box */}
            <div className="mt-space-xl bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-tertiary">support_agent</span>
                <span className="font-headline-sm text-headline-sm">Bantuan Kurir Lapangan</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Ada kendala alamat atau pelanggan tidak di tempat? Hubungi admin segera. Tim outlet siap membantu verifikasi atau mengatur ulang jadwal pengiriman.
              </p>
              <a
                className="mt-1 w-full h-11 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                href="tel:08123456789"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">phone_in_talk</span>
                <span>Hubungi Dispatcher Outlet</span>
              </a>
            </div>
          </div>
        </main>

        {/* Modal Confirmation */}
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity">
            <div className="bg-surface-container-lowest w-full max-w-sm rounded-xl p-space-lg shadow-xl flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </div>
              <div className="text-center flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {modalState.isCOD ? 'Konfirmasi COD &amp; Serah Terima' : 'Konfirmasi Serah Terima'}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {modalState.isCOD ? (
                    <>
                      Pastikan uang tunai senilai{' '}
                      <strong className="text-on-surface font-bold">{modalState.amount}</strong> untuk pesanan{' '}
                      <span className="font-mono text-primary font-bold">{modalState.orderId}</span> sudah Anda terima fisik.
                    </>
                  ) : (
                    `Pesanan ${modalState.orderId} siap ditandai selesai. Pastikan foto tanda terima telah tersimpan di galeri.`
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center cursor-pointer"
                  onClick={() => handleCloseModal(true)}
                  type="button"
                >
                  Selesai &amp; Simpan Bukti
                </button>
                <button
                  className="w-full h-10 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg font-medium flex items-center justify-center cursor-pointer"
                  onClick={() => handleCloseModal(false)}
                  type="button"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Fixed Bottom Navigation Bar */}
        <footer className="fixed bottom-0 w-full max-w-[430px] z-40 bg-surface/95 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.03)] border-t border-surface-variant/30">
          <div className="px-margin pt-space-xs pb-1 flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">LaundryKu Kurir v1.0 Mobile</span>
            <a
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-error bg-error-container/40 px-2 py-0.5 rounded-full hover:bg-error-container/70 transition-colors"
              href="tel:08123456789"
            >
              <span className="material-symbols-outlined text-[14px]">emergency_home</span>
              <span>Hubungi Outlet</span>
            </a>
          </div>
          <nav className="flex justify-around items-center h-14 px-gutter">
            <Link
              className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] text-primary font-bold transition-colors"
              href="/kurir/antar"
            >
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              <span className="font-label-sm text-label-sm mt-0.5">Penugasan</span>
            </Link>
            <Link
              className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] text-on-surface-variant transition-colors hover:text-on-surface"
              href="/kurir"
            >
              <span className="material-symbols-outlined text-[22px]">history_edu</span>
              <span className="font-label-sm text-label-sm mt-0.5">Riwayat</span>
            </Link>
            <Link
              className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] text-on-surface-variant transition-colors hover:text-on-surface"
              href="/petugas"
            >
              <span className="material-symbols-outlined text-[22px]">bar_chart</span>
              <span className="font-label-sm text-label-sm mt-0.5">Performa</span>
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
