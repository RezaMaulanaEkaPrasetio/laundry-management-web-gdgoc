'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import KasirNav from './_components/KasirNav';

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  MENUNGGU_PENJEMPUTAN: { bg: '#EFF6FF', text: '#1677FF', label: 'Menunggu Penjemputan' },
  SUDAH_DIJEMPUT:       { bg: '#FFF7ED', text: '#EA580C', label: 'Sudah Dijemput' },
  SEDANG_DICUCI:        { bg: '#FFFBEB', text: '#D97706', label: 'Sedang Dicuci' },
  SELESAI_DICUCI:       { bg: '#F0FDF4', text: '#16A34A', label: 'Selesai Dicuci' },
  SIAP_DIANTAR:         { bg: '#EFF6FF', text: '#1677FF', label: 'Siap Diantar' },
  MENUNGGU_PEMBAYARAN:  { bg: '#FFF1F2', text: '#E11D48', label: 'Menunggu Pembayaran' },
  SELESAI:              { bg: '#F0FDF4', text: '#15803D', label: 'Selesai' },
  DIBATALKAN:           { bg: '#FEF2F2', text: '#DC2626', label: 'Dibatalkan' },
};

export default function DashboardKasirPage() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'aktif' | 'semua'>('aktif');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Gagal memuat data order');
      const data = await res.json();

      const mapped = (Array.isArray(data) ? data : []).map((o: any) => ({
        id: o.orderCode,
        _id: o.id,
        customer: o.customerName,
        phone: o.customerPhone,
        service: `${o.serviceType === 'CKL' ? 'Cuci Kering Lipat' : 'Cuci Kering Setrika'} (${o.serviceSpeed})`,
        status: o.status,
        weight: Number(o.weightKg ?? 0),
        totalAmount: Number(o.totalAmount ?? 0),
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt,
      }));

      setOrders(mapped);
    } catch (err) {
      console.error('Fetch orders failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Order Aktif = belum SELESAI dan belum DIBATALKAN
  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== 'SELESAI' && o.status !== 'DIBATALKAN').length;
  }, [orders]);

  const displayedOrders = useMemo(() => {
    return orders.filter((o) => {
      // Filter tab
      if (activeTab === 'aktif' && (o.status === 'SELESAI' || o.status === 'DIBATALKAN')) {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.phone?.includes(q)
      );
    });
  }, [orders, activeTab, searchQuery]);

  const getInitials = (name: string) => {
    if (!name) return 'L';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans antialiased text-[#172B4D] flex flex-col justify-between">
      {/* ─── Navbar Kasir Terpadu ─── */}
      <KasirNav />

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* ═══ Hero Section ═══ */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-semibold text-[#172B4D]">
              Halo, {currentUser?.name ?? 'Kasir'}! 👋
            </h1>
            <p className="text-[14px] text-[#6B7280]">
              <span className="font-semibold text-[#172B4D]">{activeOrdersCount}</span> order aktif hari ini
            </p>
          </div>

          {/* Tombol Utama Hero: 1 icon add + teks bersih */}
          <Link
            href="/kasir/order/baru"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Buat Order Baru</span>
          </Link>
        </div>

        {/* ═══ Search & Tab Bar ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-[#6B7280]">Order Aktif</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1677FF]">
              {displayedOrders.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Filter */}
            <div className="flex p-0.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setActiveTab('aktif')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'aktif'
                    ? 'bg-white text-[#1677FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#172B4D]'
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('semua')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'semua'
                    ? 'bg-white text-[#1677FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#172B4D]'
                }`}
              >
                Semua
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Cari order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#172B4D] placeholder:text-[#6B7280] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15"
              />
            </div>
          </div>
        </div>

        {/* ═══ List Order Section ═══ */}
        {loading ? (
          /* 3 Skeleton Cards saat loading */
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#F0F0F0] shadow-xs flex items-center justify-between animate-shimmer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-20 h-3 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-6 bg-gray-100 rounded-full" />
                  <div className="w-24 h-8 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedOrders.length === 0 ? (
          /* Empty State dengan SVG keranjang cucian */
          <div className="bg-white rounded-2xl p-10 sm:p-14 border border-[#F0F0F0] text-center flex flex-col items-center justify-center shadow-xs">
            <svg
              className="w-20 h-20 text-[#6B7280]/40 mb-3"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20L18 52C18.5 54.5 20.5 56 23 56H41C43.5 56 45.5 54.5 46 52L52 20C52.5 17.5 50.5 16 48 16H16C13.5 16 11.5 17.5 12 20Z" />
              <path d="M10 16H54" strokeLinecap="round" />
              <path d="M22 26V46" strokeLinecap="round" />
              <path d="M32 26V46" strokeLinecap="round" />
              <path d="M42 26V46" strokeLinecap="round" />
              <path d="M24 16C24 11.6 27.6 8 32 8C36.4 8 40 11.6 40 16" strokeLinecap="round" />
            </svg>
            <h3 className="text-base font-semibold text-[#172B4D] mb-1">
              Belum ada order aktif hari ini.
            </h3>
            <p className="text-sm text-[#6B7280] max-w-sm mb-5">
              Saat ada pesanan masuk, semuanya akan muncul di sini.
            </p>
            <Link
              href="/kasir/order/baru"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-white font-semibold text-sm shadow-sm hover:brightness-105 transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Buat Order Pertama</span>
            </Link>
          </div>
        ) : (
          /* Cards List dengan staggered entrance animation */
          <div className="flex flex-col gap-3">
            {displayedOrders.map((order, index) => {
              const badge = STATUS_BADGES[order.status] ?? {
                bg: '#F3F4F6',
                text: '#4B5563',
                label: order.status,
              };

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1677FF]/40 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                >
                  {/* Left: Avatar + Customer info + Order Code */}
                  <div className="flex items-center gap-3.5">
                    {/* Avatar lingkaran inisial dengan gradient brand */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
                    >
                      {getInitials(order.customer)}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[#172B4D] truncate">
                        {order.customer}
                      </span>
                      <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                        <span className="font-mono text-[#1677FF] font-medium">{order.id}</span>
                        <span>•</span>
                        <span>{order.service}</span>
                        {order.weight > 0 && (
                          <>
                            <span>•</span>
                            <span>{order.weight} kg</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge (pill muted) + Tombol Lihat Detail */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F0F0]">
                    <span
                      className="px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.text }} />
                      <span>{badge.label}</span>
                    </span>

                    <Link
                      href={`/kasir/order/${order._id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#1677FF] hover:bg-[#EFF6FF] text-[#172B4D] hover:text-[#1677FF] text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Footer Minimal ─── */}
      <footer className="w-full border-t border-[#E5E7EB] bg-white py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-2">
          <span>LaundryKu POS • Modul Operasional Kasir</span>
          <span>© 2026 LaundryKu. Hak cipta dilindungi.</span>
        </div>
      </footer>
    </div>
  );
}
