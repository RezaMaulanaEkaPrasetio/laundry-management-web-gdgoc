'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Pesanan', href: '/admin/pesanan' },
  { label: 'Manajemen User', href: '/admin/users' },
  { label: 'Pengaturan Harga', href: '/admin/pengaturan' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 h-16 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#22C7D9] flex items-center justify-center text-white shadow-md shadow-[#1677FF]/20 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#172B4D] tracking-tight leading-tight">
              Laundry<span className="text-[#1677FF]">Ku</span>
            </span>
            <span className="text-[11px] text-[#6B7280] font-semibold leading-none">Admin Panel</span>
          </div>
        </Link>
        <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#1677FF] text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]"></span>
          Outlet Pusat
        </span>
      </div>

      {/* Navigation Tabs with Brand Gradient Underline / Active indicator */}
      <div className="hidden md:flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'text-[#1677FF] bg-blue-50/80 font-bold'
                  : 'text-[#6B7280] hover:text-[#172B4D] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-gradient-to-r from-[#1677FF] to-[#22C7D9] rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Admin User Info & Logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1677FF]/15 to-[#22C7D9]/25 text-[#1677FF] flex items-center justify-center font-bold text-xs border border-[#1677FF]/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#172B4D] leading-tight">
              {user?.name ?? 'Admin Outlet'}
            </span>
            <span className="text-[10px] text-[#6B7280] font-medium leading-none">Super Administrator</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#EA4335] hover:bg-red-50 transition-colors cursor-pointer"
          title="Keluar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </nav>
  );
}
