'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function CourierPortalPage() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>('pickup');
  const [ordersJemput, setOrdersJemput] = useState<any[]>([]);
  const [ordersAntar, setOrdersAntar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const [resJemput, resAntar] = await Promise.all([
        fetch('/api/orders?status=MENUNGGU_PENJEMPUTAN'),
        fetch('/api/orders?status=SIAP_DIANTAR'),
      ]);
      const dataJemput = await resJemput.json();
      const dataAntar = await resAntar.json();
      setOrdersJemput(Array.isArray(dataJemput) ? dataJemput : []);
      setOrdersAntar(Array.isArray(dataAntar) ? dataAntar : []);
    } catch {
      console.error('Gagal memuat tugas kurir');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSudahJemput = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SUDAH_DIJEMPUT',
          changedById: user?.id,
        }),
      });
      if (res.ok) {
        setToastMessage('Order berhasil dikonfirmasi sudah dijemput!');
        setTimeout(() => setToastMessage(null), 3000);
        fetchTasks();
      } else {
        alert('Gagal memperbarui status order');
      }
    } catch {
      alert('Gagal menghubungi server');
    }
  };

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
        setToastMessage('Order berhasil dikonfirmasi sudah diantar!');
        setTimeout(() => setToastMessage(null), 3000);
        fetchTasks();
      } else {
        alert('Gagal memperbarui status order');
      }
    } catch {
      alert('Gagal menghubungi server');
    }
  };

  const handleBukaMaps = (address: string) => {
    if (!address) {
      alert('Alamat tidak tersedia');
      return;
    }
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const currentList = activeTab === 'pickup' ? ordersJemput : ordersAntar;
  const pickupCount = ordersJemput.length;
  const deliveryCount = ordersAntar.length;

  const getServiceLabel = (serviceType: string, speed: string) => {
    const typeLabel = serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
    return `${speed} • ${typeLabel}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans antialiased selection:bg-[#1677FF]/20 selection:text-[#1677FF]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Tag */}
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
                <span className="text-[11px] text-[#6B7280] font-medium leading-none">Portal Kurir Logistik</span>
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
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#1677FF] to-[#22C7D9] shadow-sm"
            >
              Penjemputan
            </Link>
            <Link
              href="/kurir/antar"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#172B4D] transition-colors"
            >
              Pengantaran
            </Link>
          </nav>

          {/* User Profile & Logout */}
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

      {/* Main Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Banner Section */}
        <div className="mb-6 bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#1677FF]">
                Logistik & Penjemputan
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C7D9]"></span>
              <span className="text-xs text-[#6B7280]">Outlet Utama</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              Tugas Jemput & Antar
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Pastikan konfirmasi status setiap menyelesaikan penjemputan atau pengantaran cucian.
            </p>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-3">
            <div className="flex-1 sm:flex-initial flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
              <div className="w-3 h-3 rounded-full bg-[#FBBC04] ring-4 ring-[#FBBC04]/20"></div>
              <div>
                <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">Jemput</span>
                <span className="text-lg font-black text-[#172B4D]">{pickupCount} <span className="text-xs font-medium text-[#6B7280]">Order</span></span>
              </div>
            </div>
            <div className="flex-1 sm:flex-initial flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
              <div className="w-3 h-3 rounded-full bg-[#34A853] ring-4 ring-[#34A853]/20"></div>
              <div>
                <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">Antar</span>
                <span className="text-lg font-black text-[#172B4D]">{deliveryCount} <span className="text-xs font-medium text-[#6B7280]">Order</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls: Jemput / Antar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1.5 bg-[#F1F5F9] rounded-2xl gap-1 border border-[#E5E7EB]/80 w-full sm:w-auto">
            {/* Tab Jemput */}
            <button
              onClick={() => setActiveTab('pickup')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'pickup'
                  ? 'bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white shadow-md shadow-[#1677FF]/20 scale-[1.02]'
                  : 'text-[#6B7280] hover:text-[#172B4D]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Jemput</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === 'pickup'
                    ? 'bg-white/25 text-white'
                    : 'bg-[#E2E8F0] text-[#475569]'
                }`}
              >
                {pickupCount}
              </span>
            </button>

            {/* Tab Antar */}
            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'delivery'
                  ? 'bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white shadow-md shadow-[#1677FF]/20 scale-[1.02]'
                  : 'text-[#6B7280] hover:text-[#172B4D]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>Antar</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === 'delivery'
                    ? 'bg-white/25 text-white'
                    : 'bg-[#E2E8F0] text-[#475569]'
                }`}
              >
                {deliveryCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280] justify-end">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-ping"></span>
            <span>Update otomatis setiap 30 detik</span>
          </div>
        </div>

        {/* Loading State: Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-72 animate-pulse"
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

        {/* Empty State */}
        {!loading && currentList.length === 0 && (
          <div className="bg-white rounded-2xl p-10 sm:p-14 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center my-4">
            {/* Inline SVG Courier Motor Illustration */}
            <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1677FF]/10 to-[#22C7D9]/15 rounded-full blur-xl"></div>
              <svg className="w-28 h-28 relative" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Road Line */}
                <path d="M10 100H110" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" />
                {/* Motor Wheels */}
                <circle cx="36" cy="88" r="14" fill="#172B4D" />
                <circle cx="36" cy="88" r="7" fill="#F8FAFC" stroke="#6B7280" strokeWidth="3" />
                <circle cx="86" cy="88" r="14" fill="#172B4D" />
                <circle cx="86" cy="88" r="7" fill="#F8FAFC" stroke="#6B7280" strokeWidth="3" />
                {/* Motor Body Chassis */}
                <path d="M36 88L50 72H78L86 88H68L60 78H46L36 88Z" fill="#1677FF" />
                <path d="M52 72L62 50H72L78 72H52Z" fill="#22C7D9" />
                {/* Courier Bag / Box on Back */}
                <rect x="22" y="52" width="22" height="24" rx="4" fill="#FBBC04" stroke="#172B4D" strokeWidth="2" />
                <path d="M22 62H44" stroke="#172B4D" strokeWidth="2" />
                {/* Courier Helmet & Body */}
                <circle cx="68" cy="38" r="10" fill="#1677FF" />
                <path d="M68 35H76V42H68V35Z" fill="#172B4D" />
                <path d="M60 48C60 48 64 56 68 56C72 56 78 48 78 48L74 62H62L60 48Z" fill="#172B4D" />
                {/* Handlebar */}
                <path d="M72 50L78 45H84" stroke="#172B4D" strokeWidth="3" strokeLinecap="round" />
                {/* Wind movement sparkles */}
                <path d="M12 55H18" stroke="#22C7D9" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 63H16" stroke="#22C7D9" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#172B4D]">
              {activeTab === 'pickup'
                ? 'Tidak ada order untuk dijemput saat ini'
                : 'Tidak ada order untuk diantar saat ini'}
            </h3>
            <p className="text-sm text-[#6B7280] max-w-md mt-1 mb-5">
              {activeTab === 'pickup'
                ? 'Semua permintaan penjemputan cucian dari pelanggan sudah terselesaikan atau belum ada pesanan baru.'
                : 'Belum ada cucian bersih yang siap diantar oleh tim workshop ke pelanggan.'}
            </p>
            <button
              onClick={fetchTasks}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F1F5F9] text-[#172B4D] hover:bg-[#E2E8F0] font-bold text-xs transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Perbarui Data
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && currentList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentList.map((task) => {
              const isPickup = activeTab === 'pickup';
              const address = isPickup ? task.pickupAddress : task.deliveryAddress;
              const isPaid = task.paymentStatus === 'PAID';

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#1677FF]/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Top Header: Order Code & Status Badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                          Kode Order
                        </span>
                        <span className="font-mono font-black text-base text-[#172B4D] tracking-tight">
                          {task.orderCode}
                        </span>
                      </div>

                      {isPickup ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FBBC04]/15 text-[#B45309] border border-[#FBBC04]/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] animate-pulse"></span>
                          Perlu Dijemput
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#34A853]/15 text-[#166534] border border-[#34A853]/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></span>
                          Siap Diantar
                        </span>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="pb-1 border-b border-[#F1F5F9]">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-[#172B4D] truncate">
                          {task.customerName}
                        </h2>
                        {task.customerPhone && (
                          <a
                            href={`https://wa.me/62${task.customerPhone.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
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
                          {getServiceLabel(task.serviceType, task.serviceSpeed)}
                        </span>
                        {task.weightKg > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-[#172B4D]">{Number(task.weightKg).toFixed(1)} kg</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Schedule info */}
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <svg className="w-4 h-4 text-[#6B7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">
                        Jadwal: {new Date(task.scheduledPickupAt || task.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })} • {new Date(task.scheduledPickupAt || task.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </span>
                    </div>

                    {/* Address Box with Location Pin Icon (clamp 2 lines) */}
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-[#EA4335] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6B7280] block mb-0.5">
                          {isPickup ? 'Alamat Jemput' : 'Alamat Antar'}
                        </span>
                        <p className="text-xs text-[#172B4D] line-clamp-2 leading-relaxed" title={address}>
                          {address || 'Alamat tidak dicantumkan oleh pelanggan'}
                        </p>
                      </div>
                    </div>

                    {/* Note if available */}
                    {task.notes && (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900 flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="italic leading-snug line-clamp-2">{task.notes}</span>
                      </div>
                    )}

                    {/* Delivery-Only: Tagihan & Payment Status */}
                    {!isPickup && (
                      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                            Total Tagihan
                          </span>
                          <span className="text-lg font-black text-[#172B4D]">
                            Rp {Number(task.totalAmount ?? 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPaid ? 'Lunas' : `Tagih ${task.paymentMethod ?? 'Tunai'}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2 Full-Width Action Buttons */}
                  <div className="pt-4 flex flex-col gap-2">
                    {/* 1. Buka Maps (Outline) */}
                    <button
                      onClick={() => handleBukaMaps(address)}
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#172B4D] hover:bg-[#F8FAFC] hover:border-[#1677FF]/40 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <svg className="w-4 h-4 text-[#1677FF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>Buka Google Maps</span>
                    </button>

                    {/* 2. Sudah Dijemput / Sudah Diantar (Brand Gradient) */}
                    <button
                      onClick={() => (isPickup ? handleSudahJemput(task.id) : handleSudahAntar(task.id))}
                      type="button"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isPickup ? 'Sudah Dijemput' : 'Sudah Diantar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-[#172B4D] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 ${
          toastMessage ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 pointer-events-none scale-95'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm font-semibold">{toastMessage}</span>
      </div>

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
