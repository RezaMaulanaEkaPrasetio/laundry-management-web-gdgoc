'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function CetakStrukPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { user: currentUser } = useCurrentUser();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>('58mm');
  const [showBarcode, setShowBarcode] = useState(true);
  const [showTerms, setShowTerms] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          setError('Data order tidak ditemukan');
          return;
        }
        const data = await res.json();
        setOrder(data);
      } catch {
        setError('Gagal memuat data order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[#1677FF]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-semibold text-[#172B4D]">Memuat struk pesanan...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm text-center max-w-sm">
          <svg className="w-12 h-12 text-[#EA4335] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-bold text-[#172B4D] mb-1">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#6B7280] mb-4">{error || 'ID order tidak valid'}</p>
          <Link
            href="/kasir"
            className="px-4 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const serviceLabel = order.serviceType === 'CKG' ? 'Cuci Kering Setrika' : 'Cuci Kering Lipat';
  const speedLabel = order.serviceSpeed === 'KILAT' ? 'Kilat (6-12 Jam)' : order.serviceSpeed === 'EXPRESS' ? 'Express (24 Jam)' : 'Reguler (2-3 Hari)';
  const weight = Number(order.weightKg ?? 0);
  const pricePerKg = Number(order.pricePerKg ?? 0);
  const totalAmount = Number(order.totalAmount ?? 0);
  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans">
      {/* Top Header Toolbar (Hidden saat cetak) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/kasir/order/${orderId}`} className="flex items-center gap-1.5 text-xs font-bold text-[#172B4D] hover:text-[#1677FF] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Detail</span>
            </Link>
            <span className="text-[#E2E8F0]">|</span>
            <span className="text-xs font-extrabold text-[#1677FF]">{order.orderCode}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch Ukuran Kertas */}
            <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setPaperSize('58mm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  paperSize === '58mm'
                    ? 'bg-white text-[#1677FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#172B4D]'
                }`}
              >
                58 mm (Standard)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('80mm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  paperSize === '80mm'
                    ? 'bg-white text-[#1677FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#172B4D]'
                }`}
              >
                80 mm (Lebar)
              </button>
            </div>

            {/* Tombol Print */}
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white hover:opacity-95 text-xs font-bold shadow-md shadow-[#1677FF]/20 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak Struk Sekarang</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Preview Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
        {/* Thermal Receipt Paper Card */}
        <div
          id="receipt-paper"
          className={`${
            paperSize === '58mm' ? 'w-[360px]' : 'w-[460px]'
          } max-w-full bg-white p-6 rounded-2xl shadow-xl border border-[#E5E7EB] font-mono text-[#172B4D] transition-all duration-200 print:shadow-none print:border-none print:p-0 print:w-full`}
        >
          {/* Header Toko */}
          <div className="text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#22C7D9] text-white flex items-center justify-center mb-1.5 shadow-sm print:hidden">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
              </svg>
            </div>
            <h2 className="font-extrabold tracking-widest text-lg uppercase leading-tight font-sans text-[#172B4D]">
              LAUNDRYKU
            </h2>
            <p className="font-sans text-[11px] text-[#6B7280] font-medium uppercase tracking-wider">
              Layanan Binatu Bersih & Higienis
            </p>
            <div className="mt-1 font-sans text-[11px] text-[#172B4D] font-bold">
              Outlet Utama
            </div>
            <p className="font-sans text-[10px] text-[#6B7280] leading-tight max-w-[260px] mt-0.5">
              Jl. Surya Kencana No. 42, Central Hub
            </p>
            <p className="font-sans text-[10px] text-[#6B7280] font-medium mt-0.5">
              WhatsApp CS: 0812-3456-7890
            </p>
          </div>

          <div className="my-3 border-b-2 border-dashed border-[#CBD5E1]" />

          {/* Metadata Order */}
          <div className="text-[11px] leading-relaxed space-y-1">
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-sans">No. Nota</span>
              <span className="font-bold text-[#172B4D]">{order.orderCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-sans">Waktu Masuk</span>
              <span>
                {new Date(order.createdAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-sans">Petugas Kasir</span>
              <span>{order.kasir?.name || currentUser?.name || 'Kasir Outlet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-sans">Pelanggan</span>
              <span className="font-bold text-right">{order.customerName}</span>
            </div>
            {order.customerPhone && (
              <div className="flex justify-between">
                <span className="text-[#6B7280] font-sans">No. Handphone</span>
                <span>{order.customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-sans">Alamat Antar</span>
              <span className="text-right text-[10px] max-w-[200px] truncate">{order.deliveryAddress || 'Ambil di Outlet'}</span>
            </div>
          </div>

          <div className="my-3 border-b-2 border-dashed border-[#CBD5E1]" />

          {/* Rincian Cucian */}
          <div className="text-[11px]">
            <div className="flex justify-between font-sans text-[10px] font-extrabold uppercase text-[#6B7280] pb-1">
              <span>Layanan</span>
              <span>Subtotal</span>
            </div>
            <div className="py-1">
              <div className="font-bold text-[12px] text-[#172B4D]">{serviceLabel}</div>
              <div className="text-[10px] text-[#6B7280] font-sans italic">{speedLabel}</div>
              <div className="flex justify-between mt-1 items-baseline">
                <span className="font-sans font-medium text-[#475569]">
                  {weight > 0 ? `${weight.toFixed(1)} kg × Rp ${pricePerKg.toLocaleString('id-ID')}` : 'Proses timbang'}
                </span>
                <span className="font-bold text-[12px]">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="my-3 border-b-2 border-dashed border-[#CBD5E1]" />

          {/* Ringkasan Pembayaran */}
          <div className="text-[11px] space-y-1">
            <div className="flex justify-between font-sans">
              <span className="text-[#6B7280]">Total Biaya</span>
              <span className="font-bold">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-[13px] pt-1 border-t border-dashed border-[#E2E8F0]">
              <span>TOTAL TAGIHAN</span>
              <span className="text-[#1677FF]">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-sans pt-1">
              <span className="text-[#6B7280]">Metode Bayar</span>
              <span className="font-bold uppercase">{order.paymentMethod || 'TUNAI'}</span>
            </div>

            <div className="flex justify-center pt-2">
              <span
                className={`px-4 py-1 rounded-full font-sans font-bold text-xs tracking-wider ${
                  isPaid
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isPaid ? '[ LUNAS ]' : '[ BELUM LUNAS ]'}
              </span>
            </div>
          </div>

          {/* Barcode Pelacakan */}
          {showBarcode && (
            <div>
              <div className="my-3 border-b-2 border-dashed border-[#CBD5E1]" />
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-9 w-44 flex items-center justify-center gap-[2px] overflow-hidden my-1 bg-white">
                  {[2,1,3,1,2,4,1,2,3,1,4,2,1,3,2,1,3,1,4,2,1,3,2,1,3,4,1,2,1,3,2].map((w, i) => (
                    <div key={i} className="h-full bg-[#172B4D]" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <div className="font-bold text-[11px] tracking-widest mt-0.5">* {order.orderCode} *</div>
                <div className="text-[9px] font-sans text-[#6B7280] mt-1">Lacak status pesanan online di:</div>
                <div className="text-[9px] font-sans font-bold text-[#1677FF]">
                  laundryku.id/lacak?code={order.orderCode}
                </div>
              </div>
            </div>
          )}

          {/* Syarat & Ketentuan */}
          {showTerms && (
            <div>
              <div className="my-3 border-b-2 border-dashed border-[#CBD5E1]" />
              <div className="text-[9px] font-sans leading-tight text-[#6B7280] space-y-1">
                <div className="font-bold text-[#172B4D] uppercase text-center tracking-wider">
                  SYARAT &amp; KETENTUAN:
                </div>
                <ol className="list-decimal pl-3 space-y-0.5">
                  <li>Pengambilan cucian wajib membawa nota fisik atau tautan pelacak resmi.</li>
                  <li>Klaim keluhan maksimal 1x24 jam sejak pakaian diserahterimakan.</li>
                  <li>Pakaian yang tidak diambil lebih dari 30 hari di luar tanggung jawab laundry.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Footer Struk */}
          <div className="my-3 border-b-2 border-dashed border-[#CBD5E1]" />
          <div className="text-center font-sans text-[10px] space-y-0.5">
            <p className="font-bold text-[#172B4D]">Terima kasih atas kunjungan Anda!</p>
            <p className="text-[#6B7280] text-[9px]">Simpan struk ini sebagai bukti transaksi resmi.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
