'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatusLog {
  id: string;
  statusFrom: string;
  statusTo: string;
  changedAt: string;
  notes?: string;
  changedBy?: { name: string };
}

interface TrackedOrder {
  orderCode: string;
  customerName: string;
  status: string;
  serviceType: string;
  serviceSpeed: string;
  weightKg?: number | null;
  totalAmount: number | null;
  paymentStatus: string;
  createdAt: string;
  statusLogs: StatusLog[];
}

const STEPS = [
  {
    status: 'MENUNGGU_PENJEMPUTAN',
    title: 'Order Diterima / Menunggu Jemput',
    desc: 'Pesanan telah masuk ke sistem dan menunggu kurir/diterima kasir.',
    icon: 'inbox',
  },
  {
    status: 'SUDAH_DIJEMPUT',
    title: 'Sudah Dijemput Kurir',
    desc: 'Pakaian telah diambil dan sedang dibawa menuju workshop.',
    icon: 'two_wheeler',
  },
  {
    status: 'SEDANG_DICUCI',
    title: 'Sedang Dicuci & Ditimbang',
    desc: 'Pakaian ditimbang, dipilah sesuai warna/bahan, dan dicuci higienis.',
    icon: 'local_laundry_service',
  },
  {
    status: 'SELESAI_DICUCI',
    title: 'Selesai Cuci & Disetrika',
    desc: 'Pakaian telah kering, disetrika uap rapi, dan dipacking kedap udara.',
    icon: 'iron',
  },
  {
    status: 'SIAP_DIANTAR',
    title: 'Siap Diantar / Siap Diambil',
    desc: 'Pakaian bersih telah berada di rak siap antar atau siap diambil di outlet.',
    icon: 'local_shipping',
  },
  {
    status: 'MENUNGGU_PEMBAYARAN',
    title: 'Menunggu Konfirmasi Bayar',
    desc: 'Pakaian dalam proses serah terima dan menunggu pelunasan tagihan.',
    icon: 'payments',
  },
  {
    status: 'SELESAI',
    title: 'Pesanan Selesai ✓',
    desc: 'Cucian telah sampai ke tangan pelanggan dengan pembayaran lunas.',
    icon: 'task_alt',
  },
];

const STATUS_RANK: Record<string, number> = {
  MENUNGGU_PENJEMPUTAN: 1,
  SUDAH_DIJEMPUT: 2,
  SEDANG_DICUCI: 3,
  SELESAI_DICUCI: 4,
  SIAP_DIANTAR: 5,
  MENUNGGU_PEMBAYARAN: 6,
  SELESAI: 7,
  DIBATALKAN: 0,
};

