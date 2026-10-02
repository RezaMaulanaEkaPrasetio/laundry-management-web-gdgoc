'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DemoUser {
  role: string;
  label: string;
  email: string;
  pass: string;
}

const DEMO_ACCOUNTS: DemoUser[] = [
  { role: 'ADMIN', label: 'Admin', email: 'admin@laundryku.com', pass: 'Admin123!' },
  { role: 'KASIR', label: 'Kasir', email: 'kasir@laundryku.com', pass: 'Kasir123!' },
  { role: 'PETUGAS_CUCI', label: 'Petugas Cuci', email: 'petugas@laundryku.com', pass: 'Petugas123!' },
  { role: 'KURIR', label: 'Kurir', email: 'kurir@laundryku.com', pass: 'Kurir123!' },
  { role: 'PENGGUNA', label: 'Pelanggan', email: 'pelanggan@laundryku.com', pass: 'Pelanggan123!' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string>('ADMIN');
  const [email, setEmail] = useState('admin@laundryku.com');
  const [password, setPassword] = useState('Admin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectDemo = (demo: DemoUser) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.pass);
    setError(null);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setToastMessage(`Login berhasil! Mengalihkan ke ${data.redirect}...`);
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 800);
      } else {
        setError(data.error || 'Login gagal, periksa email dan password Anda');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('Gagal menghubungi server. Periksa koneksi database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] font-sans antialiased text-[#172B4D]">
      {/* ─── Toast Notification ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-l-4 border-[#34A853] text-[#172B4D] px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined text-[#34A853] text-[22px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ═══ KIRI: Brand Visual Banner (Desktop 50%, Mobile Compact Header) ═══ */}
      <section className="lg:w-1/2 relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white min-h-[380px] lg:min-h-screen" style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}>
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/15 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm border border-white/30">
              <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LaundryKu</span>
          </div>
          <Link
            href="/lacak"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-sm transition-all text-white"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>Lacak Order</span>
          </Link>
        </div>

        {/* Center: Interactive 2D Illustration Greeter Character */}
        <div className="relative z-10 flex flex-col items-center my-auto py-6">
          <div className="relative w-48 sm:w-56 lg:w-64 drop-shadow-xl">
            <svg
              viewBox="0 0 240 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto overflow-visible"
            >
              {/* Soft ground shadow */}
              <ellipse cx="120" cy="272" rx="65" ry="8" fill="#000000" fillOpacity="0.15" />

              {/* Legs */}
              <rect x="100" y="210" width="16" height="58" rx="8" fill="#172B4D" />
              <rect x="124" y="210" width="16" height="58" rx="8" fill="#172B4D" />
              {/* Shoes */}
              <path d="M96 264C96 261 101 260 108 260C116 260 120 262 120 266C120 269 116 270 108 270H100C97.8 270 96 267.3 96 264Z" fill="#FFFFFF" />
              <path d="M120 264C120 261 125 260 132 260C140 260 144 262 144 266C144 269 140 270 132 270H124C121.8 270 120 267.3 120 264Z" fill="#FFFFFF" />

              {/* Body & Clothes */}
              {/* Shirt */}
              <path d="M85 140C85 125 95 118 120 118C145 118 155 125 155 140V210H85V140Z" fill="#FFFFFF" />
              {/* Apron (Navy with brand cyan pocket) */}
              <path d="M92 135C92 130 98 128 120 128C142 128 148 130 148 135V205C148 209 144 212 140 212H100C95.6 212 92 209 92 205V135Z" fill="#172B4D" />
              {/* Apron straps */}
              <path d="M102 108L106 128H98L96 108H102Z" fill="#172B4D" />
              <path d="M138 108L134 128H142L144 108H138Z" fill="#172B4D" />
              {/* Apron pocket */}
              <rect x="104" y="160" width="32" height="24" rx="4" fill="#22C7D9" />
              {/* Pocket laundry wave emblem */}
              <path d="M112 172C114 170 116 170 118 172C120 174 122 174 124 172C126 170 128 170 128 172" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

              {/* Left Arm holding laundry basket */}
              <path d="M85 130C75 138 68 155 70 175C71 185 78 190 86 185L92 170" fill="none" stroke="#FDE2CD" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
              {/* Laundry basket */}
              <g transform="translate(48, 168)">
                <path d="M6 10L14 34C14.5 36 16.5 38 19 38H45C47.5 38 49.5 36 50 34L58 10C58.5 7.5 56.5 6 54 6H10C7.5 6 5.5 7.5 6 10Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
                {/* Clean fresh clothes in basket */}
                <ellipse cx="32" cy="8" rx="20" ry="8" fill="#22C7D9" />
                <ellipse cx="28" cy="6" rx="14" ry="6" fill="#1677FF" />
                <ellipse cx="36" cy="4" rx="10" ry="5" fill="#FFFFFF" />
              </g>

              {/* Head & Neck */}
              <rect x="113" y="98" width="14" height="18" rx="4" fill="#FDE2CD" />
              {/* Head / Face */}
              <ellipse cx="120" cy="82" rx="26" ry="28" fill="#FDE2CD" />
              {/* Hair Back */}
              <path d="M92 78C90 102 96 116 102 120C104 114 105 106 105 98C105 85 98 75 92 78Z" fill="#172B4D" />
              <path d="M148 78C150 102 144 116 138 120C136 114 135 106 135 98C135 85 142 75 148 78Z" fill="#172B4D" />
              {/* Hair Top & Bangs (Modern clean tied bun) */}
              <path d="M94 76C94 56 106 48 120 48C134 48 146 56 146 76C140 68 132 64 120 64C108 64 100 68 94 76Z" fill="#172B4D" />
              <circle cx="120" cy="42" r="14" fill="#172B4D" />
              <ellipse cx="120" cy="42" rx="12" ry="7" fill="#22C7D9" />

              {/* Friendly Face details */}
              {/* Cheeks */}
              <ellipse cx="106" cy="88" rx="4" ry="2.5" fill="#FF8A8A" fillOpacity="0.45" />
              <ellipse cx="134" cy="88" rx="4" ry="2.5" fill="#FF8A8A" fillOpacity="0.45" />
              {/* Eyes */}
              <circle cx="111" cy="80" r="2.8" fill="#172B4D" />
              <circle cx="129" cy="80" r="2.8" fill="#172B4D" />
              <circle cx="112" cy="79" r="0.9" fill="#FFFFFF" />
              <circle cx="130" cy="79" r="0.9" fill="#FFFFFF" />
              {/* Eyebrows */}
              <path d="M107 74C109 73 113 73 115 74" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M125 74C127 73 131 73 133 74" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" />
              {/* Gentle Warm Smile */}
              <path d="M115 90C117 93 123 93 125 90" stroke="#172B4D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

              {/* Right Arm: Waving greeting gesture */}
              <g className="animate-wave-hand origin-[150px_130px]">
                <path d="M152 130C165 125 178 110 182 95C184 88 180 82 174 86L164 105" fill="none" stroke="#FDE2CD" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                {/* Hand waving */}
                <ellipse cx="182" cy="88" rx="7" ry="9" fill="#FDE2CD" transform="rotate(20 182 88)" />
                {/* Sparkle greeting star */}
                <path d="M198 74L200 68L202 74L208 76L202 78L200 84L198 78L192 76L198 74Z" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </div>

        {/* Bottom Headline & Subtitle */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-bold text-white leading-tight mb-2 tracking-tight">
            Laundry beres, operasional terkendali.
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
            Satu platform untuk mengelola pesanan dan operasional laundry.
          </p>
        </div>
      </section>

      {/* ═══ KANAN: Form Login Card ═══ */}
      <section className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(23,43,77,0.06)] border border-[#F0F0F0] p-6 sm:p-8">
          {/* Header Greeting */}
          <div className="mb-6">
            <h2 className="text-[20px] font-semibold text-[#172B4D] mb-1">
              Selamat datang kembali 👋
            </h2>
            <p className="text-[14px] text-[#6B7280]">
              Masuk untuk melanjutkan ke LaundryKu.
            </p>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">
                Pilih Akun Demo
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Siap Uji
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              {DEMO_ACCOUNTS.map((item) => {
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSelectDemo(item)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#1677FF] shadow-sm border border-[#E5E7EB]'
                        : 'text-[#6B7280] hover:text-[#172B4D] hover:bg-white/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] flex items-center gap-2.5 text-xs font-medium">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {/* Field Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#172B4D]" htmlFor="emailInput">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#6B7280] text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="emailInput"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-lg bg-white text-[#172B4D] text-sm border border-[#E5E7EB] transition-all focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15"
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#172B4D]" htmlFor="passwordInput">
                  Password
                </label>
                <span className="text-xs text-[#6B7280]">Min. 6 karakter</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#6B7280] text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 rounded-lg bg-white text-[#172B4D] text-sm border border-[#E5E7EB] transition-all focus:outline-none focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#6B7280] hover:text-[#172B4D] p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Ingat Saya */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#1677FF] focus:ring-[#1677FF]"
                />
                <span className="text-xs text-[#6B7280]">Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Tombol Submit Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1677FF 0%, #22C7D9 100%)' }}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Card: Link Lacak Pesanan Tanpa Login */}
          <div className="mt-6 pt-5 border-t border-[#F0F0F0] text-center">
            <p className="text-xs text-[#6B7280] mb-2">
              Ingin mengecek status cucian Anda tanpa login?
            </p>
            <Link
              href="/lacak"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1677FF] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>Lacak Order Mandiri</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
