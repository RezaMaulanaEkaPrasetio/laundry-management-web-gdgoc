'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from './_components/AdminNav';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Stats {
  totalHariIni: number;
  pendapatanHariIni: number;
  orderPerluPerhatian: number;
  orderSelesai: number;
  totalKg: number;
}

export default function AdminDashboardPage() {
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<Stats>({
    totalHariIni: 0,
    pendapatanHariIni: 0,
    orderPerluPerhatian: 0,
    orderSelesai: 0,
    totalKg: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showExportToast, setShowExportToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/orders');
      const semua = await res.json();
      if (!Array.isArray(semua)) return;

      const today = new Date().toISOString().slice(0, 10);
      const hariIni = semua.filter(
        (o: any) => new Date(o.createdAt).toISOString().slice(0, 10) === today
      );

      const targetOrders = hariIni.length > 0 ? hariIni : semua;

      // Orders needing attention: e.g. MENUNGGU_PEMBAYARAN or MENUNGGU_PENJEMPUTAN or unpaid
      const perluPerhatianCount = semua.filter(
        (o: any) => o.status === 'MENUNGGU_PEMBAYARAN' || (o.paymentStatus !== 'PAID' && o.status === 'SELESAI')
      ).length;

      setStats({
        totalHariIni: hariIni.length,
        pendapatanHariIni: hariIni
          .filter((o: any) => o.paymentStatus === 'PAID')
          .reduce((sum: number, o: any) => sum + Number(o.totalAmount ?? 0), 0),
        orderPerluPerhatian: perluPerhatianCount,
        orderSelesai: hariIni.filter((o: any) => o.status === 'SELESAI').length,
        totalKg: targetOrders.reduce((sum: number, o: any) => sum + Number(o.weightKg ?? 0), 0),
      });

      setAllOrders(semua);
      setOrders(semua);
    } catch (err) {
      console.error('Gagal mengambil data orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
    // Trigger print or csv download
    window.print();
  };

  // Stage breakdown counts
  const countByStatus = (st: string) => allOrders.filter((o) => o.status === st).length;
  const countJemput = countByStatus('MENUNGGU_PENJEMPUTAN');
  const countDijemput = countByStatus('SUDAH_DIJEMPUT');
  const countCuci = countByStatus('SEDANG_DICUCI');
  const countSelesaiCuci = countByStatus('SELESAI_DICUCI');
  const countAntar = countByStatus('SIAP_DIANTAR');
  const countBayar = countByStatus('MENUNGGU_PEMBAYARAN');

  const getServiceLabel = (serviceType: string, speed: string) => {
    const typeLabel = serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
    return `${speed} • ${typeLabel}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MENUNGGU_PENJEMPUTAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Menunggu Jemput
          </span>
        );
      case 'SUDAH_DIJEMPUT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Sudah Dijemput
          </span>
        );
      case 'SEDANG_DICUCI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse"></span>
            Sedang Dicuci
          </span>
        );
      case 'SELESAI_DICUCI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-[#0E7490] border border-cyan-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C7D9]"></span>
            Selesai Dicuci
          </span>
        );
      case 'SIAP_DIANTAR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Siap Diantar
          </span>
        );
      case 'MENUNGGU_PEMBAYARAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-[#EA4335] border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] animate-ping"></span>
            Menunggu Bayar
          </span>
        );
      case 'SELESAI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#34A853] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></span>
            Selesai ✓
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status?.replace(/_/g, ' ') || '-'}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'Semua Status' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans antialiased selection:bg-[#1677FF]/20 selection:text-[#1677FF]">
      {/* Top Fixed Header with AdminNav */}
      <header className="sticky top-0 z-40">
        <AdminNav />
      </header>

      {/* Main Admin Dashboard */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Toast Notification */}
        {showExportToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#172B4D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Mempersiapkan dokumen cetak/ekspor laporan...</span>
          </div>
        )}

        {/* Top Context & Actions Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Live Data Synchronized
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              Dashboard Operasional & Omset
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Pantau arus kas harian, produktivitas pencucian, dan status pesanan LaundryKu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#172B4D] hover:bg-[#F8FAFC] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 text-[#1677FF] ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white hover:opacity-95 text-xs font-bold shadow-md shadow-[#1677FF]/20 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Ekspor Laporan</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Cards Wajib (Subtle Gradients) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Total Order Hari Ini (Subtle Blue Gradient) */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 rounded-2xl p-5 border border-blue-100 shadow-[0_2px_12px_rgba(22,119,255,0.04)] relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#1677FF]">
                Total Order Hari Ini
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="my-3">
              <span className="text-3xl sm:text-4xl font-black text-[#172B4D] tracking-tight">
                {stats.totalHariIni}
              </span>
              <span className="text-sm font-semibold text-[#6B7280] ml-2">Pesanan</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <span className="font-bold text-[#172B4D]">{stats.totalKg.toFixed(1)} kg</span>
              <span>total cucian ditimbang</span>
            </div>
          </div>

          {/* Card 2: Pendapatan Hari Ini (Subtle Green Gradient) */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 rounded-2xl p-5 border border-emerald-100 shadow-[0_2px_12px_rgba(52,168,83,0.04)] relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700">
                Pendapatan Hari Ini
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black text-[#172B4D] tracking-tight">
                Rp {stats.pendapatanHariIni.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Arus kas masuk lunas tervalidasi</span>
            </div>
          </div>

          {/* Card 3: Order Perlu Perhatian (Subtle Amber Gradient) */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 rounded-2xl p-5 border border-amber-100 shadow-[0_2px_12px_rgba(251,188,4,0.04)] relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#B45309]">
                Perlu Perhatian
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#B45309] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <div className="my-3">
              <span className="text-3xl sm:text-4xl font-black text-[#172B4D] tracking-tight">
                {stats.orderPerluPerhatian}
              </span>
              <span className="text-sm font-semibold text-[#6B7280] ml-2">Order</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#B45309]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] animate-pulse"></span>
              <span>Menunggu pembayaran / butuh konfirmasi</span>
            </div>
          </div>
        </div>

        {/* Beban Alur Kerja Pesanan Cards */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-wider font-extrabold text-[#6B7280]">
              Penyebaran Alur Pengerjaan Cucian
            </h2>
            <span className="text-xs font-semibold text-[#1677FF]">
              {allOrders.length} Total Semua Pesanan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col">
              <span className="text-[11px] font-semibold text-[#6B7280]">1. Menjemput</span>
              <span className="text-xl font-black text-[#172B4D] mt-1">{countJemput}</span>
              <span className="text-[10px] text-[#6B7280]">Kurir pickup</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col">
              <span className="text-[11px] font-semibold text-[#6B7280]">2. Dijemput</span>
              <span className="text-xl font-black text-[#172B4D] mt-1">{countDijemput}</span>
              <span className="text-[10px] text-[#6B7280]">Menuju outlet</span>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl flex flex-col">
              <span className="text-[11px] font-bold text-[#1677FF]">3. Sedang Cuci</span>
              <span className="text-xl font-black text-[#1677FF] mt-1">{countCuci}</span>
              <span className="text-[10px] text-blue-700 font-semibold">Workshop aktif</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col">
              <span className="text-[11px] font-semibold text-[#6B7280]">4. Selesai Cuci</span>
              <span className="text-xl font-black text-[#172B4D] mt-1">{countSelesaiCuci}</span>
              <span className="text-[10px] text-[#6B7280]">Setrika & pack</span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl flex flex-col">
              <span className="text-[11px] font-bold text-[#34A853]">5. Siap Antar</span>
              <span className="text-xl font-black text-[#34A853] mt-1">{countAntar}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Kurir delivery</span>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-200/60 rounded-xl flex flex-col">
              <span className="text-[11px] font-bold text-[#EA4335]">6. Tunggu Bayar</span>
              <span className="text-xl font-black text-[#EA4335] mt-1">{countBayar}</span>
              <span className="text-[10px] text-rose-700 font-semibold">Tagihan kasir</span>
            </div>
          </div>
        </div>

        {/* Tabel Order Terkini */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Table Controls / Filters Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div>
              <h2 className="text-base font-extrabold text-[#172B4D]">
                Daftar Pesanan Terkini
              </h2>
              <p className="text-xs text-[#6B7280]">
                Menampilkan data pesanan masuk, status pengerjaan, dan catatan pembayaran.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kode / pelanggan..."
                  className="w-48 sm:w-56 pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                />
                <svg className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF] cursor-pointer"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="MENUNGGU_PENJEMPUTAN">Menunggu Penjemputan</option>
                <option value="SUDAH_DIJEMPUT">Sudah Dijemput</option>
                <option value="SEDANG_DICUCI">Sedang Dicuci</option>
                <option value="SELESAI_DICUCI">Selesai Dicuci</option>
                <option value="SIAP_DIANTAR">Siap Diantar</option>
                <option value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              {/* Sticky Header */}
              <thead className="bg-[#F8FAFC] sticky top-0 z-10 text-[#6B7280] uppercase tracking-wider font-extrabold border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3.5 px-4">Kode Order</th>
                  <th className="py-3.5 px-4">Pelanggan</th>
                  <th className="py-3.5 px-4">Layanan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total Biaya</th>
                  <th className="py-3.5 px-4">Bayar</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>

              {/* Table Body with row hover #F8FAFC */}
              <tbody className="divide-y divide-[#E5E7EB] text-[#172B4D]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-6 h-6 animate-spin text-[#1677FF]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memuat data pesanan...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-10 h-10 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-bold text-sm text-[#172B4D]">Belum ada data pesanan</span>
                        <span className="text-xs text-[#94A3B8]">Pesanan yang dibuat oleh kasir akan otomatis tampil di sini.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F8FAFC] transition-colors duration-150 group"
                    >
                      {/* Kode */}
                      <td className="py-3 px-4 font-mono font-bold text-[#1677FF]">
                        {order.orderCode}
                      </td>

                      {/* Pelanggan */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#172B4D]">{order.customerName}</span>
                          <span className="text-[11px] text-[#6B7280]">{order.customerPhone || '-'}</span>
                        </div>
                      </td>

                      {/* Layanan */}
                      <td className="py-3 px-4">
                        <span className="text-[#172B4D] font-medium">
                          {getServiceLabel(order.serviceType, order.serviceSpeed)}
                        </span>
                        {order.weightKg > 0 && (
                          <span className="text-[11px] text-[#6B7280] block">
                            {Number(order.weightKg).toFixed(1)} kg
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Total Biaya */}
                      <td className="py-3 px-4 font-extrabold text-[#172B4D]">
                        Rp {Number(order.totalAmount ?? 0).toLocaleString('id-ID')}
                      </td>

                      {/* Bayar */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#172B4D] font-bold text-xs transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detail Pesanan */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-[#1677FF]">
                    {selectedOrder.orderCode}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-[#6B7280] hover:text-[#172B4D] hover:bg-[#F1F5F9] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#6B7280]">Pelanggan</span>
                  <span className="font-bold text-[#172B4D]">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#6B7280]">No. Telepon / WA</span>
                  <span className="font-semibold text-[#1677FF]">{selectedOrder.customerPhone || '-'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#6B7280]">Layanan</span>
                  <span className="font-semibold text-[#172B4D]">
                    {getServiceLabel(selectedOrder.serviceType, selectedOrder.serviceSpeed)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#6B7280]">Berat Timbangan</span>
                  <span className="font-semibold text-[#172B4D]">
                    {selectedOrder.weightKg ? `${selectedOrder.weightKg} kg` : '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#6B7280]">Metode Pembayaran</span>
                  <span className="font-bold text-[#172B4D]">{selectedOrder.paymentMethod || 'Tunai'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#6B7280]">Status Pembayaran</span>
                  <span className={`font-bold ${selectedOrder.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedOrder.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 bg-[#F8FAFC] px-2 rounded-lg">
                  <span className="font-bold text-[#6B7280]">Total Biaya</span>
                  <span className="font-black text-base text-[#172B4D]">
                    Rp {Number(selectedOrder.totalAmount ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  href={`/lacak?code=${selectedOrder.orderCode}`}
                  target="_blank"
                  className="flex-1 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#172B4D] font-bold text-xs text-center transition-colors"
                >
                  Pelacak Publik
                </Link>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 hover:opacity-95 transition-opacity cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E5E7EB] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
          <span>© 2026 LaundryKu Operational Management Dashboard.</span>
          <span>v2.0 • PRD Compliant</span>
        </div>
      </footer>
    </div>
  );
}