export const STATUS_LABELS: Record<string, string> = {
  MENUNGGU_PENJEMPUTAN: 'Menunggu Jemput',
  SUDAH_DIJEMPUT: 'Sudah Dijemput',
  SEDANG_DICUCI: 'Sedang Dicuci',
  SELESAI_DICUCI: 'Selesai Cuci & Setrika',
  SIAP_DIANTAR: 'Siap Diantar',
  MENUNGGU_PEMBAYARAN: 'Menunggu Bayar',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

export default function LacakPage() {
  const [kodeOrder, setKodeOrder] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLacak = async (codeToSearch?: string) => {
    const targetCode = (codeToSearch || kodeOrder).trim();
    if (!targetCode) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/track/${targetCode.toUpperCase()}`);
      if (!res.ok) {
        setError('Order tidak ditemukan. Periksa kembali kode order Anda.');
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch {
      setError('Koneksi internet bermasalah. Silakan coba sesaat lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code') || params.get('order');
    if (codeParam) {
      setKodeOrder(codeParam);
      handleLacak(codeParam);
    }
  }, []);

  const handleDownloadInvoice = () => {
    if (!order) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 600);
  };

  const currentRank = order ? (STATUS_RANK[order.status] ?? 1) : 1;

  // Build a lookup map of logs
  const logMap = new Map<string, StatusLog>();
  if (order?.statusLogs) {
    order.statusLogs.forEach((log) => {
      logMap.set(log.statusTo, log);
    });
  }

  const getServiceLabel = (serviceType: string, speed: string) => {
    const typeLabel = serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
    return `${speed} • ${typeLabel}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans antialiased selection:bg-[#1677FF]/20 selection:text-[#1677FF]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#22C7D9] flex items-center justify-center text-white shadow-md shadow-[#1677FF]/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[#172B4D] tracking-tight leading-tight">
                Laundry<span className="text-[#1677FF]">Ku</span>
              </span>
              <span className="text-[11px] text-[#6B7280] font-medium leading-none">Pelacakan Pesanan</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors border border-emerald-200"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
              </svg>
              <span>Bantuan CS</span>
            </a>
            <Link
              href="/login"
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#172B4D] hover:bg-[#F1F5F9] transition-colors"
              title="Login Staf / Outlet"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container: Centered max-w-[500px] */}
      <main className="flex-1 w-full max-w-[500px] mx-auto px-4 py-6 sm:py-8">
        {/* Hero Singkat */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#1677FF] text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse"></span>
            Real-Time Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
            Lacak Status Laundry Anda
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Pantau progres pencucian higienis Anda mulai dari timbang hingga siap diantar.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.04)] mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLacak();
            }}
            className="flex flex-col gap-2"
          >
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </span>
              <input
                type="text"
                value={kodeOrder}
                onChange={(e) => setKodeOrder(e.target.value.toUpperCase())}
                placeholder="Contoh: LK-20260929-001"
                className="w-full pl-10 pr-9 py-3 text-base sm:text-lg font-mono font-bold tracking-wider text-[#172B4D] uppercase placeholder:text-[#94A3B8] placeholder:font-sans placeholder:normal-case placeholder:font-normal rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1677FF] focus:bg-white transition-all"
              />
              {kodeOrder && (
                <button
                  type="button"
                  onClick={() => setKodeOrder('')}
                  className="absolute right-3 p-1 text-[#94A3B8] hover:text-[#172B4D] transition-colors"
                  title="Hapus"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !kodeOrder.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-sm shadow-md shadow-[#1677FF]/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sedang Melacak...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Lacak Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading State: Skeleton Timeline */}
        {loading && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm mb-6 animate-pulse">
            <div className="h-6 bg-[#E2E8F0] rounded-md w-3/4 mb-4"></div>
            <div className="h-4 bg-[#E2E8F0] rounded-md w-1/2 mb-6"></div>

            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#E2E8F0] shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#E2E8F0] rounded w-2/3"></div>
                    <div className="h-3 bg-[#E2E8F0] rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error / Not Found State with Inline SVG */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-lg opacity-60"></div>
              {/* Inline SVG Magnifying glass with Question Mark */}
              <svg className="w-20 h-20 relative text-[#EA4335]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="45" cy="45" r="30" stroke="#EA4335" strokeWidth="6" strokeLinecap="round" />
                <path d="M68 68L88 88" stroke="#EA4335" strokeWidth="7" strokeLinecap="round" />
                <path d="M40 38C40 34 43 32 46 32C49 32 52 34 52 37C52 41 46 43 46 47" stroke="#EA4335" strokeWidth="4" strokeLinecap="round" />
                <circle cx="46" cy="54" r="2.5" fill="#EA4335" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#172B4D] mb-1">
              Order Tidak Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-xs mx-auto mb-4">
              Periksa kembali kode order Anda pada struk pembayaran atau pesan WhatsApp dari LaundryKu.
            </p>
            <button
              onClick={() => {
                setKodeOrder('');
                setError('');
              }}
              className="px-4 py-2 rounded-xl bg-[#F1F5F9] text-[#172B4D] hover:bg-[#E2E8F0] text-xs font-bold transition-colors cursor-pointer"
            >
              Coba Kode Lain
            </button>
          </div>
        )}

        {/* Initial Prompt State (before search) */}
        {!loading && !error && !order && !hasSearched && (
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-3 bg-[#F0F7FF] rounded-full flex items-center justify-center text-[#1677FF]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#172B4D] mb-1">
              Siap Memantau Cucian Anda
            </h3>
            <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
              Ketik kode order di atas untuk melihat status pencucian, berat timbangan, dan rincian pembayaran.
            </p>
          </div>
        )}

        {/* Success / Found State */}
        {!loading && order && (
          <div className="space-y-5">
            {/* 1. Order Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between pb-3.5 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6B7280] block">
                    Kode Order
                  </span>
                  <span className="font-mono font-black text-xl text-[#172B4D] tracking-tight">
                    {order.orderCode}
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                <div>
                  <span className="text-[#6B7280] block">Nama Pelanggan:</span>
                  <span className="font-bold text-[#172B4D] text-sm">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Jenis Layanan:</span>
                  <span className="font-bold text-[#172B4D]">
                    {getServiceLabel(order.serviceType, order.serviceSpeed)}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Berat Timbangan:</span>
                  <span className="font-bold text-[#172B4D]">
                    {order.weightKg ? `${Number(order.weightKg).toFixed(1)} kg` : 'Menunggu timbang'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Tanggal Masuk:</span>
                  <span className="font-medium text-[#172B4D]">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Total Tagihan Banner */}
              <div className="mt-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280]">Total Biaya</span>
                <span className="text-xl font-black text-[#172B4D]">
                  Rp {Number(order.totalAmount ?? 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* 2. Vertical Status Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F1F5F9]">
                <h2 className="text-sm font-extrabold text-[#172B4D] uppercase tracking-wider">
                  Timeline Pengerjaan
                </h2>
                <span className="text-xs font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Tahap {currentRank} dari 7
                </span>
              </div>

              <div className="relative pl-2">
                {STEPS.map((st, index) => {
                  const stepRank = index + 1;
                  const isDone = stepRank < currentRank;
                  const isCurrent = stepRank === currentRank;
                  const isFuture = stepRank > currentRank;
                  const matchedLog = logMap.get(st.status);
                  const isLast = index === STEPS.length - 1;

                  return (
                    <div key={st.status} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      {/* Connecting Vertical Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[15px] top-8 bottom-0 w-[2px] ${
                            isDone ? 'bg-[#34A853]' : 'bg-[#E2E8F0]'
                          }`}
                        />
                      )}

                      {/* Step Bullet Icon */}
                      <div className="relative z-10 shrink-0">
                        {isDone ? (
                          // Past Step: Bullet Hijau + Checkmark
                          <div className="w-8 h-8 rounded-full bg-[#34A853] text-white flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : isCurrent ? (
                          // Current Step: Bullet Biru dengan Pulse Animation
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white flex items-center justify-center shadow-md ring-4 ring-[#1677FF]/25 animate-pulse">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        ) : (
                          // Future Step: Bullet Abu-abu Muted
                          <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border-2 border-[#E2E8F0] text-[#94A3B8] flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]"></span>
                          </div>
                        )}
                      </div>

                      {/* Step Details */}
                      <div className={`flex-1 min-w-0 ${isFuture ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`text-sm font-bold ${
                              isCurrent ? 'text-[#1677FF]' : isDone ? 'text-[#172B4D]' : 'text-[#6B7280]'
                            }`}
                          >
                            {st.title}
                          </h3>
                          {isCurrent && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                              Sedang Proses
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                          {st.desc}
                        </p>

                        {matchedLog && (
                          <span className="inline-block text-[11px] font-medium text-[#94A3B8] mt-1">
                            {new Date(matchedLog.changedAt).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            WIB
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Action Buttons: Print Nota & WhatsApp CS */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="w-full py-3 px-4 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#172B4D] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#1677FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>{isDownloading ? 'Menyiapkan Nota...' : 'Cetak / Simpan Nota Pesanan'}</span>
              </button>

              <a
                href={`https://wa.me/6281234567890?text=Halo%20LaundryKu,%20saya%20ingin%20menanyakan%20status%20pesanan%20${order.orderCode}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                </svg>
                <span>Tanya Petugas via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="w-full bg-white border-t border-[#E5E7EB] py-4 mt-8">
        <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
          <span>© 2026 LaundryKu Cloud POS.</span>
          <div className="flex items-center gap-3">
            <Link href="/syarat" className="hover:text-[#172B4D] transition-colors">
              Syarat & Ketentuan
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-[#172B4D] transition-colors">
              Login Petugas
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
