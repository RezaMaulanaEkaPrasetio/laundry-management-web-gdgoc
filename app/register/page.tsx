'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (val: string) => {
    if (!val || val.length === 0) {
      return { width: '0%', color: 'bg-outline', label: 'Minimal 8 karakter', textClass: 'text-outline' };
    }
    if (val.length < 8) {
      return { width: '35%', color: 'bg-error', label: 'Terlalu pendek (min. 8)', textClass: 'text-error' };
    }
    if (val.length >= 8 && (/[A-Z]/.test(val) || /[0-9]/.test(val))) {
      return { width: '100%', color: 'bg-secondary', label: 'Sandi kuat & aman', textClass: 'text-secondary' };
    }
    return { width: '70%', color: 'bg-tertiary-fixed-dim', label: 'Kombinasikan huruf & angka', textClass: 'text-tertiary' };
  };

  const strength = getPasswordStrength(password);

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Mohon periksa kembali.');
      return;
    }

    if (!termsAgree) {
      setErrorMessage('Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessToast(true);

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_laundry_service
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">LaundryKu</span>
          </Link>
          <nav className="flex items-center gap-space-md">
            <Link
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-sm px-space-sm rounded-lg"
              href="/lacak"
            >
              Lacak Order Tanpa Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center py-space-xl px-margin bg-surface">
        <div className="flex flex-col w-full items-center justify-center py-space-md relative">
          {/* Atmospheric Backlight Glow */}
          <div className="absolute w-[500px] h-[500px] bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10 translate-y-[-10%]"></div>

          {/* Registration Master Card */}
          <div className="w-full max-w-[560px] bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-space-lg sm:p-space-xl flex flex-col gap-space-lg transition-all duration-300">
            {/* Header Block */}
            <div className="flex flex-col items-center text-center gap-space-xs">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-space-xs text-primary shadow-sm">
                <span className="material-symbols-outlined text-headline-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_laundry_service
                </span>
              </div>
              <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">Daftar Akun Pelanggan</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[420px]">
                Nikmati kemudahan memantau cucian, histori order, dan transparansi tagihan laundry.
              </p>
            </div>

            {/* Micro Value Proposition Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs bg-surface-container-low p-space-sm rounded-lg text-center">
              <div className="flex items-center sm:flex-col justify-center gap-space-xs p-space-xs bg-surface-container-lowest sm:bg-transparent rounded sm:rounded-none shadow-sm sm:shadow-none">
                <span className="material-symbols-outlined text-secondary text-body-lg">check_circle</span>
                <span className="font-label-sm text-label-sm text-on-surface">Lacak Status Real-time</span>
              </div>
              <div className="flex items-center sm:flex-col justify-center gap-space-xs p-space-xs bg-surface-container-lowest sm:bg-transparent rounded sm:rounded-none shadow-sm sm:shadow-none">
                <span className="material-symbols-outlined text-secondary text-body-lg">receipt_long</span>
                <span className="font-label-sm text-label-sm text-on-surface">Riwayat &amp; Bukti Bayar</span>
              </div>
              <div className="flex items-center sm:flex-col justify-center gap-space-xs p-space-xs bg-surface-container-lowest sm:bg-transparent rounded sm:rounded-none shadow-sm sm:shadow-none">
                <span className="material-symbols-outlined text-secondary text-body-lg">notifications_active</span>
                <span className="font-label-sm text-label-sm text-on-surface">Notifikasi Siap Ambil</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-space-sm bg-error-container text-on-error-container rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span className="font-body-sm text-body-sm">{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form className="flex flex-col gap-space-md" id="customerRegisterForm" onSubmit={handleRegistration}>
              {/* Field 1: Nama Lengkap */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between" htmlFor="fullName">
                  <span>Nama Lengkap</span>
                  <span className="text-error font-body-sm">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-body-lg pointer-events-none">
                    person
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    id="fullName"
                    name="fullName"
                    placeholder="contoh: Bpk. Rahmat Hidayat"
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 2: Nomor WhatsApp */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="whatsappNumber">
                    Nomor WhatsApp / HP
                  </label>
                  <span className="font-label-sm text-label-sm text-primary">Untuk info kurir &amp; resi</span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-body-lg pointer-events-none">
                    chat
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    placeholder="0812-xxxx-xxxx"
                    required
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 3: Email */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                  Email
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-body-lg pointer-events-none">
                    mail
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    id="email"
                    name="email"
                    placeholder="nama@domain.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 4: Kata Sandi */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-body-lg pointer-events-none">
                    lock
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-10 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    id="password"
                    minLength={8}
                    name="password"
                    placeholder="Minimal 8 karakter"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Tampilkan sandi"
                    className="absolute right-3 text-outline hover:text-on-surface flex items-center justify-center p-1 rounded transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-body-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Password Strength Tracker */}
                <div className="flex items-center gap-space-xs mt-1">
                  <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      id="pwdBar"
                      style={{ width: strength.width }}
                    ></div>
                  </div>
                  <span className={`font-label-sm text-label-sm ${strength.textClass}`} id="pwdLabel">
                    {strength.label}
                  </span>
                </div>
              </div>

              {/* Field 5: Konfirmasi Kata Sandi */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="confirmPassword">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-body-lg pointer-events-none">
                    lock_reset
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-10 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Ulangi kata sandi"
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    aria-label="Tampilkan konfirmasi sandi"
                    className="absolute right-3 text-outline hover:text-on-surface flex items-center justify-center p-1 rounded transition-colors cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-body-lg">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Field 6: Checkbox Terms & Privacy */}
              <div className="flex items-start gap-space-sm pt-space-xs">
                <input
                  checked={termsAgree}
                  onChange={(e) => setTermsAgree(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
                  id="termsAgree"
                  name="termsAgree"
                  required
                  type="checkbox"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none leading-relaxed" htmlFor="termsAgree">
                  Saya menyetujui{' '}
                  <Link className="text-primary hover:underline font-label-sm font-semibold" href="/syarat" target="_blank">
                    Ketentuan Layanan
                  </Link>{' '}
                  &amp; Kebijakan Privasi LaundryKu.
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-space-xs">
                <button
                  className="w-full h-11 bg-primary-container hover:bg-primary text-on-primary-container rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  id="btnSubmit"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-body-lg">sync</span>
                      <span>Mendaftarkan...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Sekarang</span>
                      <span className="material-symbols-outlined text-body-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Operational Authorization Guardrail Note */}
            <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-tertiary text-body-lg shrink-0 mt-0.5">info</span>
              <p className="font-body-sm text-body-sm leading-normal">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Pendaftaran Khusus Pelanggan.</span> Akun operator (Kasir, Petugas Cuci, Kurir) dibuat secara khusus oleh Admin Outlet melalui Dashboard Manajemen User.
              </p>
            </div>

            {/* Login Link Footer */}
            <div className="flex items-center justify-center gap-space-xs font-body-md text-body-md text-on-surface-variant pt-space-xs">
              <span>Sudah memiliki akun?</span>
              <Link
                className="text-primary hover:text-primary-container font-label-md text-label-md hover:underline inline-flex items-center gap-0.5 font-semibold"
                href="/login"
              >
                <span>Masuk di sini</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Notification Toast */}
          <div
            className={`fixed bottom-6 bg-surface-container-highest text-on-surface shadow-xl px-space-md py-space-sm rounded-xl items-center gap-space-sm z-50 animate-bounce transition-all ${
              showSuccessToast ? 'flex' : 'hidden'
            }`}
            id="regSuccessToast"
          >
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span className="font-label-md text-label-md">Pendaftaran berhasil! Mengarahkan ke halaman login...</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-lg">
        <div className="max-w-7xl mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 LaundryKu. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-space-md">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="/syarat">
              Syarat &amp; Ketentuan
            </Link>
            <span className="text-outline-variant">•</span>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="https://wa.me/6281234567890" target="_blank">
              Hubungi Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
