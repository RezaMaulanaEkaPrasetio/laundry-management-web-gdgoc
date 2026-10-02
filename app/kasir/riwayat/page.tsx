'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import KasirNav from '../_components/KasirNav';

export default function RiwayatOrderPage() {
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('bulan-ini');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [serviceFilter, setServiceFilter] = useState('semua');
  const [modalData, setModalData] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'semua') {
        params.append('status', statusFilter);
      }
      if (dateFilter === 'hari-ini') {
        params.append('date', new Date().toISOString().slice(0, 10));
      }
      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat riwayat order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, [statusFilter, dateFilter]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const showToast = (message: string) => {
    setToastMsg(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2600);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDateFilter('bulan-ini');
    setStatusFilter('semua');
    setServiceFilter('semua');
    showToast('Penyaringan arsip diatur ulang ke kondisi default.');
  };

  const getServiceLabel = (type: string, speed: string) => {
    const typeStr = type === 'CKL' ? 'Cuci Komplit' : 'Cuci Kering';
    const speedStr = speed === 'KILAT' ? 'Kilat' : speed === 'EXPRESS' ? 'Express' : 'Reguler';
    return `${typeStr} ${speedStr}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELESAI':
        return { label: 'Selesai', icon: 'check', isCancelled: false };
      case 'DIBATALKAN':
        return { label: 'Dibatalkan', icon: 'close', isCancelled: true };
      case 'MENUNGGU_PEMBAYARAN':
        return { label: 'Menunggu Bayar', icon: 'payments', isCancelled: false };
      case 'SIAP_DIANTAR':
        return { label: 'Siap Diantar', icon: 'local_shipping', isCancelled: false };
      case 'SELESAI_DICUCI':
        return { label: 'Selesai Dicuci', icon: 'dry_cleaning', isCancelled: false };
      case 'SEDANG_DICUCI':
        return { label: 'Sedang Dicuci', icon: 'local_laundry_service', isCancelled: false };
      case 'SUDAH_DIJEMPUT':
        return { label: 'Sudah Dijemput', icon: 'inventory_2', isCancelled: false };
      case 'MENUNGGU_PENJEMPUTAN':
        return { label: 'Menunggu Jemput', icon: 'schedule', isCancelled: false };
      default:
        return { label: status, icon: 'info', isCancelled: false };
    }
  };

  const filteredData = orders.filter((row) => {
    // Service filter
    if (serviceFilter !== 'semua') {
      if (serviceFilter === 'reguler' && row.serviceSpeed !== 'REGULER') return false;
      if (serviceFilter === 'kilat' && row.serviceSpeed !== 'KILAT') return false;
      if (serviceFilter === 'express' && row.serviceSpeed !== 'EXPRESS') return false;
      if (serviceFilter === 'kering' && row.serviceType !== 'CKG') return false;
    }

    // Date filter on client for 7-hari / bulan-ini
    if (dateFilter === '7-hari') {
      const orderDate = new Date(row.createdAt).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (orderDate < sevenDaysAgo) return false;
    } else if (dateFilter === 'bulan-ini') {
      const orderDate = new Date(row.createdAt);
      const now = new Date();
      if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    }

    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const codeMatch = row.orderCode?.toLowerCase().includes(q);
      const nameMatch = row.customerName?.toLowerCase().includes(q);
      const phoneMatch = row.customerPhone?.toLowerCase().includes(q);
      if (!codeMatch && !nameMatch && !phoneMatch) return false;
    }

    return true;
  });

  const totalSelesai = orders.filter((o) => o.status === 'SELESAI').length;
  const totalDibatalkan = orders.filter((o) => o.status === 'DIBATALKAN').length;
  const totalBerat = orders.reduce((sum, o) => sum + (Number(o.weightKg) || 0), 0);
  const totalPendapatan = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <>
      {/* Header Terpadu Kasir */}
      <KasirNav />

      {/* Main */}
      <main className="w-full bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-margin py-space-lg">
          <div className="flex flex-col w-full gap-space-lg">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-primary">archive</span>
                  <span>Modul Kasir &amp; Pembukuan Operasional</span>
                  <span className="text-surface-container-highest">•</span>
                  <span className="text-secondary font-label-sm">Sinkronisasi Database Aktif</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Riwayat Order &amp; Arsip Transaksi</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Daftar seluruh transaksi cucian yang telah selesai atau dibatalkan untuk arsip operasional dan pembukuan kasir.</p>
              </div>
              <div className="flex items-center gap-space-sm flex-wrap">
                <button
                  className="inline-flex items-center gap-space-xs px-4 h-11 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors font-label-lg text-label-lg"
                  onClick={() => {
                    showToast('Mengekspor data ke CSV...');
                    setTimeout(() => showToast('Unduhan CSV berhasil disiapkan.'), 1200);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">file_download</span>
                  <span>Ekspor CSV</span>
                </button>
                <Link
                  href="/kasir"
                  className="inline-flex items-center gap-space-xs px-4 h-11 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-colors font-label-lg text-label-lg shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span>Kembali ke Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant">Total Order Selesai</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">Semua</span>
                </div>
                <div className="mt-3 flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">{totalSelesai}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Pesanan</span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-secondary">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Status Selesai di Sistem</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant">Total Dibatalkan</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Semua</span>
                </div>
                <div className="mt-3 flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">{totalDibatalkan}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Pesanan</span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-error">cancel</span>
                  <span>Pembatalan nota/transaksi</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant">Berat Cucian Terproses</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm">Layanan Kiloan</span>
                </div>
                <div className="mt-3 flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">{totalBerat.toFixed(1)}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">kg</span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-primary">
                  <span className="material-symbols-outlined text-[16px]">scale</span>
                  <span>Total berat terdata</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant">Pendapatan Terarsip</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">Kas Terbayar</span>
                </div>
                <div className="mt-3 flex items-baseline gap-space-xs">
                  <span className="font-headline-md text-headline-md text-primary font-extrabold tracking-tight">
                    Rp {totalPendapatan.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-secondary">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                  <span>Rekonsiliasi tunai &amp; QRIS</span>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
              <div className="relative flex-1 min-w-[280px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">search</span>
                <input
                  className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Cari kode order (LK-...), nama pelanggan, atau no HP..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-space-xs flex-wrap">
                <div className="relative">
                  <select
                    className="h-11 px-3 bg-surface-container-low rounded-lg font-label-lg text-label-lg text-on-surface appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="bulan-ini">Bulan Ini</option>
                    <option value="7-hari">7 Hari Terakhir</option>
                    <option value="hari-ini">Hari Ini</option>
                    <option value="semua">Semua Waktu</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">calendar_today</span>
                </div>
                <div className="relative">
                  <select
                    className="h-11 px-3 bg-surface-container-low rounded-lg font-label-lg text-label-lg text-on-surface appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="semua">Semua Status</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DIBATALKAN">Dibatalkan</option>
                    <option value="MENUNGGU_PEMBAYARAN">Menunggu Bayar</option>
                    <option value="SIAP_DIANTAR">Siap Diantar</option>
                    <option value="SEDANG_DICUCI">Sedang Dicuci</option>
                    <option value="MENUNGGU_PENJEMPUTAN">Menunggu Penjemputan</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">filter_list</span>
                </div>
                <div className="relative">
                  <select
                    className="h-11 px-3 bg-surface-container-low rounded-lg font-label-lg text-label-lg text-on-surface appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                  >
                    <option value="semua">Semua Layanan</option>
                    <option value="reguler">Reguler</option>
                    <option value="express">Express</option>
                    <option value="kilat">Kilat</option>
                    <option value="kering">Cuci Kering Saja</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">local_laundry_service</span>
                </div>
                <button
                  className="h-11 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors flex items-center gap-1 font-label-lg text-label-lg cursor-pointer"
                  onClick={resetFilters}
                  title="Reset"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              {loading ? (
                <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                  <span className="font-body-md">Memuat riwayat transaksi...</span>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">inbox</span>
                  <span className="font-label-lg font-bold text-on-surface">Tidak ada data order</span>
                  <span className="font-body-sm text-on-surface-variant">Tidak ditemukan transaksi yang cocok dengan kriteria filter.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="py-3.5 px-space-md">No. Nota &amp; Waktu</th>
                        <th className="py-3.5 px-space-md">Pelanggan &amp; Kontak</th>
                        <th className="py-3.5 px-space-md">Layanan &amp; Berat</th>
                        <th className="py-3.5 px-space-md">Total &amp; Pembayaran</th>
                        <th className="py-3.5 px-space-md">Status Order</th>
                        <th className="py-3.5 px-space-md">Petugas Terlibat</th>
                        <th className="py-3.5 px-space-md text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-md text-body-md text-on-surface">
                      {filteredData.map((row, i) => {
                        const badge = getStatusBadge(row.status);
                        const isCancelled = badge.isCancelled;
                        const serviceLabel = getServiceLabel(row.serviceType, row.serviceSpeed);
                        const formattedWeight = row.weightKg ? `${row.weightKg} kg` : '- kg';
                        const formattedTotal = row.totalAmount
                          ? `Rp ${Number(row.totalAmount).toLocaleString('id-ID')}`
                          : 'Rp 0';
                        const paymentLabel = `${row.paymentMethod ?? 'Belum Bayar'} • ${row.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'}`;

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-surface-container-low/60 transition-colors ${
                              i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'
                            }`}
                          >
                            <td className="py-space-md px-space-md align-top">
                              <div className="flex flex-col">
                                <span className={`font-label-lg text-label-lg font-bold ${isCancelled ? 'text-outline' : 'text-primary'}`}>
                                  {row.orderCode}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                  {formatDate(row.createdAt)}
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md align-top">
                              <div className="flex flex-col">
                                <span className={`font-label-lg text-label-lg text-on-surface ${isCancelled ? 'line-through opacity-70' : ''}`}>
                                  {row.customerName}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">call</span>
                                  <span>{row.customerPhone}</span>
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md align-top">
                              <div className="flex flex-col">
                                <span className={`font-label-lg text-label-lg ${isCancelled ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                                  {serviceLabel}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 flex items-center gap-1 font-medium">
                                  <span className="material-symbols-outlined text-[14px]">scale</span>
                                  <span>{formattedWeight}</span>
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md align-top">
                              <div className="flex flex-col items-start gap-1">
                                <span className={`font-label-lg text-label-lg font-bold ${isCancelled ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                                  {formattedTotal}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                                    isCancelled
                                      ? 'bg-error-container text-on-error-container'
                                      : row.paymentStatus === 'PAID'
                                      ? 'bg-secondary-container text-on-secondary-container'
                                      : 'bg-surface-container-high text-on-surface-variant'
                                  }`}
                                >
                                  {paymentLabel}
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md align-top">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm ${
                                  isCancelled
                                    ? 'bg-error-container text-on-error-container'
                                    : row.status === 'SELESAI'
                                    ? 'bg-secondary-container text-on-secondary-container'
                                    : 'bg-primary-container text-on-primary-container'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                                <span>{badge.label}</span>
                              </span>
                            </td>
                            <td className="py-space-md px-space-md align-top">
                              <div className="flex flex-col">
                                <span className="font-label-md text-label-md text-on-surface">
                                  {row.kasir?.name ?? '-'}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Kasir</span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md align-top text-right">
                              <div className="flex items-center justify-end gap-space-xs">
                                <button
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isCancelled
                                      ? 'text-on-surface-variant hover:bg-surface-container-high'
                                      : 'text-primary hover:bg-primary-fixed'
                                  }`}
                                  title={isCancelled ? 'Lihat Alasan Pembatalan' : 'Lihat Rincian Nota'}
                                  onClick={() => setModalData(row)}
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[20px]">{isCancelled ? 'info' : 'visibility'}</span>
                                </button>
                                {isCancelled ? (
                                  <button className="p-1.5 rounded-lg text-on-surface-variant/40 cursor-not-allowed" disabled title="Nota Dibatalkan" type="button">
                                    <span className="material-symbols-outlined text-[20px]">print_disabled</span>
                                  </button>
                                ) : (
                                  <button
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                                    title="Cetak Ulang"
                                    onClick={() => showToast(`Mengirim ${row.orderCode} ke Thermal Printer POS...`)}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">print</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Info */}
              <div className="p-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Menampilkan <span className="font-semibold text-on-surface">1 - {filteredData.length}</span> dari <span className="font-semibold text-on-surface">{orders.length}</span> riwayat order terarsip
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalData(null)}>
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{modalData.orderCode}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm ${getStatusBadge(modalData.status).isCancelled ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {getStatusBadge(modalData.status).label}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">{formatDate(modalData.createdAt)}</span>
              </div>
              <button className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer" onClick={() => setModalData(null)} type="button">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Pelanggan:</span>
                <span className="font-semibold text-on-surface">{modalData.customerName} ({modalData.customerPhone})</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Paket / Layanan:</span>
                <span className="font-semibold text-on-surface">{getServiceLabel(modalData.serviceType, modalData.serviceSpeed)}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Berat Total:</span>
                <span className="font-semibold text-on-surface">{modalData.weightKg ? `${modalData.weightKg} kg` : '- kg'}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Tarif Per Kg:</span>
                <span className="font-semibold text-on-surface">{modalData.pricePerKg ? `Rp ${Number(modalData.pricePerKg).toLocaleString('id-ID')} / kg` : '-'}</span>
              </div>
              <div className="h-px bg-surface-container-highest my-1" />
              <div className="flex justify-between items-center text-body-md font-body-md">
                <span className="font-semibold text-on-surface">Total Tagihan:</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {modalData.totalAmount ? `Rp ${Number(modalData.totalAmount).toLocaleString('id-ID')}` : 'Rp 0'}
                </span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-secondary">
                <span>Metode Pembayaran:</span>
                <span className="font-semibold">{modalData.paymentMethod ?? 'Belum dipilih'} • {modalData.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
              <span>Kasir: {modalData.kasir?.name ?? '-'}</span>
              <span>Kurir: {modalData.kurir?.name ?? '-'}</span>
              <span>Petugas: {modalData.petugas?.name ?? '-'}</span>
            </div>
            <div className="flex items-center justify-end gap-space-sm mt-2">
              {modalData.status !== 'DIBATALKAN' && (
                <button
                  className="h-11 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  onClick={() => {
                    setModalData(null);
                    showToast('Mencetak salinan arsip nota ke printer kasir.');
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Cetak Salinan</span>
                </button>
              )}
              <button
                className="h-11 px-5 rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer"
                onClick={() => setModalData(null)}
                type="button"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-xl font-body-md text-body-md flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[20px] text-secondary-container">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-surface-container-low mt-space-xl">
        <div className="max-w-7xl mx-auto px-margin py-space-md flex flex-col sm:flex-row items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-primary">local_laundry_service</span>
            <span>LaundryKu POS System • Terminal #01 (Senopati)</span>
          </div>
          <div>© 2026 LaundryKu. Hak cipta dilindungi.</div>
        </div>
      </footer>
    </>
  );
}
