'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import KasirNav from '../../_components/KasirNav';

export default function DetailOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState<'cash' | 'qris'>('cash');
  const [cashAmount, setCashAmount] = useState(50000);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          const total = Number(data.totalAmount ?? 0);
          setCashAmount(total > 0 ? (total <= 50000 ? 50000 : total) : 50000);
        }
      } catch (err) {
        console.error('Gagal mengambil data order', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const totalBill = Number(order?.totalAmount ?? 0);
  const change = cashAmount - totalBill;

  const handleKonfirmasiBayar = async (method: 'QRIS' | 'TUNAI') => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method,
          kasirId: user?.id,
        }),
      });

      if (res.ok) {
        alert('Pembayaran berhasil dikonfirmasi!');
        router.push('/kasir');
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal mengonfirmasi pembayaran');
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const getServiceLabel = (serviceType: string, speed: string) => {
    const typeLabel = serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
    return `${speed} ${typeLabel}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[40px] text-primary animate-spin">cyclone</span>
          <p className="font-label-lg text-label-lg text-on-surface">Memuat rincian order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center p-6 bg-surface-container-lowest rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[44px] text-error">error</span>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Order Tidak Ditemukan</h2>
          <Link href="/kasir" className="mt-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'PAID';

  return (
    <>
      {/* Header Terpadu Kasir */}
      <KasirNav />

      {/* Main */}
      <main className="w-full flex-1 bg-[#F8FAFC]">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
            {/* Navigation Back */}
            <div className="flex items-center justify-between">
              <Link href="/kasir" className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-on-primary-fixed-variant transition-colors group">
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                <span>Kembali ke Dashboard Kasir</span>
              </Link>
              <span className="font-label-md text-label-md text-outline">Terminal Kasir • Kasir Aktif</span>
            </div>

            {/* Header Action Bar */}
            <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">Detail Order #{order.orderCode}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md font-bold ${isPaid ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed/30 text-tertiary'}`}>
                    <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-secondary' : 'bg-tertiary-fixed-dim animate-pulse'}`} />
                    {isPaid ? 'Sudah Lunas' : 'Menunggu Pembayaran'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">local_laundry_service</span>
                    {getServiceLabel(order.serviceType, order.serviceSpeed)}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Dibuat: {new Date(order.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Cetak Nota Kasir</span>
                </button>
                {order.customerPhone && (
                  <a
                    className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md transition-colors shadow-sm"
                    href={`https://wa.me/62${order.customerPhone.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Hubungi via WhatsApp</span>
                  </a>
                )}
              </div>
            </section>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                {/* Customer & Logistics */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">person_pin</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Data Pelanggan &amp; Pengiriman</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                    <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
                      <span className="font-label-md text-label-md text-outline">Nama Pelanggan</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">{order.customerName}</span>
                      <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">call</span>{order.customerPhone || '-'}
                      </span>
                    </div>
                    <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
                      <span className="font-label-md text-label-md text-outline">Status Operasional</span>
                      <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5 font-bold">
                        <span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="font-body-sm text-body-sm text-secondary font-medium">Kurir: {order.kurir?.name ?? 'Kurir Outlet'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-label-md text-label-md text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">trip_origin</span>Alamat Penjemputan
                      </span>
                      <p className="font-body-md text-body-md text-on-surface bg-surface-container-low/60 p-2.5 rounded-lg">
                        {order.pickupAddress || '-'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label-md text-label-md text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">location_on</span>Alamat Pengantaran
                      </span>
                      <p className="font-body-md text-body-md text-on-surface bg-surface-container-low/60 p-2.5 rounded-lg">
                        {order.deliveryAddress || '-'}
                      </p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="bg-tertiary-fixed/15 p-space-md rounded-lg flex items-start gap-space-sm">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">priority_high</span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-tertiary font-bold">Catatan Khusus Cucian:</span>
                        <p className="font-body-md text-body-md text-on-surface mt-0.5">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </article>

                {/* Service & Weight */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">scale</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Rincian Timbangan &amp; Layanan Cucian</h2>
                    </div>
                    <span className="inline-flex items-center gap-1 text-secondary bg-secondary-fixed/30 font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>Terverifikasi Workshop
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-label-md text-label-md text-outline">Layanan Utama</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{getServiceLabel(order.serviceType, order.serviceSpeed)}</h3>
                      <div className="inline-flex items-center gap-1.5 mt-2 text-outline font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                        <span>Petugas: <strong>{order.petugas?.name ?? 'Petugas Workshop'}</strong></span>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-center gap-2 min-w-[160px] text-center">
                      <span className="font-display-scale-weight text-display-scale-weight text-primary tracking-tight font-extrabold">
                        {order.weightKg ? Number(order.weightKg).toFixed(2) : '-'}
                      </span>
                      <span className="font-headline-md text-headline-md text-outline font-semibold">kg</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center justify-between py-2 bg-surface-container-low/40 px-3 rounded-lg font-body-md text-body-md">
                      <span className="text-on-surface font-medium">Tarif Dasar per kg</span>
                      <span className="text-on-surface font-semibold">Rp {Number(order.pricePerKg ?? 0).toLocaleString('id-ID')} / kg</span>
                    </div>
                    <div className="flex items-center justify-between py-2 bg-surface-container-low/40 px-3 rounded-lg font-body-md text-body-md">
                      <span className="text-on-surface font-medium">Total Tagihan Cucian</span>
                      <span className="text-on-surface font-bold">Rp {totalBill.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </article>

                {/* Audit Trail */}
                {order.statusLogs && order.statusLogs.length > 0 && (
                  <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Audit Trail Status Order</h2>
                      </div>
                    </div>
                    <div className="relative pl-6 flex flex-col gap-space-md border-l-2 border-surface-container">
                      {order.statusLogs.map((log: any, idx: number) => (
                        <div key={log.id || idx} className="relative flex items-start gap-space-md">
                          <span className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full ${idx === order.statusLogs.length - 1 ? 'bg-primary ring-4 ring-primary-fixed' : 'bg-secondary'}`} />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                {new Date(log.changedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </span>
                              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container font-semibold">
                                {log.statusTo.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface font-medium">{log.notes || `Status diperbarui ke ${log.statusTo}`}</p>
                            <span className="font-body-sm text-body-sm text-outline">
                              Oleh: {log.changedBy?.name ?? 'Sistem'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                )}
              </div>

              {/* Right Column: Ringkasan Tagihan & Pembayaran */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-20">
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-lg">
                  <div className="flex items-center justify-between pb-space-xs">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Ringkasan Tagihan</h2>
                    <span className={`px-2.5 py-1 rounded-full font-label-md text-label-md font-bold ${isPaid ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                      {isPaid ? 'Sudah Lunas' : 'Belum Lunas'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-xl">
                    <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                      <span>Subtotal Cucian ({order.weightKg ?? 0} kg)</span>
                      <span className="text-on-surface font-semibold">Rp {totalBill.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                      <span>Biaya Pengantaran</span>
                      <span className="text-secondary font-semibold">Rp 0 (Gratis)</span>
                    </div>
                    <div className="h-px bg-surface-container-highest my-2" />
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Total Tagihan</span>
                      <span className="font-headline-lg text-headline-lg text-primary font-bold">
                        Rp {totalBill.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  {!isPaid ? (
                    <div className="flex flex-col gap-space-md">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-lg text-label-lg text-on-surface font-semibold">Metode Pembayaran</label>
                        <p className="font-body-sm text-body-sm text-outline">Pilih metode penyelesaian pembayaran kasir saat ini:</p>
                      </div>
                      <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl gap-1">
                        <button
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${activeMethod === 'cash' ? 'font-bold bg-surface-container-lowest text-primary shadow-sm' : 'font-semibold text-outline hover:text-on-surface'}`}
                          onClick={() => setActiveMethod('cash')}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                          <span>Tunai / Cash</span>
                        </button>
                        <button
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${activeMethod === 'qris' ? 'font-bold bg-surface-container-lowest text-primary shadow-sm' : 'font-semibold text-outline hover:text-on-surface'}`}
                          onClick={() => setActiveMethod('qris')}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                          <span>QRIS</span>
                        </button>
                      </div>

                      {/* Cash Panel */}
                      {activeMethod === 'cash' && (
                        <div className="flex flex-col gap-space-md">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-label-md text-label-md text-outline" htmlFor="inputCashAmount">Uang Tunai Diterima (Rp)</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 font-label-lg text-label-lg text-outline">Rp</span>
                              <input
                                className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-headline-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                id="inputCashAmount"
                                min="0"
                                step="500"
                                type="number"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors cursor-pointer" onClick={() => setCashAmount(totalBill)} type="button">
                              Rp {totalBill.toLocaleString('id-ID')} (Pas)
                            </button>
                            <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors cursor-pointer" onClick={() => setCashAmount(50000)} type="button">Rp 50.000</button>
                            <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors cursor-pointer" onClick={() => setCashAmount(100000)} type="button">Rp 100.000</button>
                          </div>
                          <div className="bg-secondary-fixed/30 p-space-md rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary text-[22px]">price_check</span>
                              <div className="flex flex-col">
                                <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant uppercase tracking-wider font-bold">Kembalian Pelanggan</span>
                                <span className={`font-body-sm text-body-sm ${change < 0 ? 'text-error font-medium' : 'text-secondary'}`}>
                                  {change < 0 ? 'Uang tunai kurang!' : change === 0 ? 'Uang pas diterima' : 'Kembalian diserahkan ke pelanggan'}
                                </span>
                              </div>
                            </div>
                            <span className={`font-headline-md text-headline-md font-extrabold tracking-tight ${change < 0 ? 'text-error' : 'text-secondary'}`}>
                              {change < 0 ? `- Rp ${Math.abs(change).toLocaleString('id-ID')}` : `Rp ${change.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* QRIS Panel */}
                      {activeMethod === 'qris' && (
                        <div className="flex flex-col gap-space-md">
                          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col items-center text-center gap-space-sm">
                            <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm w-44 h-44 flex items-center justify-center">
                              <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                                <path d="M5 5h30v30H5V5zm6 6v18h18V11H11zm3 3h12v12H14V14zM65 5h30v30H65V5zm6 6v18h18V11H71zm3 3h12v12H74V14zM5 65h30v30H5V65zm6 6v18h18V71H11zm3 3h12v12H14V74zM45 5h10v10H45V5zm0 20h10v10H45V25zm0 20h10v10H45V45zm20 20h10v10H65V65zm20 0h10v10H85V65zm-20 20h10v10H65V85zm20 0h10v10H85V85zM5 45h10v10H5V45zm20 0h10v10H25V45zm20 20h10v10H45V65zm0 20h10v10H45V85zm20-40h10v10H65V45zm20 0h10v10H85V45z" />
                              </svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-on-surface font-bold">QRIS Standar Outlet LaundryKu</span>
                              <span className="font-body-sm text-body-sm text-outline">NMID: ID1020304050607</span>
                            </div>
                            <div className="w-full bg-primary-fixed/30 p-2.5 rounded-lg flex items-center justify-center gap-2 text-primary font-body-sm text-body-sm">
                              <span className="material-symbols-outlined text-[16px]">info</span>
                              <span>Kasir wajib memeriksa mutasi rekening sebelum konfirmasi.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Confirm Button */}
                      <button
                        className={`w-full py-3.5 px-space-md rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => handleKonfirmasiBayar(activeMethod === 'cash' ? 'TUNAI' : 'QRIS')}
                        disabled={submitting || (activeMethod === 'cash' && change < 0)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">task_alt</span>
                        <span>{submitting ? 'Memproses...' : 'Tandai Lunas & Selesaikan Pembayaran'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-secondary-container/40 rounded-xl flex items-center justify-center gap-2 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[24px]">check_circle</span>
                      <span>Pembayaran Order Telah Selesai (Lunas)</span>
                    </div>
                  )}
                </article>

                {/* Outlet Info */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[20px]">store</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-bold">Outlet Utama</span>
                      <span className="font-body-sm text-body-sm text-outline">Kasir: {user?.name ?? 'Kasir'}</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-1 rounded-sm font-semibold">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-sm shadow-[0_-1px_4px_rgba(0,0,0,0.02)]">
        <div className="w-full px-margin py-3 flex items-center justify-between text-outline font-body-sm text-body-sm">
          <span>LaundryKu POS</span>
          <span>v2.4.0</span>
        </div>
      </footer>
    </>
  );
}
