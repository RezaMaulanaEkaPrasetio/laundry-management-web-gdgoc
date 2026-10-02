'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AccordionSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function SyaratKetentuanPage() {
  const [openSection, setOpenSection] = useState<string | null>('penjemputan');

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const sections: AccordionSection[] = [
    {
      id: 'penjemputan',
      title: '1. Ketentuan Penjemputan',
      content: (
        <div className="flex flex-col gap-2.5 text-on-surface-variant font-body-md text-[15px] leading-relaxed pt-2 pb-4">
          <p>
            • Kurir LaundryKu akan datang ke lokasi penjemputan sesuai dengan slot jadwal yang telah Anda pilih pada saat
            pemesanan.
          </p>
          <p>
            • Pelanggan diharapkan telah menyiapkan pakaian kotor yang akan dicuci dalam kantong atau tas khusus sebelum kurir
            tiba di lokasi.
          </p>
          <p>
            • Apabila pelanggan berhalangan atau tidak berada di tempat saat kurir tiba, pelanggan dapat melakukan{' '}
            <em>reschedule</em> (penjadwalan ulang) maksimal 1 jam sebelum waktu penjemputan atau menitipkan pakaian kepada
            pihak yang dipercaya (satpam/resepsionis/keluarga).
          </p>
        </div>
      ),
    },
    {
      id: 'tanggung-jawab',
      title: '2. Tanggung Jawab Barang',
      content: (
        <div className="flex flex-col gap-2.5 text-on-surface-variant font-body-md text-[15px] leading-relaxed pt-2 pb-4">
          <p>
            • Pelanggan wajib memeriksa dan mengosongkan seluruh saku pakaian dari uang tunai, perhiasan, pulpen, tisu, atau
            benda berharga lainnya sebelum menyerahkannya kepada kurir atau petugas.
          </p>
          <p>
            • Pelanggan wajib memberitahukan kepada petugas apabila terdapat pakaian dengan instruksi perawatan khusus, bahan
            sensitif (seperti sutra, wol, rajut halus), atau pakaian yang berpotensi luntur.
          </p>
          <p>
            • LaundryKu tidak bertanggung jawab atas kerusakan pakaian yang diakibatkan oleh benda yang tertinggal di dalam
            saku pakaian pelanggan atau kelunturan pakaian yang tidak diinformasikan sebelumnya.
          </p>
        </div>
      ),
    },
    {
      id: 'klaim-komplain',
      title: '3. Ketentuan Klaim & Komplain',
      content: (
        <div className="flex flex-col gap-2.5 text-on-surface-variant font-body-md text-[15px] leading-relaxed pt-2 pb-4">
          <p>
            • Segala bentuk komplain atas cucian (kurang bersih, pakaian tertukar, atau cacat/rusak fisik) wajib diajukan
            maksimal dalam kurun waktu <strong>24 jam</strong> setelah cucian diterima oleh pelanggan.
          </p>
          <p>
            • Pengajuan klaim wajib menyertakan bukti nomor nota/order resmi LaundryKu serta dokumentasi foto dan video kondisi
            pakaian saat segel dibuka.
          </p>
          <p>
            • Penggantian kerugian atau kompensasi maksimal yang dapat disetujui adalah senilai{' '}
            <strong>5× (lima kali) biaya cuci</strong> pakaian yang bersangkutan sesuai dengan kebijakan perlindungan konsumen
            standar industri laundry.
          </p>
        </div>
      ),
    },
    {
      id: 'pembayaran',
      title: '4. Pembayaran',
      content: (
        <div className="flex flex-col gap-2.5 text-on-surface-variant font-body-md text-[15px] leading-relaxed pt-2 pb-4">
          <p>
            • Pembayaran pesanan laundry dapat dilakukan secara tunai di tempat (COD) saat penjemputan/pengantaran, maupun
            secara non-tunai melalui QRIS kasir resmi LaundryKu.
          </p>
          <p>
            • Seluruh transaksi wajib tercatat di dalam sistem aplikasi LaundryKu.
          </p>
          <p>
            • LaundryKu tidak menerima klaim, transaksi, atau pertanggungjawaban dalam bentuk apa pun yang dilakukan di luar
            sistem resmi atau tanpa bukti struk order terdaftar.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcf9f8' }}>
      <main className="max-w-[680px] mx-auto px-4 py-12 flex flex-col">
        {/* Header Block */}
        <div className="flex flex-col items-center text-center pb-8 border-b" style={{ borderColor: '#e5e2e1' }}>
          <Link href="/login" className="flex items-center gap-2 mb-4 hover:opacity-85 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              LaundryKu
            </span>
          </Link>

          <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
            Syarat &amp; Ketentuan Layanan
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Berlaku sejak Januari 2025
          </p>
        </div>

        {/* Accordion Content Block */}
        <div className="flex flex-col">
          {sections.map((sec) => {
            const isOpen = openSection === sec.id;
            return (
              <div
                key={sec.id}
                className="py-4 border-b transition-colors"
                style={{ borderColor: '#e5e2e1' }}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between text-left py-2 font-label-lg text-label-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="text-[17px]">{sec.title}</span>
                  <span
                    className="material-symbols-outlined text-[24px] transition-transform duration-200"
                    style={{ color: '#1a73e8' }}
                  >
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isOpen && <div className="mt-1">{sec.content}</div>}
              </div>
            );
          })}
        </div>

        {/* Simple Footer Links */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-on-surface-variant font-body-sm text-body-sm">
          <span>© 2025 LaundryKu. Hak cipta dilindungi.</span>
          <div className="flex items-center gap-4">
            <Link href="/lacak" className="hover:text-primary transition-colors">
              Lacak Pesanan
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-primary transition-colors font-medium text-primary">
              Masuk ke Aplikasi
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
