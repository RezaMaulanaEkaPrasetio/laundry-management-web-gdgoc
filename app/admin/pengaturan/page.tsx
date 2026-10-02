'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '../_components/AdminNav';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface ServicePrice {
  id?: string;
  serviceType: string;
  serviceSpeed: string;
  pricePerKg: number;
}

export default function PengaturanOutletTarifPage() {
  const { user: currentUser } = useCurrentUser();
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [priceInput, setPriceInput] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delivery & Outlet Settings
  const [deliveryTarifFlat, setDeliveryTarifFlat] = useState(10000);
  const [deliveryFreeMin, setDeliveryFreeMin] = useState(50000);
  const [csPhone, setCsPhone] = useState('0812-9844-1290');
  const [openHour, setOpenHour] = useState('07:30');
  const [closeHour, setCloseHour] = useState('21:00');
  const [qrisActive, setQrisActive] = useState(true);
  const [cashActive, setCashActive] = useState(true);

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/config/prices');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPrices(data);
        const map: Record<string, number> = {};
        data.forEach((p: any) => {
          map[`${p.serviceType}_${p.serviceSpeed}`] = p.pricePerKg;
        });
        setPriceInput(map);
      }
    } catch (err) {
      console.error('Gagal mengambil data tarif', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handlePriceChange = (type: string, speed: string, val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10);
    const key = `${type}_${speed}`;
    setPriceInput((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  const handleSimpanHargaSatuan = async (serviceType: string, serviceSpeed: string) => {
    const key = `${serviceType}_${serviceSpeed}`;
    const price = priceInput[key] ?? 0;
    try {
      const res = await fetch('/api/config/prices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          serviceSpeed,
          pricePerKg: price,
          updatedById: currentUser?.id,
        }),
      });
      if (res.ok) {
        setToastMessage(`Tarif ${serviceType} ${serviceSpeed} berhasil disimpan!`);
        setTimeout(() => setToastMessage(null), 3000);
        fetchPrices();
      } else {
        alert('Gagal menyimpan harga');
      }
    } catch {
      alert('Gagal menghubungi server');
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const speedList = ['REGULER', 'EXPRESS', 'KILAT'];
      const typeList = ['CKG', 'CKL'];

      for (const type of typeList) {
        for (const speed of speedList) {
          const key = `${type}_${speed}`;
          const newPrice = priceInput[key];
          if (newPrice !== undefined) {
            await fetch('/api/config/prices', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                serviceType: type,
                serviceSpeed: speed,
                pricePerKg: newPrice,
                updatedById: currentUser?.id,
              }),
            });
          }
        }
      }
      setToastMessage('Semua tarif & pengaturan harga berhasil disimpan!');
      setTimeout(() => setToastMessage(null), 3500);
      fetchPrices();
    } catch {
      alert('Gagal menyimpan perubahan');
    } finally {
      setIsSaving(false);
    }
  };

  const getSpeedDetails = (speed: string) => {
    switch (speed) {
      case 'REGULER':
        return {
          label: 'Reguler',
          duration: '2-3 Hari (48 Jam)',
          desc: 'Pilihan hemat untuk pakaian santai harian',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'EXPRESS':
        return {
          label: 'Express',
          duration: '24 Jam (1 Hari)',
          desc: 'Prioritas pengerjaan untuk kebutuhan esok hari',
          badgeClass: 'bg-blue-50 text-[#1677FF] border-blue-200',
        };
      case 'KILAT':
        return {
          label: 'Kilat Super',
          duration: '6-12 Jam',
          desc: 'Langsung diproses tanpa antre, selesai hari yang sama',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      default:
        return {
          label: speed,
          duration: '-',
          desc: '',
          badgeClass: 'bg-gray-100 text-gray-700',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans antialiased selection:bg-[#1677FF]/20 selection:text-[#1677FF]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40">
        <AdminNav />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header & Sticky/Top Save Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Sinkronisasi Master Database
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              Pengaturan Tarif Layanan
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Tarif yang disimpan otomatis terhubung ke perhitungan nota kasir dan estimasi berat timbangan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simpan Semua Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Grid: CKG (Kiri) & CKL (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* KOLOM KIRI: Cuci Kering Setrika (CKG) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              {/* Header Card */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center border border-blue-200 shadow-xs">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-extrabold text-[#172B4D]">
                        Cuci Kering Setrika (CKG)
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#1677FF]">
                        CKG
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      Cuci bersih + Pengering mesin + Setrika uap rapi
                    </span>
                  </div>
                </div>
              </div>

              {/* List Harga per Kecepatan: Reguler, Express, Kilat */}
              <div className="space-y-4">
                {['REGULER', 'EXPRESS', 'KILAT'].map((speed) => {
                  const details = getSpeedDetails(speed);
                  const key = `CKG_${speed}`;
                  const currentVal = priceInput[key] ?? 0;

                  return (
                    <div
                      key={speed}
                      className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#1677FF]/40 transition-colors"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#172B4D]">
                            {details.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${details.badgeClass}`}>
                            {details.duration}
                          </span>
                        </div>
                        <span className="text-xs text-[#6B7280] mt-0.5">{details.desc}</span>
                      </div>

                      {/* Input Harga: Prefix Rp, Suffix /kg */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-bold text-[#6B7280]">Rp</span>
                          <input
                            type="text"
                            value={currentVal.toLocaleString('id-ID')}
                            onChange={(e) => handlePriceChange('CKG', speed, e.target.value)}
                            className="w-32 h-10 pl-9 pr-10 text-right bg-white border border-[#E2E8F0] rounded-xl text-sm font-black text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                          />
                          <span className="absolute right-3 text-xs font-semibold text-[#6B7280]">/kg</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSimpanHargaSatuan('CKG', speed)}
                          className="px-3 py-2 bg-white border border-[#E5E7EB] hover:bg-blue-50 hover:text-[#1677FF] hover:border-blue-200 text-xs font-bold text-[#172B4D] rounded-xl transition-colors cursor-pointer"
                          title="Simpan tarif ini"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#6B7280]">
              <span>Rekomendasi CKG: Rp 8.000 - 18.000 /kg</span>
              <span className="text-[#1677FF] font-semibold">Standar Higienis Premium</span>
            </div>
          </div>

          {/* KOLOM KANAN: Cuci Kering Lipat (CKL) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              {/* Header Card */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 text-[#0E7490] flex items-center justify-center border border-cyan-200 shadow-xs">
                    <svg className="w-6 h-6 text-[#22C7D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-extrabold text-[#172B4D]">
                        Cuci Kering Lipat (CKL)
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-[#0E7490]">
                        CKL
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      Cuci higienis + Mesin pengering + Pelipatan rapi
                    </span>
                  </div>
                </div>
              </div>

              {/* List Harga per Kecepatan: Reguler, Express, Kilat */}
              <div className="space-y-4">
                {['REGULER', 'EXPRESS', 'KILAT'].map((speed) => {
                  const details = getSpeedDetails(speed);
                  const key = `CKL_${speed}`;
                  const currentVal = priceInput[key] ?? 0;

                  return (
                    <div
                      key={speed}
                      className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#22C7D9]/40 transition-colors"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#172B4D]">
                            {details.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${details.badgeClass}`}>
                            {details.duration}
                          </span>
                        </div>
                        <span className="text-xs text-[#6B7280] mt-0.5">{details.desc}</span>
                      </div>

                      {/* Input Harga: Prefix Rp, Suffix /kg */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-bold text-[#6B7280]">Rp</span>
                          <input
                            type="text"
                            value={currentVal.toLocaleString('id-ID')}
                            onChange={(e) => handlePriceChange('CKL', speed, e.target.value)}
                            className="w-32 h-10 pl-9 pr-10 text-right bg-white border border-[#E2E8F0] rounded-xl text-sm font-black text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#22C7D9]"
                          />
                          <span className="absolute right-3 text-xs font-semibold text-[#6B7280]">/kg</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSimpanHargaSatuan('CKL', speed)}
                          className="px-3 py-2 bg-white border border-[#E5E7EB] hover:bg-cyan-50 hover:text-[#0E7490] hover:border-cyan-200 text-xs font-bold text-[#172B4D] rounded-xl transition-colors cursor-pointer"
                          title="Simpan tarif ini"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#6B7280]">
              <span>Rekomendasi CKL: Rp 6.000 - 14.000 /kg</span>
              <span className="text-[#22C7D9] font-semibold">Paling Populer & Praktis</span>
            </div>
          </div>
        </div>

        {/* Card Layanan Tambahan & Kebijakan Outlet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Layanan Tambahan: Antar-Jemput */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB] mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#34A853] flex items-center justify-center border border-emerald-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#172B4D]">
                    Layanan Tambahan Antar-Jemput
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    Konfigurasi biaya operasional kurir jemput & kirim
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#172B4D]">Tarif Ongkir Standar Flat</span>
                    <span className="text-[11px] text-[#6B7280]">Dikenakan per penjemputan/pengantaran</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-[#6B7280]">Rp</span>
                    <input
                      type="number"
                      value={deliveryTarifFlat}
                      onChange={(e) => setDeliveryTarifFlat(Number(e.target.value) || 0)}
                      className="w-28 h-9 pl-9 pr-3 text-right bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#172B4D]">Bebas Ongkir Minimal Order</span>
                    <span className="text-[11px] text-[#6B7280]">Gratis ongkir jika tagihan mencapai</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-[#6B7280]">Rp</span>
                    <input
                      type="number"
                      value={deliveryFreeMin}
                      onChange={(e) => setDeliveryFreeMin(Number(e.target.value) || 0)}
                      className="w-28 h-9 pl-9 pr-3 text-right bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-xs text-[#6B7280]">
              Radius pengantaran maksimal: <strong className="text-[#172B4D]">5.0 km</strong> dari workshop pusat.
            </div>
          </div>

          {/* Jam Operasional & Metode Pembayaran */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB] mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#172B4D]">
                    Jam Operasional & Pembayaran
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    Pengaturan penerimaan cucian dan saluran kasir
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-[#6B7280]">Buka Kasir</span>
                    <input
                      type="time"
                      value={openHour}
                      onChange={(e) => setOpenHour(e.target.value)}
                      className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    />
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-[#6B7280]">Tutup Kasir</span>
                    <input
                      type="time"
                      value={closeHour}
                      onChange={(e) => setCloseHour(e.target.value)}
                      className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1677FF]"></span>
                    <span className="text-xs font-bold text-[#172B4D]">Pembayaran QRIS Statis & Dinamis</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQrisActive(!qrisActive)}
                    className={`w-11 h-6 rounded-full relative p-0.5 flex items-center cursor-pointer transition-colors ${
                      qrisActive ? 'bg-[#1677FF]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                        qrisActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
                    <span className="text-xs font-bold text-[#172B4D]">Pembayaran Tunai di Kasir / COD</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCashActive(!cashActive)}
                    className={`w-11 h-6 rounded-full relative p-0.5 flex items-center cursor-pointer transition-colors ${
                      cashActive ? 'bg-[#34A853]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                        cashActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#6B7280]">
              <span>WhatsApp CS: <strong className="text-[#172B4D]">{csPhone}</strong></span>
              <span className="text-emerald-600 font-semibold">Aktif 24/7</span>
            </div>
          </div>
        </div>

        {/* Sticky Floating Save Bar at Bottom for Mobile Convenience */}
        <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-4 rounded-2xl shadow-xl flex items-center justify-between max-w-xl mx-auto">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-[#172B4D]">Perubahan Tarif</span>
            <span className="text-[11px] text-[#6B7280]">Klik simpan untuk menerapkan ke sistem POS</span>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Sekarang'}
          </button>
        </div>

        {/* Floating Toast Feedback */}
        <div
          className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-[#172B4D] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 ${
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
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E5E7EB] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
          <span>© 2026 LaundryKu Operational Pricing Master.</span>
          <span>v2.0 • PRD Compliant</span>
        </div>
      </footer>
    </div>
  );
}
