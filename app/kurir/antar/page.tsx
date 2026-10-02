'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function MobileCourierAntarPage() {
  const { user } = useCurrentUser();
  const [ordersAntar, setOrdersAntar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [codCashReceived, setCodCashReceived] = useState<number>(50000);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    orderId: string;
    orderCode: string;
    amountNum: number;
    isPaid: boolean;
  }>({
    isOpen: false,
    orderId: '',
    orderCode: '',
    amountNum: 0,
    isPaid: false,
  });

  const fetchAntar = async () => {
    try {
      const res = await fetch('/api/orders?status=SIAP_DIANTAR');
      const data = await res.json();
      setOrdersAntar(Array.isArray(data) ? data : []);
    } catch {
      console.error('Gagal memuat order antar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAntar();
    const interval = setInterval(fetchAntar, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSudahAntar = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'MENUNGGU_PEMBAYARAN',
          changedById: user?.id,
        }),
      });
      if (res.ok) {
        fetchAntar();
      } else {
        alert('Gagal mengupdate status pesanan');
      }
    } catch {
      alert('Gagal menghubungi server');
    }
  };

  const handleBukaMaps = (address: string) => {
    if (!address) {
      alert('Alamat pengantaran belum diisi');
      return;
    }
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  const handleOpenModal = (order: any) => {
    const rawNum = Number(order.totalAmount ?? 0);
    setCodCashReceived(rawNum > 0 ? (rawNum <= 50000 ? 50000 : rawNum) : 50000);
    setModalState({
      isOpen: true,
      orderId: order.id,
      orderCode: order.orderCode,
      amountNum: rawNum,
      isPaid: order.paymentStatus === 'PAID',
    });
  };

  const handleConfirmModal = async () => {
    if (!modalState.orderId) return;

    if (!modalState.isPaid && codCashReceived < modalState.amountNum) {
      alert('Nominal uang tunai COD yang diterima kurang dari total tagihan!');
      return;
    }

    await handleSudahAntar(modalState.orderId);
    setModalState({ isOpen: false, orderId: '', orderCode: '', amountNum: 0, isPaid: false });
    alert(`Pesanan ${modalState.orderCode} berhasil diserahterimakan!`);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const getServiceLabel = (serviceType: string, speed: string) => {
    const typeLabel = serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
    return `${speed} • ${typeLabel}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans antialiased selection:bg-[#1677FF]/20 selection:text-[#1677FF]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/kurir" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#22C7D9] flex items-center justify-center text-white shadow-md shadow-[#1677FF]/20 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-[#172B4D] tracking-tight leading-tight">
                  Laundry<span className="text-[#1677FF]">Ku</span>
                </span>
                <span className="text-[11px] text-[#6B7280] font-medium leading-none">Pengantaran Lapangan</span>
              </div>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live GPS Sync
            </div>
          </div>

          {/* Kurir Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            <Link
              href="/kurir"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#172B4D] transition-colors"
            >
              Penjemputan
            </Link>
            <Link
              href="/kurir/antar"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#1677FF] to-[#22C7D9] shadow-sm"
            >
              Pengantaran
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1677FF]/15 to-[#22C7D9]/25 text-[#1677FF] flex items-center justify-center font-bold text-xs border border-[#1677FF]/20">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'KR'}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#172B4D]">
                {user?.name ?? 'Kurir'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#EA4335] hover:bg-red-50 transition-colors"
              title="Keluar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Banner Section */}
        <div className="mb-6 bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#34A853]">
                Mode Pengantaran Bersih
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C7D9]"></span>
              <span className="text-xs text-[#6B7280]">Outlet Utama</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              Tugas Antar Cucian
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Antarkan pakaian bersih ke pelanggan dan tagih pembayaran tunai atau verifikasi QRIS.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
              <div className="w-3.5 h-3.5 rounded-full bg-[#34A853] ring-4 ring-[#34A853]/20"></div>
              <div>
                <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">Siap Diantar</span>
                <span className="text-xl font-black text-[#172B4D]">{ordersAntar.length} <span className="text-xs font-medium text-[#6B7280]">Paket</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Jemput | Antar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1.5 bg-[#F1F5F9] rounded-2xl gap-1 border border-[#E5E7EB]/80 w-full sm:w-auto">
            {/* Link to Jemput */}
            <Link
              href="/kurir"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 text-[#6B7280] hover:text-[#172B4D] cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Jemput</span>
            </Link>

            {/* Active Antar Tab */}
            <div
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white shadow-md shadow-[#1677FF]/20 flex items-center justify-center gap-2 scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>Antar</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-white/25 text-white">
                {ordersAntar.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280] justify-end">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-ping"></span>
            <span>Update otomatis setiap 30 detik</span>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-80 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="w-24 h-5 bg-[#E2E8F0] rounded-md"></div>
                  <div className="w-20 h-5 bg-[#E2E8F0] rounded-full"></div>
                </div>
                <div className="space-y-2.5 my-4">
                  <div className="w-40 h-6 bg-[#E2E8F0] rounded-md"></div>
                  <div className="w-full h-4 bg-[#E2E8F0] rounded-md"></div>
                  <div className="w-3/4 h-4 bg-[#E2E8F0] rounded-md"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="w-full h-10 bg-[#E2E8F0] rounded-xl"></div>
                  <div className="w-full h-11 bg-[#E2E8F0] rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State with Inline SVG Delivered Package */}
        {!loading && ordersAntar.length === 0 && (
          <div className="bg-white rounded-2xl p-10 sm:p-14 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center my-4">
            <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#34A853]/10 to-[#22C7D9]/15 rounded-full blur-xl"></div>
              <svg className="w-28 h-28 relative" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Clean Base Circle */}
                <circle cx="60" cy="60" r="50" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                {/* Laundry Delivery Box */}
                <path d="M35 50L60 38L85 50V80L60 92L35 80V50Z" fill="#FFFFFF" stroke="#172B4D" strokeWidth="3" />
                <path d="M60 38V92" stroke="#172B4D" strokeWidth="3" />
                <path d="M35 50L60 62L85 50" stroke="#172B4D" strokeWidth="3" />
                {/* Brand Ribbon / Tape */}
                <path d="M50 43L70 53" stroke="#1677FF" strokeWidth="4" strokeLinecap="round" />
                {/* Sparkles / Clean star */}
                <circle cx="85" cy="35" r="4" fill="#22C7D9" />
                <path d="M92 42L95 48L101 49L96 54L98 60L92 56L87 60L89 54L84 49L90 48L92 42Z" fill="#FBBC04" />
                {/* Success Check Badge */}
                <circle cx="60" cy="74" r="12" fill="#34A853" />
                <path d="M55 74L59 78L66 71" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#172B4D]">
              Tidak ada order untuk diantar saat ini
            </h3>
            <p className="text-sm text-[#6B7280] max-w-md mt-1 mb-5">
              Semua pakaian bersih yang telah selesai dipacking telah berhasil diantar ke pelanggan.
            </p>
            <button
              onClick={fetchAntar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F1F5F9] text-[#172B4D] hover:bg-[#E2E8F0] font-bold text-xs transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Segarkan Antrean
            </button>
          </div>
        )}

        {/* Delivery Cards Grid */}
        {!loading && ordersAntar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ordersAntar.map((order) => {
              const isPaid = order.paymentStatus === 'PAID';
              const totalFormatted = `Rp ${Number(order.totalAmount ?? 0).toLocaleString('id-ID')}`;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#1677FF]/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Header: ID + Badges */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                          Kode Order
                        </span>
                        <span className="font-mono font-black text-base text-[#172B4D] tracking-tight">
                          {order.orderCode}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {isPaid ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </div>

                    {/* Customer Detail (Nama 16px, weight 600) */}
                    <div className="pb-1 border-b border-[#F1F5F9]">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-[#172B4D] truncate">
                          {order.customerName}
                        </h2>
                        {order.customerPhone && (
                          <a
                            href={`https://wa.me/62${order.customerPhone.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:text-[#22C7D9] transition-colors shrink-0"
                            title="Chat WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                            </svg>
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-[#6B7280]">
                        <span className="font-medium text-[#172B4D]">
                          {getServiceLabel(order.serviceType, order.serviceSpeed)}
                        </span>
                        {order.weightKg > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-[#172B4D]">{Number(order.weightKg).toFixed(1)} kg</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Alamat Antar (Location icon, maks 2 baris) */}
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-[#EA4335] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6B7280] block mb-0.5">
                          Alamat Antar
                        </span>
                        <p className="text-xs text-[#172B4D] line-clamp-2 leading-relaxed" title={order.deliveryAddress}>
                          {order.deliveryAddress || 'Alamat tidak dicantumkan oleh pelanggan'}
                        </p>
                      </div>
                    </div>

                    {/* Total Tagihan (font besar, navy, weight 700) & Metode Bayar */}
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                          Total Tagihan
                        </span>
                        <span className="text-xl font-black text-[#172B4D]">
                          {totalFormatted}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                          Metode
                        </span>
                        <span className="text-xs font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {order.paymentMethod ?? 'Tunai / QRIS'}
                        </span>
                      </div>
                    </div>

                    {/* Note if available */}
                    {order.notes && (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900 flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="italic leading-snug line-clamp-2">{order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* 2 Full-Width Action Buttons */}
                  <div className="pt-4 flex flex-col gap-2">
                    {/* 1. Buka Maps (Outline) */}
                    <button
                      onClick={() => handleBukaMaps(order.deliveryAddress)}
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#172B4D] hover:bg-[#F8FAFC] hover:border-[#1677FF]/40 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <svg className="w-4 h-4 text-[#1677FF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>Buka Google Maps</span>
                    </button>

                    {/* 2. Sudah Diantar (Brand Gradient) */}
                    <button
                      onClick={() => handleOpenModal(order)}
                      type="button"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isPaid ? 'Sudah Diantar' : 'Terima Bayar & Sudah Diantar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation & COD Cash Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="text-center flex flex-col gap-1">
              <h3 className="text-lg font-extrabold text-[#172B4D]">
                {modalState.isPaid ? 'Konfirmasi Serah Terima' : 'Konfirmasi Pembayaran COD'}
              </h3>
              <p className="text-xs text-[#6B7280]">
                {modalState.isPaid ? (
                  `Pesanan ${modalState.orderCode} sudah lunas. Serahkan cucian kepada pelanggan.`
                ) : (
                  <>
                    Wajib tagih uang tunai senilai{' '}
                    <strong className="text-[#172B4D] font-black">
                      Rp {modalState.amountNum.toLocaleString('id-ID')}
                    </strong>{' '}
                    untuk pesanan <span className="font-mono text-[#1677FF] font-bold">{modalState.orderCode}</span>.
                  </>
                )}
              </p>
            </div>

            {/* COD Cash Input & Change Calculation */}
            {!modalState.isPaid && (
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col gap-2.5 text-left">
                <label className="text-xs font-bold text-[#172B4D]">
                  Uang Tunai Diterima Kurir (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B7280]">Rp</span>
                  <input
                    type="number"
                    value={codCashReceived}
                    onChange={(e) => setCodCashReceived(Number(e.target.value) || 0)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-sm font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    placeholder="50000"
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-medium text-[#6B7280]">Kembalian:</span>
                  <span
                    className={`font-black ${
                      codCashReceived < modalState.amountNum ? 'text-[#EA4335]' : 'text-[#34A853]'
                    }`}
                  >
                    {codCashReceived < modalState.amountNum
                      ? `Kurang Rp ${(modalState.amountNum - codCashReceived).toLocaleString('id-ID')}`
                      : `Rp ${(codCashReceived - modalState.amountNum).toLocaleString('id-ID')}`}
                  </span>
                </div>
                {codCashReceived < modalState.amountNum && (
                  <span className="text-[11px] text-[#EA4335] font-semibold">
                    ⚠️ Uang tunai kurang dari nominal tagihan!
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <button
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmModal}
                disabled={!modalState.isPaid && codCashReceived < modalState.amountNum}
                type="button"
              >
                {!modalState.isPaid ? 'Konfirmasi Sudah Diantar' : 'Selesai & Konfirmasi'}
              </button>
              <button
                className="w-full py-2.5 rounded-xl bg-[#F1F5F9] text-[#172B4D] hover:bg-[#E2E8F0] font-bold text-xs flex items-center justify-center cursor-pointer"
                onClick={() => setModalState({ isOpen: false, orderId: '', orderCode: '', amountNum: 0, isPaid: false })}
                type="button"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="w-full bg-white border-t border-[#E5E7EB] py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
          <span>© 2026 LaundryKu Operational Logistics.</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>GPS Aktif
            </span>
            <span>v2.0 • PRD Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
