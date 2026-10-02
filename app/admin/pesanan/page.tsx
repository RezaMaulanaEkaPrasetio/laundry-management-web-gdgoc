'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '../_components/AdminNav';

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [paymentFilter, setPaymentFilter] = useState('Semua Pembayaran');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const getServiceLabel = (serviceType: string, speed: string) => {
    const typeLabel = serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
    return `${speed} ${typeLabel}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'MENUNGGU_PENJEMPUTAN':
        return 'bg-tertiary-fixed text-on-tertiary-fixed';
      case 'SUDAH_DIJEMPUT':
        return 'bg-surface-container-high text-on-surface-variant';
      case 'SEDANG_DICUCI':
        return 'bg-primary-fixed text-primary';
      case 'SELESAI_DICUCI':
        return 'bg-secondary-fixed-dim text-on-secondary-fixed-variant';
      case 'SIAP_DIANTAR':
        return 'bg-secondary-fixed text-on-secondary-fixed';
      case 'MENUNGGU_PEMBAYARAN':
        return 'bg-error-container text-on-error-container';
      case 'SELESAI':
        return 'bg-secondary-container text-on-secondary-container';
      default:
        return 'bg-surface-container text-on-surface';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderCode?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.customerPhone?.includes(q) ||
      order.serviceType?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'Semua Status' || order.status === statusFilter;

    const matchesPayment =
      paymentFilter === 'Semua Pembayaran' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50">
        <AdminNav />
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-14 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full px-margin py-space-lg flex flex-col gap-space-lg max-w-7xl mx-auto">
            {/* Toast Notification */}
            {showExportToast && (
              <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-space-md py-space-sm rounded-lg shadow-lg flex items-center gap-space-xs animate-bounce">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="font-label-md text-label-md">Laporan data pesanan berhasil disiapkan!</span>
              </div>
            )}

            {/* Top Bar Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>Semua Data Pesanan Real-Time</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-xs font-bold">
                  Daftar &amp; Monitoring Pesanan
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Lihat, lacak, dan filter seluruh transaksi laundry yang masuk ke sistem.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-space-sm">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg px-space-md py-space-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  <span>Ekspor CSV</span>
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-space-xs bg-primary-container text-on-primary-container hover:bg-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>Segarkan</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm">
              <div className="relative flex-1 min-w-[260px]">
                <input
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/60"
                  placeholder="Cari kode pesanan (LK-...), nama, no WA..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  search
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-space-xs">
                <select
                  className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-md py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Semua Status">Semua Status</option>
                  <option value="MENUNGGU_PENJEMPUTAN">Menunggu Penjemputan</option>
                  <option value="SUDAH_DIJEMPUT">Sudah Dijemput</option>
                  <option value="SEDANG_DICUCI">Sedang Dicuci</option>
                  <option value="SELESAI_DICUCI">Selesai Dicuci</option>
                  <option value="SIAP_DIANTAR">Siap Diantar</option>
                  <option value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</option>
                  <option value="SELESAI">Selesai</option>
                  <option value="DIBATALKAN">Dibatalkan</option>
                </select>

                <select
                  className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-md py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="Semua Pembayaran">Semua Pembayaran</option>
                  <option value="PAID">Lunas (PAID)</option>
                  <option value="UNPAID">Belum Lunas (UNPAID)</option>
                </select>

                {(searchQuery || statusFilter !== 'Semua Status' || paymentFilter !== 'Semua Pembayaran') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('Semua Status');
                      setPaymentFilter('Semua Pembayaran');
                    }}
                    className="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer text-sm"
                    title="Reset Filter"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <tr>
                      <th className="py-space-sm px-space-md">ID Order</th>
                      <th className="py-space-sm px-space-md">Pelanggan</th>
                      <th className="py-space-sm px-space-md">Layanan</th>
                      <th className="py-space-sm px-space-md">Berat</th>
                      <th className="py-space-sm px-space-md">Total Biaya</th>
                      <th className="py-space-sm px-space-md">Pembayaran</th>
                      <th className="py-space-sm px-space-md">Status Alur</th>
                      <th className="py-space-sm px-space-md">Waktu Masuk</th>
                      <th className="py-space-sm px-space-md text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="py-space-xl text-center text-on-surface-variant font-body-md">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[32px] text-primary animate-spin">sync</span>
                            <span>Memuat data pesanan...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-space-xl text-center text-on-surface-variant font-body-md">
                          Tidak ditemukan data pesanan yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-space-md px-space-md font-label-md font-bold text-primary">
                            {order.orderCode}
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col">
                              <span className="font-semibold text-on-surface">{order.customerName}</span>
                              <span className="text-[11px] text-on-surface-variant">{order.customerPhone || '-'}</span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md text-on-surface">
                            {getServiceLabel(order.serviceType, order.serviceSpeed)}
                          </td>
                          <td className="py-space-md px-space-md font-medium text-on-surface">
                            {order.weightKg ? `${order.weightKg} kg` : '-'}
                          </td>
                          <td className="py-space-md px-space-md font-bold text-on-surface">
                            Rp {Number(order.totalAmount ?? 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-space-md px-space-md">
                            <span
                              className={`inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold ${
                                order.paymentStatus === 'PAID'
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : 'bg-error-container text-on-error-container'
                              }`}
                            >
                              {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span
                              className={`inline-flex items-center px-space-xs py-0.5 rounded-full text-label-sm font-semibold ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md text-on-surface-variant">
                            {new Date(order.createdAt).toLocaleString('id-ID')}
                          </td>
                          <td className="py-space-md px-space-md text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="font-label-sm text-primary hover:underline font-semibold cursor-pointer"
                              type="button"
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

              {/* Table Footer info */}
              <div className="p-space-md bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-body-sm text-on-surface-variant">
                <span>
                  Menampilkan <span className="font-semibold text-on-surface">{filteredOrders.length}</span> dari{' '}
                  <span className="font-semibold text-on-surface">{orders.length}</span> pesanan
                </span>
                <Link href="/admin" className="text-primary hover:underline font-medium mt-1 sm:mt-0">
                  ← Kembali ke Ringkasan
                </Link>
              </div>
            </div>

            {/* Modal Detail Pesanan */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={() => setSelectedOrder(null)}>
                <div
                  className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm font-bold text-primary">
                        {selectedOrder.orderCode}
                      </span>
                      <span
                        className={`px-space-xs py-0.5 rounded-full text-label-sm font-semibold ${getStatusBadgeClass(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container cursor-pointer"
                      type="button"
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
                      <span className="text-on-surface-variant">No. WhatsApp</span>
                      <span className="font-semibold text-primary">{selectedOrder.customerPhone || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Layanan</span>
                      <span className="font-semibold text-on-surface">
                        {getServiceLabel(selectedOrder.serviceType, selectedOrder.serviceSpeed)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Berat Total</span>
                      <span className="font-semibold text-on-surface">
                        {selectedOrder.weightKg ? `${selectedOrder.weightKg} kg` : 'Belum Ditimbang'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Alamat Jemput</span>
                      <span className="text-on-surface max-w-[280px] text-right">
                        {selectedOrder.pickupAddress || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Alamat Antar</span>
                      <span className="text-on-surface max-w-[280px] text-right">
                        {selectedOrder.deliveryAddress || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Catatan Khusus</span>
                      <span className="text-on-surface italic">{selectedOrder.notes || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Metode Pembayaran</span>
                      <span className="font-semibold text-on-surface">
                        {selectedOrder.paymentMethod || 'Belum dipilih'} ({selectedOrder.paymentStatus})
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant">Total Biaya</span>
                      <span className="font-bold text-headline-sm text-primary">
                        Rp {Number(selectedOrder.totalAmount ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-on-surface-variant">Waktu Order Masuk</span>
                      <span className="text-on-surface">{new Date(selectedOrder.createdAt).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-space-xs">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                      type="button"
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
    </div>
  );
}
