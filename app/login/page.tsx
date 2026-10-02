'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DemoUser {
  role: string;
  label: string;
  email: string;
  redirectUrl: string;
}

const DEMO_ACCOUNTS: DemoUser[] = [
  { role: 'Admin', label: 'Admin', email: 'admin@laundryku.com', redirectUrl: '/admin' },
  { role: 'Kasir', label: 'Kasir', email: 'kasir@laundryku.com', redirectUrl: '/kasir' },
  { role: 'Petugas Cuci', label: 'Petugas Cuci', email: 'petugas@laundryku.com', redirectUrl: '/petugas' },
  { role: 'Kurir', label: 'Kurir', email: 'kurir@laundryku.com', redirectUrl: '/kurir' },
  { role: 'Pelanggan', label: 'Pelanggan', email: 'pelanggan@laundryku.com', redirectUrl: '/lacak' },
];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<string>('Admin');
  const [email, setEmail] = useState('admin@laundryku.com');
  const [password, setPassword] = useState('rahasia123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectRole = (demo: DemoUser) => {
    setActiveRole(demo.role);
    setEmail(demo.email);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const current = DEMO_ACCOUNTS.find((d) => d.role === activeRole) || DEMO_ACCOUNTS[0];

    setToastMessage(`Login berhasil! Mengalihkan ke Dashboard ${current.role}...`);
    setTimeout(() => {
      window.location.href = current.redirectUrl;
    }, 1500);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_laundry_service
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">LaundryKu</span>
          </div>
          <nav className="flex items-center gap-space-md" data-active-classes="bg-primary-container text-on-primary-container font-label-md text-label-md px-space-md py-space-sm rounded-lg">
            <Link
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-sm px-space-sm rounded-lg"
              data-path="lacak-order"
              href="/lacak"
            >
              Lacak Order Tanpa Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center py-space-xl px-margin bg-surface">
        <div className="flex flex-col w-full items-center justify-center relative">
          <div className="absolute w-[500px] h-[500px] bg-primary-fixed/25 rounded-full blur-3xl pointer-events-none -top-24 -left-20"></div>
          <div className="absolute w-[420px] h-[420px] bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

          <div className="w-full max-w-md relative z-10">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-space-lg sm:p-space-xl flex flex-col">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-space-md shadow-sm">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_laundry_service
                  </span>
                </div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mb-space-xs">
                  Masuk ke LaundryKu
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                  Satu portal terpadu untuk semua peran operasional dan pelanggan
                </p>
              </div>

              {/* Demo Account Selector */}
              <div className="mt-space-lg">
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Cepat Pilih Akun Demo
                  </span>
                  <span className="inline-flex items-center text-secondary font-label-sm text-label-sm gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Siap Uji
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-space-xs bg-surface-container-low rounded-lg" id="roleSelector">
                  {DEMO_ACCOUNTS.map((demo) => {
                    const isSelected = activeRole === demo.role;
                    return (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => handleSelectRole(demo)}
                        className={`role-pill flex-1 min-w-[60px] py-1 px-2 rounded-md font-label-sm text-label-sm text-center transition-all ${
                          isSelected
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {demo.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form className="mt-space-md flex flex-col gap-space-md" id="loginForm" onSubmit={handleLogin}>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-md text-body-md text-outline font-medium" htmlFor="emailInput">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                      mail
                    </span>
                    <input
                      id="emailInput"
                      className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-shadow shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] focus:shadow-[inset_0_0_0_2px_#1a73e8]"
                      placeholder="nama@email.com atau admin@laundryku.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-md text-body-md text-outline font-medium" htmlFor="passwordInput">
                    Kata Sandi
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                      lock
                    </span>
                    <input
                      id="passwordInput"
                      className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-shadow shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] focus:shadow-[inset_0_0_0_2px_#1a73e8]"
                      placeholder="••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      aria-label="Tampilkan atau sembunyikan kata sandi"
                      className="absolute right-3 text-outline hover:text-on-surface transition-colors flex items-center justify-center p-1 cursor-pointer"
                      id="togglePassword"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]" id="passwordIcon">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-container focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary-container"
                      id="rememberMe"
                      type="checkbox"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">Ingat Saya</span>
                  </label>
                  <a
                    className="font-label-md text-label-md text-primary-container hover:text-primary transition-colors"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Silakan hubungi administrator untuk pemulihan kata sandi.');
                    }}
                  >
                    Lupa kata sandi?
                  </a>
                </div>

                <button
                  className="w-full h-11 mt-1 bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                  id="submitButton"
                  type="submit"
                >
                  <span>Masuk Sekarang</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>

              {/* Informational badge */}
              <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-container text-[18px] shrink-0 mt-0.5">
                  auto_mode
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Sistem akan secara otomatis mengarahkan Anda ke Dashboard sesuai peran akun (
                  <span className="font-medium text-on-surface">Admin, Kasir, Petugas Cuci, Kurir,</span> atau{' '}
                  <span className="font-medium text-on-surface">Pelanggan</span>).
                </p>
              </div>

              {/* Footer navigation */}
              <div className="mt-space-lg pt-space-md flex flex-col items-center gap-space-sm text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Belum punya akun pelanggan?
                  <Link className="font-label-lg text-label-lg text-primary-container hover:underline ml-1" href="/register">
                    Daftar Akun Baru
                  </Link>
                </p>
                <Link
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-primary-container transition-colors py-1 px-2 rounded-md hover:bg-surface-container-low"
                  data-path="lacak-order"
                  href="/lacak"
                >
                  <span>Ingin cek status cucian tanpa login? Lacak Pesanan</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                </Link>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-space-md grid grid-cols-3 gap-space-xs text-center text-on-surface-variant">
              <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-lowest/60 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="font-label-md text-label-md font-bold text-on-surface">3 Detik</span>
                <span className="font-label-sm text-label-sm">Respons POS</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-lowest/60 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="font-label-md text-label-md font-bold text-on-surface">QRIS &amp; Tunai</span>
                <span className="font-label-sm text-label-sm">Otomatisasi</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-lowest/60 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="font-label-md text-label-md font-bold text-on-surface">Aman &amp; Terenkripsi</span>
                <span className="font-label-sm text-label-sm">Akses Multi-Role</span>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          <div
            className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
              toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
            }`}
            id="toastNotification"
          >
            <div className="bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
              <span className="font-label-md text-label-md" id="toastMessage">
                {toastMessage}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-lg">
        <div className="max-w-7xl mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 LaundryKu. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-space-md">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="bantuan" href="#">
              Pusat Bantuan
            </a>
            <span className="text-outline-variant">•</span>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="kontak" href="#">
              Hubungi Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
