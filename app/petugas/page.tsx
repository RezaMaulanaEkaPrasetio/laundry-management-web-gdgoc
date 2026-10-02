'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function PetugasWorkshopPage() {
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'need-weight' | 'washing' | 'completed'>('need-weight');
  const [openWeightId, setOpenWeightId] = useState<string | null>(null);
  const [beratInput, setBeratInput] = useState<Record<string, string>>({});
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      console.error('Gagal memuat order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);

    // Fetch config prices for dynamic weight price preview
    fetch('/api/config/prices')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPrices(data);
      })
      .catch((err) => console.error('Gagal mengambil harga:', err));

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  // Orders segmentation
  const needWeightOrders = useMemo(() => orders.filter((o) => o.status === 'SUDAH_DIJEMPUT'), [orders]);
  const washingOrders = useMemo(() => orders.filter((o) => o.status === 'SEDANG_DICUCI'), [orders]);
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'SELESAI_DICUCI' || o.status === 'SIAP_DIANTAR' || o.status === 'SELESAI'),
    [orders]
  );

  const needWeightCount = needWeightOrders.length;
  const washingCount = washingOrders.length;
  const completedCount = completedOrders.length;
  const totalWorkshopNeeds = needWeightCount + washingCount;

  const currentList =
    activeTab === 'need-weight'
      ? needWeightOrders
      : activeTab === 'washing'
      ? washingOrders
      : completedOrders;

  // Rate lookup helper
  const getRatePerKg = (serviceType: string, serviceSpeed: string) => {
    const matched = prices.find((p) => p.serviceType === serviceType && p.serviceSpeed === serviceSpeed);
    if (matched) return Number(matched.pricePerKg);
    const base = serviceType === 'CKG' ? 10000 : 7000;
    const mult = serviceSpeed === 'KILAT' ? 2.0 : serviceSpeed === 'EXPRESS' ? 1.5 : 1.0;
    return Math.round(base * mult);
  };

  const handleAdjustWeight = (id: string, delta: number) => {
    setBeratInput((prev) => {
      const targetOrder = orders.find((o) => o.id === id);
      const cur = parseFloat(prev[id] ?? (targetOrder?.weightKg ? String(targetOrder.weightKg) : '3.0')) || 0;
      const nextVal = Math.max(0.1, +(cur + delta).toFixed(2));
      return { ...prev, [id]: String(nextVal) };
    });
  };

  const handleSaveAndStartWash = async (id: string) => {
    const targetOrder = orders.find((o) => o.id === id);
    const rawVal = beratInput[id] ?? (targetOrder?.weightKg ? String(targetOrder.weightKg) : '3.0');
    const berat = parseFloat(rawVal);

    if (!berat || berat < 0.1) {
      alert('Berat minimal 0.1 kg');
      return;
    }

    setSavingOrderId(id);
    try {
      const res = await fetch(`/api/orders/${id}/weight`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightKg: berat,
          petugasId: user?.id,
        }),
      });

      if (res.ok) {
        setOpenWeightId(null);
        await fetchOrders();
        setActiveTab('washing');
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal menyimpan berat timbangan');
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setSavingOrderId(null);
    }
  };

  const handleMarkCompleted = async (id: string) => {
    setSavingOrderId(id);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SELESAI_DICUCI',
          changedById: user?.id,
        }),
      });

      if (res.ok) {
        await fetchOrders();
        setActiveTab('completed');
      } else {
        alert('Gagal memperbarui status order');
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setSavingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans antialiased text-[#172B4D] flex flex-col justify-between">
      {/* ─── Navbar Petugas (Hanya Logo + Nama Petugas + Logout) ─── */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1677FF] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[22px]">dry_cleaning</span>
            </div>
            <span className="text-base font-bold text-[#172B4D] tracking-tight">LaundryKu Workshop</span>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-right">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#1677FF] font-semibold text-xs flex items-center justify-center border border-[#1677FF]/20">
                {user?.name ? user.name[0].toUpperCase() : 'P'}
              </div>
              <span className="text-sm font-semibold text-[#172B4D] hidden sm:inline">
                {user?.name ?? 'Petugas Workshop'}
              </span>
            </div>
            <div className="h-4 w-px bg-[#E5E7EB]" />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#DC2626] transition-colors p-2 rounded-lg hover:bg-[#FEF2F2] cursor-pointer"
              title="Keluar dari sistem"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* ═══ Header: Workshop Hari Ini ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-semibold text-[#172B4D]">
                Workshop Hari Ini
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#1677FF] border border-[#BFDBFE]">
                {totalWorkshopNeeds} Perlu Diproses
              </span>
            </div>
            <p className="text-[14px] text-[#6B7280]">
              Timbang cucian masuk dan tandai proses cuci-setrika yang telah selesai.
            </p>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={fetchOrders}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#EFF6FF] text-[#172B4D] hover:text-[#1677FF] text-xs font-semibold transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Segarkan</span>
          </button>
        </div>

        {/* ═══ Tab Navigation (Touch Target Minimal 44px) ═══ */}
        <div className="grid grid-cols-3 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setActiveTab('need-weight')}
            className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'need-weight'
                ? 'bg-white text-[#1677FF] shadow-xs'
                : 'text-[#6B7280] hover:text-[#172B4D]'
            }`}
          >
            <span>1. Perlu Ditimbang</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'need-weight' ? 'bg-[#EFF6FF] text-[#1677FF]' : 'bg-[#E2E8F0] text-[#6B7280]'
            }`}>
              {needWeightCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('washing')}
            className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'washing'
                ? 'bg-white text-[#D97706] shadow-xs'
                : 'text-[#6B7280] hover:text-[#172B4D]'
            }`}
          >
            <span>2. Sedang Dicuci</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'washing' ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#E2E8F0] text-[#6B7280]'
            }`}>
              {washingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-[#16A34A] shadow-xs'
                : 'text-[#6B7280] hover:text-[#172B4D]'
            }`}
          >
            <span>3. Selesai</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'completed' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#E2E8F0] text-[#6B7280]'
            }`}>
              {completedCount}
            </span>
          </button>
        </div>

        {/* ═══ Order Cards List ═══ */}
        {loading ? (
          /* 3 Skeleton Cards */
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#F0F0F0] shadow-xs flex flex-col gap-4 animate-shimmer"
              >
                <div className="w-48 h-6 bg-gray-200 rounded" />
                <div className="w-32 h-4 bg-gray-100 rounded" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : currentList.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-10 sm:p-14 border border-[#F0F0F0] text-center flex flex-col items-center justify-center shadow-xs">
            <svg
              className="w-20 h-20 text-[#6B7280]/40 mb-3"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="32" cy="32" r="22" strokeLinecap="round" />
              <path d="M22 32C22 26.5 26.5 22 32 22C37.5 22 42 26.5 42 32" strokeLinecap="round" />
              <circle cx="32" cy="32" r="3" fill="currentColor" />
            </svg>
            <h3 className="text-base font-semibold text-[#172B4D] mb-1">
              Tidak ada cucian yang perlu diproses.
            </h3>
            <p className="text-sm text-[#6B7280] max-w-sm">
              {activeTab === 'need-weight'
                ? 'Cucian akan muncul setelah kurir melakukan penjemputan dari pelanggan.'
                : activeTab === 'washing'
                ? 'Belum ada cucian yang sedang berada di mesin cuci.'
                : 'Belum ada cucian yang selesai pada shift ini.'}
            </p>
          </div>
        ) : (
          /* List Card Per Order (Lebih Besar & Ramah Layar Sentuh) */
          <div className="flex flex-col gap-4">
            {currentList.map((order) => {
              const isOpenWeight = openWeightId === order.id;
              const ratePerKg = getRatePerKg(order.serviceType, order.serviceSpeed);
              const currentWeightVal = parseFloat(beratInput[order.id] ?? (order.weightKg ? String(order.weightKg) : '3.0')) || 0;
              const previewTotal = Math.round(currentWeightVal * ratePerKg);
              const isSaving = savingOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col gap-4 hover:border-[#1677FF]/40 transition-all animate-fade-in-up"
                >
                  {/* Card Header: Nama Pelanggan + Order Code */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F0F0]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1677FF] font-bold text-sm flex items-center justify-center shrink-0">
                        {order.customerName ? order.customerName[0].toUpperCase() : 'C'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[18px] font-semibold text-[#172B4D] leading-tight">
                          {order.customerName}
                        </span>
                        <span className="font-mono text-xs text-[#1677FF] font-medium mt-0.5">
                          {order.orderCode}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start sm:self-auto">
                      {order.status === 'SUDAH_DIJEMPUT' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
                          Siap Ditimbang
                        </span>
                      )}
                      {order.status === 'SEDANG_DICUCI' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                          <span>Sedang Dicuci</span>
                        </span>
                      )}
                      {(order.status === 'SELESAI_DICUCI' || order.status === 'SIAP_DIANTAR' || order.status === 'SELESAI') && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                          Selesai Dicuci ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Info & Catatan Khusus */}
                  <div className="flex flex-col gap-2 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5E7EB]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#172B4D] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-[#1677FF]">
                          {order.serviceType === 'CKG' ? 'iron' : 'dry_cleaning'}
                        </span>
                        <span>{order.serviceType === 'CKG' ? 'Cuci Kering Setrika (CKG)' : 'Cuci Kering Lipat (CKL)'} • {order.serviceSpeed}</span>
                      </span>
                      <span className="text-[#6B7280]">
                        Tarif: Rp {ratePerKg.toLocaleString('id-ID')} / kg
                      </span>
                    </div>

                    {order.notes && (
                      <div className="text-xs text-[#172B4D] flex items-start gap-1.5 pt-1.5 border-t border-[#E5E7EB]">
                        <span className="material-symbols-outlined text-[16px] text-[#D97706] shrink-0 mt-0.5">info</span>
                        <span>Catatan: <strong className="text-[#172B4D]">{order.notes}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* ═══ AKSI PER TAB ═══ */}

                  {/* TAB 1: SUDAH_DIJEMPUT -> Tombol Besar Mulai Proses & Input Berat */}
                  {order.status === 'SUDAH_DIJEMPUT' && (
                    <div className="flex flex-col gap-3">
                      {!isOpenWeight ? (
                        <button
                          type="button"
                          onClick={() => setOpenWeightId(order.id)}
                          className="min-h-[50px] w-full rounded-xl text-white font-semibold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                          style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
                        >
                          <span className="material-symbols-outlined text-[22px]">scale</span>
                          <span>Mulai Proses &amp; Input Berat</span>
                        </button>
                      ) : (
                        /* Inline Form Input Berat (Input Angka Besar 32px + Keyboard Numerik) */
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col gap-4 animate-fade-in-up">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF]">
                              Timbangan Riil Cucian
                            </span>
                            <button
                              type="button"
                              onClick={() => setOpenWeightId(null)}
                              className="text-xs text-[#6B7280] hover:text-[#172B4D] font-semibold cursor-pointer"
                            >
                              Tutup Form
                            </button>
                          </div>

                          {/* Large Number Input & Steppers */}
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleAdjustWeight(order.id, -0.5)}
                              className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 active:scale-95 text-[#172B4D] font-bold text-xl flex items-center justify-center shadow-xs cursor-pointer"
                            >
                              -
                            </button>

                            <div className="flex items-baseline justify-center gap-2 bg-white px-6 py-2 rounded-xl border border-[#1677FF] shadow-xs">
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={beratInput[order.id] ?? (order.weightKg ? String(order.weightKg) : '3.0')}
                                onChange={(e) => setBeratInput({ ...beratInput, [order.id]: e.target.value })}
                                className="w-28 text-center text-[32px] font-extrabold text-[#172B4D] focus:outline-none"
                              />
                              <span className="text-base font-bold text-[#6B7280]">kg</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAdjustWeight(order.id, 0.5)}
                              className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 active:scale-95 text-[#172B4D] font-bold text-xl flex items-center justify-center shadow-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Live Dynamic Preview Total */}
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/70 border border-[#BFDBFE]">
                            <span className="text-xs font-medium text-[#172B4D]">Estimasi Tagihan:</span>
                            <span className="text-sm font-bold text-[#1677FF]">
                              Total: Rp {previewTotal.toLocaleString('id-ID')}
                            </span>
                          </div>

                          {/* Tombol Simpan & Mulai Cuci */}
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSaveAndStartWash(order.id)}
                            className="min-h-[48px] w-full rounded-xl text-white font-semibold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
                          >
                            {isSaving ? (
                              <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                <span>Menyimpan...</span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
                                <span>Simpan &amp; Mulai Cuci</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: SEDANG_DICUCI -> Tombol Tandai Selesai (Outline Green) */}
                  {order.status === 'SEDANG_DICUCI' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-[#6B7280]">
                        Berat tercatat: <strong className="text-[#172B4D]">{order.weightKg ?? '-'} kg</strong> • Total: <strong className="text-[#1677FF]">Rp {Number(order.totalAmount ?? 0).toLocaleString('id-ID')}</strong>
                      </div>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleMarkCompleted(order.id)}
                        className="min-h-[44px] w-full sm:w-auto px-6 rounded-xl border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] active:scale-[0.98] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            <span>Tandai Selesai</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* TAB 3: SELESAI_DICUCI -> Selesai */}
                  {(order.status === 'SELESAI_DICUCI' || order.status === 'SIAP_DIANTAR' || order.status === 'SELESAI') && (
                    <div className="flex items-center justify-between pt-2 text-xs text-[#6B7280]">
                      <span>Berat: <strong className="text-[#172B4D]">{order.weightKg} kg</strong></span>
                      <span className="font-semibold text-[#16A34A] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">task_alt</span>
                        Siap Diantar / Diambil
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Footer Minimal ─── */}
      <footer className="w-full border-t border-[#E5E7EB] bg-white py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-2">
          <span>LaundryKu Workshop • Terminal Petugas Cuci</span>
          <span>© 2026 LaundryKu. Hak cipta dilindungi.</span>
        </div>
      </footer>
    </div>
  );
}
