'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const navItems = [
  { label: 'Dashboard', href: '/kasir' },
  { label: 'Input Order Baru', href: '/kasir/order/baru' },
  { label: 'Riwayat Transaksi', href: '/kasir/riwayat' },
];

export default function KasirNav() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'KS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Outlet Badge */}
        <div className="flex items-center gap-3">
          <Link href="/kasir" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#22C7D9] flex items-center justify-center text-white shadow-md shadow-[#1677FF]/20 group-hover:scale-105 transition-transform duration-200">
              <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[#172B4D] tracking-tight leading-tight">
                Laundry<span className="text-[#1677FF]">Ku</span>
              </span>
              <span className="text-[10px] text-[#6B7280] font-semibold leading-none hidden sm:inline">Kasir POS</span>
            </div>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
            Outlet Utama
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
          {navItems.map((item) => {
            const isActive =
              item.href === '/kasir'
                ? pathname === '/kasir'
                : item.href === '/kasir/order/baru'
                ? pathname === '/kasir/order/baru'
                : pathname.startsWith('/kasir/riwayat');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-[#1677FF] bg-white shadow-xs font-bold'
                    : 'text-[#6B7280] hover:text-[#172B4D] hover:bg-white/50'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1677FF]/15 to-[#22C7D9]/25 text-[#1677FF] flex items-center justify-center font-bold text-xs border border-[#1677FF]/20 shadow-xs">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#172B4D] leading-tight">
                {user?.name ?? 'Siti Kasir'}
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium leading-none">
                {user?.role ?? 'Kasir'}
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-[#E5E7EB]" />

          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
            title="Keluar dari sistem"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
