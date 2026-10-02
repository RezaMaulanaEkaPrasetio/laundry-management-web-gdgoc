'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import KasirNav from '../../_components/KasirNav';

export default function InputOrderBaruPage() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();

  // Form States
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'dropoff' | 'pickup'>('dropoff');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [workType, setWorkType] = useState<'ckl' | 'ckg'>('ckl');
  const [speedLevel, setSpeedLevel] = useState<'reguler' | 'express' | 'kilat'>('reguler');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().slice(0, 10));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [specialNotes, setSpecialNotes] = useState('');

  // Checklist
  const [checkPockets, setCheckPockets] = useState(false);
  const [checkBagReturn, setCheckBagReturn] = useState(false);

  // Status & Feedback States
  const [prices, setPrices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Fetch live prices from API
  useEffect(() => {
    fetch('/api/config/prices')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPrices(data);
      })
      .catch((err) => console.error('Gagal mengambil harga:', err));
  }, []);

  // Compute estimate rate per kg from API config
  const currentServiceType = workType === 'ckg' ? 'CKG' : 'CKL';
  const currentSpeed = speedLevel === 'express' ? 'EXPRESS' : speedLevel === 'kilat' ? 'KILAT' : 'REGULER';
  const matchedPrice = prices.find(
    (p) => p.serviceType === currentServiceType && p.serviceSpeed === currentSpeed
  );

  const fallbackBase = workType === 'ckg' ? 10000 : 7000;
  const fallbackMult = speedLevel === 'express' ? 1.5 : speedLevel === 'kilat' ? 2.0 : 1.0;
  const pricePerKg = matchedPrice ? Number(matchedPrice.pricePerKg) : Math.round(fallbackBase * fallbackMult);

  const isFormValid =
    custName.trim().length >= 3 &&
    custPhone.replace(/\D/g, '').length >= 10 &&
    (pickupMethod === 'dropoff' || pickupAddress.trim().length >= 5) &&
    checkPockets &&
    checkBagReturn;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!custName.trim() || custName.trim().length < 3) {
      setValidationError('Nama lengkap pelanggan wajib diisi minimal 3 karakter.');
      return;
    }

    const cleanPhone = custPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('Nomor WhatsApp wajib diisi minimal 10 digit angka.');
      return;
    }

    if (pickupMethod === 'pickup' && (!pickupAddress || pickupAddress.trim().length < 5)) {
      setValidationError('Alamat penjemputan wajib diisi untuk penugasan kurir.');
      return;
    }

    if (!checkPockets || !checkBagReturn) {
      setValidationError('Harap beri tanda centang pada kedua butir checklist konfirmasi.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: custName.trim(),
          customerPhone: custPhone.trim(),
          pickupAddress: pickupMethod === 'pickup' ? pickupAddress.trim() : 'Drop-off di outlet',
          deliveryAddress: deliveryAddress.trim() || (pickupMethod === 'pickup' ? pickupAddress.trim() : 'Ambil di outlet'),
          serviceType: currentServiceType,
          serviceSpeed: currentSpeed,
          notes: specialNotes.trim() || null,
          pocketChecked: checkPockets,
          bagReturned: checkBagReturn,
          scheduledPickupAt: pickupMethod === 'pickup' ? `${pickupDate}T${pickupTime}:00` : null,
          kasirId: currentUser?.id,
        }),
      });

      if (!res.ok) throw new Error('Gagal membuat order baru');
      const order = await res.json();

      setCreatedOrderCode(order.orderCode);
      setCreatedOrderId(order.id);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Submit order error:', err);
      setValidationError('Terjadi kesalahan saat menyimpan pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setCustName('');
    setCustPhone('');
    setPickupMethod('dropoff');
    setPickupAddress('');
    setDeliveryAddress('');
    setWorkType('ckl');
    setSpeedLevel('reguler');
    setSpecialNotes('');
    setCheckPockets(false);
    setCheckBagReturn(false);
    setValidationError(null);
    setShowSuccessModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans antialiased text-[#172B4D] flex flex-col justify-between">
      {/* ─── Navbar Kasir Terpadu ─── */}
      <KasirNav />

      {/* ─── Main Form Container (Linear 1 Kolom Max 580px) ─── */}
      <main className="flex-1 max-w-[580px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4">
          <Link
            href="/kasir"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1677FF] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          {/* Judul Halaman */}
          <div className="mb-6 pb-4 border-b border-[#F0F0F0]">
            <h1 className="text-[22px] font-semibold text-[#172B4D] tracking-tight">
              Buat Order Baru
            </h1>
            <p className="text-[14px] text-[#6B7280] mt-0.5">
              Catat pesanan pelanggan untuk diproses oleh workshop.
            </p>
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] flex items-center gap-2.5 text-xs font-medium animate-fade-in-up">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* Form Linear */}
          <form className="flex flex-col gap-5" onSubmit={handleOrderSubmit}>
            {/* 1. Nama Pelanggan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="nameInput">
                Nama Pelanggan <span className="text-[#EA4335]">*</span>
              </label>
              <input
                id="nameInput"
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full h-11 px-3.5 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#172B4D] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
              />
            </div>

            {/* 2. Nomor HP / WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="phoneInput">
                Nomor WhatsApp <span className="text-[#EA4335]">*</span>
              </label>
              <input
                id="phoneInput"
                type="tel"
                required
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full h-11 px-3.5 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#172B4D] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
              />
            </div>

            {/* 3. Metode Penerimaan (Drop-off vs Pick-up) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]">
                Metode Penyerahan Cucian
              </label>
              <div className="grid grid-cols-2 p-1 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setPickupMethod('dropoff')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    pickupMethod === 'dropoff'
                      ? 'bg-white text-[#1677FF] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#172B4D]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  <span>Drop-off di Outlet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPickupMethod('pickup')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    pickupMethod === 'pickup'
                      ? 'bg-white text-[#1677FF] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#172B4D]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                  <span>Jemput oleh Kurir</span>
                </button>
              </div>
            </div>

            {/* 4. Alamat Penjemputan (Hanya jika pick-up) */}
            {pickupMethod === 'pickup' && (
              <div className="flex flex-col gap-1.5 animate-fade-in-up">
                <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="pickupAddressInput">
                  Alamat Penjemputan <span className="text-[#EA4335]">*</span>
                </label>
                <textarea
                  id="pickupAddressInput"
                  rows={2}
                  required={pickupMethod === 'pickup'}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
                  className="w-full p-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#172B4D] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
                />
              </div>
            )}

            {/* 5. Alamat Pengantaran (Opsional jika ingin diantar balik) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="deliveryAddressInput">
                Alamat Pengantaran <span className="text-[#6B7280] font-normal text-xs">(Opsional jika diantar balik)</span>
              </label>
              <input
                id="deliveryAddressInput"
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={pickupMethod === 'pickup' ? 'Sama dengan alamat jemput' : 'Ambil mandiri di outlet'}
                className="w-full h-11 px-3.5 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#172B4D] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
              />
            </div>

            {/* 6. Jenis Layanan (Segmented Control: CKL vs CKG) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]">
                Jenis Layanan
              </label>
              <div className="grid grid-cols-2 p-1 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setWorkType('ckl')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    workType === 'ckl'
                      ? 'bg-white text-[#1677FF] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#172B4D]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">dry_cleaning</span>
                  <span>Cuci Kering Lipat (CKL)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkType('ckg')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    workType === 'ckg'
                      ? 'bg-white text-[#1677FF] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#172B4D]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">iron</span>
                  <span>Cuci Kering Setrika (CKG)</span>
                </button>
              </div>
            </div>

            {/* 7. Kecepatan Layanan (Pill Chips: Reguler | Express | Kilat) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]">
                Kecepatan Layanan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'reguler', label: 'Reguler', durasi: '2-3 Hari' },
                  { key: 'express', label: 'Express', durasi: '24 Jam' },
                  { key: 'kilat', label: 'Kilat', durasi: '6 Jam' },
                ].map((sp) => {
                  const isSelected = speedLevel === sp.key;
                  return (
                    <button
                      key={sp.key}
                      type="button"
                      onClick={() => setSpeedLevel(sp.key as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1677FF] bg-[#EFF6FF] text-[#1677FF]'
                          : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#1677FF]/40 hover:text-[#172B4D]'
                      }`}
                    >
                      <div className="text-xs font-bold">{sp.label}</div>
                      <div className="text-[11px] opacity-75">{sp.durasi}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8. Jadwal Penjemputan (Jika pickup) */}
            {pickupMethod === 'pickup' && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="pickupDateInput">
                    Tanggal Jemput
                  </label>
                  <input
                    id="pickupDateInput"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#172B4D] focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="pickupTimeInput">
                    Waktu Jemput
                  </label>
                  <input
                    id="pickupTimeInput"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#172B4D] focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
                  />
                </div>
              </div>
            )}

            {/* 9. Catatan Khusus */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#172B4D]" htmlFor="notesInput">
                Catatan Khusus <span className="text-[#6B7280] font-normal text-xs">(Opsional)</span>
              </label>
              <textarea
                id="notesInput"
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Contoh: Baju putih dipisah, jangan pakai pemutih keras..."
                className="w-full p-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#172B4D] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 transition-all"
              />
            </div>

            {/* 10. Checklist Konfirmasi */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex flex-col gap-2.5 my-1">
              <span className="text-xs font-semibold text-[#172B4D]">
                Checklist Pemeriksaan Operasional:
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#172B4D] select-none">
                <input
                  type="checkbox"
                  checked={checkPockets}
                  onChange={(e) => setCheckPockets(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#1677FF] focus:ring-[#1677FF]"
                />
                <span>Pelanggan sudah memeriksa &amp; mengosongkan saku pakaian</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#172B4D] select-none">
                <input
                  type="checkbox"
                  checked={checkBagReturn}
                  onChange={(e) => setCheckBagReturn(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#1677FF] focus:ring-[#1677FF]"
                />
                <span>Tas laundry pembawa akan dikembalikan saat pengantaran</span>
              </label>
            </div>

            {/* 11. Preview Harga Dinamis */}
            <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1677FF] text-[20px]">payments</span>
                <span className="text-xs font-medium text-[#172B4D]">Estimasi Tarif Layanan</span>
              </div>
              <span className="text-sm font-bold text-[#1677FF]">
                Rp {pricePerKg.toLocaleString('id-ID')} / kg
              </span>
            </div>

            {/* 12. Tombol Submit "Buat Order" */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full h-12 rounded-lg text-white font-semibold text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Membuat order...</span>
                </>
              ) : (
                <>
                  <span>Buat Order</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* ─── Feedback Sukses Modal ─── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#F0F0F0] animate-fade-in-up flex flex-col items-center">
            {/* Animasi Checkmark SVG */}
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-4 border border-[#BBF7D0]">
              <svg className="w-8 h-8 text-[#16A34A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-[#172B4D] mb-1">
              Order Berhasil Dibuat!
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Nomor pesanan telah dicatat ke database outlet:
            </p>

            <div className="w-full py-2.5 px-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] font-mono text-base font-bold text-[#1677FF] mb-6 tracking-wide">
              {createdOrderCode}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <Link
                href={`/kasir/order/${createdOrderId}`}
                className="w-full py-2.5 rounded-lg text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
              >
                <span>Lihat Detail Order</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#172B4D] font-semibold text-xs transition-colors cursor-pointer"
              >
                Buat Order Lain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
