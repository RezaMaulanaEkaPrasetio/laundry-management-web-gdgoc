'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  weight: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  workflowStatus: string;
  statusBadgeClass: string;
  time: string;
}

const initialOrders: OrderItem[] = [
  {
    id: '#LKU-8891',
    customerName: 'Aris Munandar',
    phone: '0812-9844-1290',
    service: 'Cuci Kilat (Express)',
    weight: '6.4 kg',
    total: 'Rp 64.000',
    paymentMethod: 'QRIS Dinamis',
    paymentStatus: 'Lunas',
    workflowStatus: 'Sedang Dicuci',
    statusBadgeClass: 'bg-primary-fixed-dim text-on-primary-fixed-variant',
    time: '10:15 WIB',
  },
  {
    id: '#LKU-8890',
    customerName: 'Sarah Vania',
    phone: '0856-7781-9921',
    service: 'Bedcover + Komplit',
    weight: '4.8 kg',
    total: 'Rp 72.000',
    paymentMethod: 'QRIS Dinamis',
    paymentStatus: 'Lunas',
    workflowStatus: 'Siap Diantar',
    statusBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    time: '09:40 WIB',
  },
  {
    id: '#LKU-8889',
    customerName: 'Dr. Faisal Riza',
    phone: '0813-1122-8371',
    service: 'Satuan Jas & Blazer',
    weight: '3 pcs',
    total: 'Rp 90.000',
    paymentMethod: 'QRIS Dinamis',
    paymentStatus: 'Lunas',
    workflowStatus: 'Selesai Dicuci',
    statusBadgeClass: 'bg-secondary-fixed-dim text-on-secondary-fixed-variant',
    time: '08:50 WIB',
  },
  {
    id: '#LKU-8888',
    customerName: 'Nita Pratiwi',
    phone: '0821-4321-7890',
    service: 'Kiloan Reguler Cuci Lipat',
    weight: '5.2 kg',
    total: 'Rp 36.400',
    paymentMethod: 'Tunai di Kasir',
    paymentStatus: 'Lunas',
    workflowStatus: 'Sudah Dijemput',
    statusBadgeClass: 'bg-surface-container-high text-on-surface-variant',
    time: '08:15 WIB',
  },
  {
    id: '#LKU-8887',
    customerName: 'Dimas Anggara',
    phone: '0878-5544-3321',
    service: 'Kiloan Cuci Setrika',
    weight: '7.0 kg',
    total: 'Rp 56.000',
    paymentMethod: 'Belum Bayar',
    paymentStatus: 'Belum Lunas',
    workflowStatus: 'Menunggu Penjemputan',
    statusBadgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    time: '07:55 WIB',
  },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showExportToast, setShowExportToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'Semua Status' || order.workflowStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-xl">
            <Link href="/admin" className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">LaundryKu</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-xs">
              <Link
                aria-current="page"
                className="px-space-md py-space-sm rounded-lg font-label-lg transition-colors bg-primary-container text-on-primary-container"
                href="/admin"
              >
                Dashboard Ringkasan
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/admin/pengaturan"
              >
                Pengaturan Outlet &amp; Tarif
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/admin/users"
              >
                Manajemen Staf
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/lacak"
                target="_blank"
              >
                Lacak Publik ↗
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight">Hendra Wijaya</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">Owner &amp; Superadmin</span>
              </div>
            </div>
            <div className="w-px h-6 bg-outline-variant/40 hidden sm:block"></div>
            <Link
              className="flex items-center justify-center p-space-xs rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
              href="/admin"
              title="Keluar dari Portal"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full px-margin py-space-lg flex flex-col gap-space-xl max-w-7xl mx-auto">
            
            {/* Toast Notification */}
            {showExportToast && (
              <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-space-md py-space-sm rounded-lg shadow-lg flex items-center gap-space-xs animate-bounce">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="font-label-md text-label-md">Laporan harian berhasil diekspor (CSV/Excel)!</span>
              </div>
            )}

            {/* Top Action / Context Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>Sistem Aktif • Sinkronisasi Real-Time</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-xs">
                  Ringkasan Operasional &amp; Bisnis
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Pantau kinerja operasional, status alur pesanan, dan arus kas harian secara real-time.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-sm rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Hari Ini, 24 Sep 2026</span>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-lg shadow-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px]">store</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Outlet Utama (Kemang)</span>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg px-space-md py-space-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  <span>Ekspor Laporan</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* KPI 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Pendapatan Hari Ini
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                </div>
                <div className="my-space-sm">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Rp 4.280.000</span>
                </div>
                <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  <span className="font-semibold">+14%</span>
                  <span className="text-on-surface-variant font-normal">vs. kemarin</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Total Cucian Masuk
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
                  </div>
                </div>
                <div className="my-space-sm flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">142</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">kg</span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span>38 pesanan diproses hari ini</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Order Selesai Hari Ini
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  </div>
                </div>
                <div className="my-space-sm flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">32</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">Order</span>
                </div>
                <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="font-semibold">94%</span>
                  <span className="text-on-surface-variant font-normal">dari target harian (34)</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Rata-Rata Selesai
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">timer</span>
                  </div>
                </div>
                <div className="my-space-sm flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">4.2</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">Jam</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>Target SLA: &lt; 6 Jam</span>
                  <span className="text-secondary font-semibold">98% On-Time</span>
                </div>
              </div>
            </div>

            {/* Main Content Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column: Kinerja Operasional & Beban Alur (Full row) */}
              <div className="lg:col-span-12 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Beban Alur Kerja Pesanan
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        38 pesanan aktif di seluruh tahapan layanan (Kemang Workshop)
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded-lg text-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">sync</span>
                      <span>Diperbarui 1 mnt lalu</span>
                    </div>
                  </div>

                  {/* Multi-segment Progress Bar */}
                  <div className="w-full flex h-3 rounded-full overflow-hidden bg-surface-container-high">
                    <div className="bg-tertiary-fixed-dim w-[13%] transition-all" title="Menunggu Penjemputan: 5"></div>
                    <div className="bg-surface-tint w-[18%] transition-all" title="Sudah Dijemput: 7"></div>
                    <div className="bg-primary-container w-[32%] transition-all" title="Sedang Dicuci: 12"></div>
                    <div className="bg-secondary-fixed-dim w-[21%] transition-all" title="Selesai Dicuci: 8"></div>
                    <div className="bg-secondary w-[11%] transition-all" title="Siap Diantar: 4"></div>
                    <div className="bg-outline-variant w-[5%] transition-all" title="Menunggu Pembayaran: 2"></div>
                  </div>

                  {/* 6 Stage Status Counter Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm pt-space-xs">
                    <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">1. Menjemput</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-xs">5</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Order</span>
                    </div>
                    <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">2. Dijemput</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-xs">7</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Order</span>
                    </div>
                    <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
                      <span className="font-label-sm text-label-sm text-primary font-bold">3. Sedang Cuci</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold mt-space-xs">12</span>
                      <span className="font-body-sm text-body-sm text-primary font-semibold">Dalam Proses</span>
                    </div>
                    <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">4. Selesai Cuci</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-xs">8</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Siap Kemas</span>
                    </div>
                    <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
                      <span className="font-label-sm text-label-sm text-secondary font-semibold">5. Siap Antar</span>
                      <span className="font-headline-sm text-headline-sm text-secondary font-bold mt-space-xs">4</span>
                      <span className="font-body-sm text-body-sm text-secondary font-semibold">Siap Jalan</span>
                    </div>
                    <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">6. Menunggu Bayar</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-xs">2</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Belum Lunas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Ringkasan Keuangan (5 cols) & Pesanan Prioritas (7 cols) */}
              <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Ringkasan Keuangan */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Metode Pembayaran
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Arus kas otomatis MVP Fase 1
                      </span>
                    </div>
                    <span className="font-label-md text-label-md text-secondary font-bold">100% Terekonsiliasi</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-space-lg py-space-xs">
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                          className="text-surface-container-high"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <circle
                          className="text-primary-container"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="currentColor"
                          strokeDasharray="65.97 87.96"
                          strokeDashoffset="0"
                          strokeWidth="4"
                        ></circle>
                        <circle
                          className="text-secondary"
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="currentColor"
                          strokeDasharray="21.99 87.96"
                          strokeDashoffset="-65.97"
                          strokeWidth="4"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">QRIS</span>
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">75%</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-space-sm w-full">
                      <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-space-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">QRIS Dinamis (75%)</span>
                        </div>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Rp 3.210.000</span>
                      </div>
                      <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-space-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">Tunai di Kasir (25%)</span>
                        </div>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Rp 1.070.000</span>
                      </div>
                      <div className="pt-space-xs border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-body-sm">
                        <span className="text-[11px]">Total Kas Masuk</span>
                        <span className="font-bold text-on-surface text-label-md">Rp 4.280.000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pesanan Prioritas Terbaru */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Pesanan Prioritas Terbaru
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Update pesanan express &amp; reguler terkini
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                    >
                      Lihat Semua
                    </button>
                  </div>
                  <div className="flex flex-col gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-md text-label-md text-primary font-bold">#LK-8891</span>
                          <span className="font-body-sm text-body-sm text-on-surface truncate font-semibold">
                            Bpk. Aris Munandar
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Kemang • Cuci Kilat • 6.4 kg</span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold bg-primary-fixed text-primary">
                          Sedang Dicuci
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">Lunas (QRIS)</span>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-md text-label-md text-primary font-bold">#LK-8890</span>
                          <span className="font-body-sm text-body-sm text-on-surface truncate font-semibold">
                            Ibu Sarah Vania
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Kemang • Bedcover + Komplit • 4.8 kg</span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold bg-secondary-fixed text-on-secondary-fixed">
                          Siap Diantar
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">Lunas (QRIS)</span>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-md text-label-md text-primary font-bold">#LK-8889</span>
                          <span className="font-body-sm text-body-sm text-on-surface truncate font-semibold">
                            Dr. Faisal Riza
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Kemang • Satuan Jas • 3 pcs</span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold bg-secondary-fixed-dim text-on-secondary-fixed-variant">
                          Selesai Dicuci
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">Lunas (QRIS)</span>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-md text-label-md text-primary font-bold">#LK-8888</span>
                          <span className="font-body-sm text-body-sm text-on-surface truncate font-semibold">
                            Nita Pratiwi
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Kemang • Kiloan Reguler • 5.2 kg</span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold bg-surface-container text-on-surface-variant">
                          Sudah Dijemput
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">Lunas (Tunai)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Riwayat & Monitoring Pesanan Table */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md mb-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="flex flex-col">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Riwayat &amp; Monitoring Pesanan
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Pelacakan status pesanan real-time, penerimaan laundry, dan pembayaran kasir
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-space-xs">
                  <div className="relative">
                    <input
                      className="bg-surface-container-low text-on-surface font-body-sm text-body-sm px-space-md py-space-sm rounded-lg pl-8 focus:outline-none placeholder:text-on-surface-variant/60 w-56"
                      placeholder="Cari pesanan / nama..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      search
                    </span>
                  </div>
                  <select
                    className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-sm py-space-sm rounded-lg focus:outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>Semua Status</option>
                    <option>Menunggu Penjemputan</option>
                    <option>Sudah Dijemput</option>
                    <option>Sedang Dicuci</option>
                    <option>Selesai Dicuci</option>
                    <option>Siap Diantar</option>
                    <option>Menunggu Pembayaran</option>
                  </select>
                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm px-space-sm py-space-sm rounded-lg transition-colors cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-[16px] text-primary ${isRefreshing ? 'animate-spin' : ''}`}>
                      refresh
                    </span>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <tr>
                      <th className="py-space-sm px-space-md rounded-l-lg">ID Order</th>
                      <th className="py-space-sm px-space-md">Pelanggan</th>
                      <th className="py-space-sm px-space-md">Layanan</th>
                      <th className="py-space-sm px-space-md">Berat / Qty</th>
                      <th className="py-space-sm px-space-md">Total Biaya</th>
                      <th className="py-space-sm px-space-md">Pembayaran</th>
                      <th className="py-space-sm px-space-md">Status Alur</th>
                      <th className="py-space-sm px-space-md">Waktu Masuk</th>
                      <th className="py-space-sm px-space-md text-right rounded-r-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-space-lg text-center text-on-surface-variant font-body-md">
                          Tidak ditemukan data pesanan yang sesuai dengan filter atau kata kunci pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-space-md px-space-md font-label-md font-bold text-primary">{order.id}</td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col">
                              <span className="font-semibold">{order.customerName}</span>
                              <span className="text-[11px] text-on-surface-variant">{order.phone}</span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">{order.service}</td>
                          <td className="py-space-md px-space-md font-medium">{order.weight}</td>
                          <td className="py-space-md px-space-md font-bold">{order.total}</td>
                          <td className="py-space-md px-space-md">
                            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm bg-primary-fixed text-primary font-semibold">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span className={`inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold ${order.statusBadgeClass}`}>
                              {order.workflowStatus}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md text-on-surface-variant">{order.time}</td>
                          <td className="py-space-md px-space-md text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="font-label-sm text-primary hover:underline font-semibold cursor-pointer"
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/30 animate-in fade-in zoom-in duration-150">
                  <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm font-bold text-primary">{selectedOrder.id}</span>
                      <span className={`px-space-xs py-0.5 rounded-full text-label-sm font-semibold ${selectedOrder.statusBadgeClass}`}>
                        {selectedOrder.workflowStatus}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-space-sm text-body-sm">
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Pelanggan</span>
                      <span className="font-semibold text-on-surface">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">No. Telepon / WA</span>
                      <span className="font-semibold text-primary">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Layanan</span>
                      <span className="font-semibold text-on-surface">{selectedOrder.service}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Berat / Jumlah</span>
                      <span className="font-semibold text-on-surface">{selectedOrder.weight}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Metode Pembayaran</span>
                      <span className="font-semibold text-on-surface">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Total Biaya</span>
                      <span className="font-bold text-headline-sm text-primary">{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-on-surface-variant">Waktu Order Masuk</span>
                      <span className="text-on-surface">{selectedOrder.time}</span>
                    </div>
                  </div>

                  <div className="pt-space-sm flex gap-space-sm">
                    <Link
                      href={`/lacak`}
                      target="_blank"
                      className="flex-1 py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg text-center transition-colors"
                    >
                      Buka Pelacak Publik
                    </Link>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 py-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-lg transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-lg mt-auto">
        <div className="w-full px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-on-surface font-semibold">LaundryKu Portal Operasional</span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Sistem Manajemen Presisi Satu Halaman</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 LaundryKu Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
