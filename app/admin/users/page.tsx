'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Operator {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'Kasir' | 'Petugas Cuci' | 'Kurir';
  phone: string;
  status: 'Aktif' | 'Nonaktif';
  lastActive: string;
}

const initialOperators: Operator[] = [
  {
    id: '1',
    initials: 'SA',
    name: 'Siti Aminah',
    email: 'siti.kasir@laundryku.com',
    role: 'Kasir',
    phone: '0812-8821-9011',
    status: 'Aktif',
    lastActive: 'Hari ini, 08:30 WIB',
  },
  {
    id: '2',
    initials: 'BS',
    name: 'Budi Santoso',
    email: 'budi.cuci@laundryku.com',
    role: 'Petugas Cuci',
    phone: '0857-1982-4421',
    status: 'Aktif',
    lastActive: 'Hari ini, 07:15 WIB',
  },
  {
    id: '3',
    initials: 'AM',
    name: 'Aris Munandar',
    email: 'aris.kurir@laundryku.com',
    role: 'Kurir',
    phone: '0813-7749-3329',
    status: 'Aktif',
    lastActive: 'Kemarin, 19:40 WIB',
  },
  {
    id: '4',
    initials: 'RP',
    name: 'Rian Permana',
    email: 'rian.kurir@laundryku.com',
    role: 'Kurir',
    phone: '0812-9901-2245',
    status: 'Aktif',
    lastActive: 'Hari ini, 09:10 WIB',
  },
  {
    id: '5',
    initials: 'AS',
    name: 'Agus Supriyadi',
    email: 'agus.cuci@laundryku.com',
    role: 'Petugas Cuci',
    phone: '0878-3312-5509',
    status: 'Aktif',
    lastActive: '12 Sep 2026',
  },
  {
    id: '6',
    initials: 'RD',
    name: 'Ratna Dewi',
    email: 'ratna.kasir@laundryku.com',
    role: 'Kasir',
    phone: '0813-1120-7789',
    status: 'Aktif',
    lastActive: 'Hari ini, 08:00 WIB',
  },
  {
    id: '7',
    initials: 'DW',
    name: 'Denny Wahyudi',
    email: 'denny.cuci@laundryku.com',
    role: 'Petugas Cuci',
    phone: '0852-6631-9080',
    status: 'Nonaktif',
    lastActive: '02 Agu 2026',
  },
  {
    id: '8',
    initials: 'FR',
    name: 'Fajar Ramadhan',
    email: 'fajar.kurir@laundryku.com',
    role: 'Kurir',
    phone: '0812-4450-8819',
    status: 'Aktif',
    lastActive: 'Hari ini, 06:45 WIB',
  },
];

export default function UserManagementPage() {
  const [operators, setOperators] = useState<Operator[]>(initialOperators);
  const [roleFilter, setRoleFilter] = useState<'all' | 'Kasir' | 'Petugas Cuci' | 'Kurir'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Nonaktif'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState('');
  const [newOperatorRole, setNewOperatorRole] = useState<'Kasir' | 'Petugas Cuci' | 'Kurir'>('Kasir');
  const [newOperatorEmail, setNewOperatorEmail] = useState('');
  const [newOperatorPhone, setNewOperatorPhone] = useState('');
  const [newOperatorPwd, setNewOperatorPwd] = useState('LaundryKu2025#');
  const [notification, setNotification] = useState<string | null>(null);

  // Filter calculations
  const totalCount = operators.length;
  const kasirCount = operators.filter((o) => o.role === 'Kasir').length;
  const cuciCount = operators.filter((o) => o.role === 'Petugas Cuci').length;
  const kurirCount = operators.filter((o) => o.role === 'Kurir').length;
  const activeCount = operators.filter((o) => o.status === 'Aktif').length;
  const inactiveCount = operators.filter((o) => o.status === 'Nonaktif').length;

  const filteredOperators = operators.filter((op) => {
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.phone.includes(searchQuery);

    return matchesRole && matchesStatus && matchesSearch;
  });

  const generatePassword = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setNewOperatorPwd(`LndrStaff#${rand}`);
  };

  const handleToggleStatus = (id: string) => {
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id === id) {
          const nextStatus = op.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          return { ...op, status: nextStatus };
        }
        return op;
      })
    );
  };

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperatorName.trim()) return;

    const words = newOperatorName.trim().split(' ');
    const initials =
      words.length > 1
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : words[0].slice(0, 2).toUpperCase();

    const newOp: Operator = {
      id: String(Date.now()),
      initials,
      name: newOperatorName,
      email: newOperatorEmail || `${newOperatorName.toLowerCase().replace(/\s+/g, '.')}@laundryku.com`,
      role: newOperatorRole,
      phone: newOperatorPhone || '0812-0000-0000',
      status: 'Aktif',
      lastActive: 'Baru dibuat',
    };

    setOperators([newOp, ...operators]);
    setNotification(`Operator ${newOperatorName} berhasil ditambahkan!`);
    setTimeout(() => setNotification(null), 3000);

    // Reset & close
    setNewOperatorName('');
    setNewOperatorEmail('');
    setNewOperatorPhone('');
    setNewOperatorPwd('LaundryKu2025#');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      {/* Header Portal Admin */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-lg">
            <Link className="flex items-center gap-space-sm" href="/admin">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">LaundryKu</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-xs">
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/admin"
              >
                Ringkasan Bisnis
              </Link>
              <Link
                aria-current="page"
                className="px-space-md py-space-sm transition-colors bg-primary-container text-on-primary-container font-label-lg text-label-lg rounded-lg"
                href="/admin/users"
              >
                Manajemen User
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/admin/pengaturan"
              >
                Pengaturan Tarif &amp; Outlet
              </Link>
              <Link
                className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/lacak"
                target="_blank"
              >
                Lacak Publik ↗
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm pl-space-md">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight">Pak Hendra</span>
                <span className="inline-flex items-center self-end px-space-xs rounded font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
                  Pemilik
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
            <Link
              aria-label="Keluar"
              className="p-space-xs rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors flex items-center justify-center"
              href="/admin"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="max-w-7xl mx-auto px-margin py-space-lg">
          <div className="flex flex-col w-full">
            
            {/* Notification alert */}
            {notification && (
              <div className="mb-space-md p-space-sm rounded-xl bg-secondary-container text-on-secondary-container flex items-center gap-space-xs shadow-sm">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="font-label-md text-label-md">{notification}</span>
              </div>
            )}

            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                    Manajemen Akun Operator
                  </h1>
                  <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                    Outlet Utama
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Kelola hak akses dan akun operasional staf outlet (Kasir, Petugas Cuci, Kurir) sesuai otorisasi sistem LaundryKu.
                </p>
              </div>
              <div className="flex items-center gap-space-sm self-start md:self-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary-container px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  <span>Tambah Operator Baru</span>
                </button>
              </div>
            </div>

            {/* Ringkasan Kuota & Statistik Operator (3 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
              {/* Card 1: Total Staf */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-start justify-between">
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">Total Akun Operator</span>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-display-scale-weight text-[36px] leading-[40px] text-on-surface font-extrabold">
                      {totalCount}
                    </span>
                    <span className="font-label-md text-label-md text-secondary font-semibold">
                      {activeCount} Akun Aktif
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Kapasitas lisensi: {totalCount}/12 Akun
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">badge</span>
                </div>
              </div>

              {/* Card 2: Pembagian Peran */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-start justify-between">
                <div className="flex flex-col gap-space-xs w-full">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">Pembagian Peran Staf</span>
                  <div className="flex items-center gap-space-sm mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface">Kasir ({kasirCount})</span>
                    </div>
                    <span className="text-outline-variant">•</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface">Cuci ({cuciCount})</span>
                    </div>
                    <span className="text-outline-variant">•</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface">Kurir ({kurirCount})</span>
                    </div>
                  </div>
                  {/* Visual Segmented Bar */}
                  <div className="w-full bg-surface-container-high h-2 rounded-full mt-2 flex overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${totalCount ? (kasirCount / totalCount) * 100 : 0}%` }}
                    ></div>
                    <div
                      className="bg-tertiary h-full transition-all"
                      style={{ width: `${totalCount ? (cuciCount / totalCount) * 100 : 0}%` }}
                    ></div>
                    <div
                      className="bg-secondary h-full transition-all"
                      style={{ width: `${totalCount ? (kurirCount / totalCount) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Kebijakan Akses */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-primary mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Kebijakan Akses</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
                    Akun pelanggan terdaftar mandiri melalui halaman Registrasi dan tidak tampil di daftar staf outlet ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Filter & Toolbar Panel */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-space-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-space-md py-2 bg-surface rounded-lg text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
                  placeholder="Cari nama operator, email, atau nomor HP..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Pills / Roles & Status */}
              <div className="flex flex-wrap items-center gap-space-sm">
                {/* Role Tabs */}
                <div className="inline-flex p-1 bg-surface-container-low rounded-lg gap-1">
                  <button
                    onClick={() => setRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      roleFilter === 'all'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Semua Peran ({totalCount})
                  </button>
                  <button
                    onClick={() => setRoleFilter('Kasir')}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      roleFilter === 'Kasir'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Kasir ({kasirCount})
                  </button>
                  <button
                    onClick={() => setRoleFilter('Petugas Cuci')}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      roleFilter === 'Petugas Cuci'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Petugas Cuci ({cuciCount})
                  </button>
                  <button
                    onClick={() => setRoleFilter('Kurir')}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      roleFilter === 'Kurir'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    Kurir ({kurirCount})
                  </button>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Aktif' | 'Nonaktif')}
                  >
                    <option value="all">Semua Status</option>
                    <option value="Aktif">Aktif ({activeCount})</option>
                    <option value="Nonaktif">Nonaktif ({inactiveCount})</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Data Table User Operator */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                      <th className="py-3 px-space-md">Operator</th>
                      <th className="py-3 px-space-md">Peran</th>
                      <th className="py-3 px-space-md">Nomor Handphone</th>
                      <th className="py-3 px-space-md">Status</th>
                      <th className="py-3 px-space-md">Aktivitas Terakhir</th>
                      <th className="py-3 px-space-md text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0">
                    {filteredOperators.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 px-space-md text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-space-sm">
                              <span className="material-symbols-outlined text-[28px]">search_off</span>
                            </div>
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">
                              Operator Tidak Ditemukan
                            </span>
                            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-1">
                              Tidak ada staf yang sesuai dengan filter pencarian atau peran yang Anda pilih.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOperators.map((op) => (
                        <tr
                          key={op.id}
                          className={`hover:bg-surface-container-low/50 transition-colors group ${
                            op.status === 'Nonaktif' ? 'opacity-75' : ''
                          }`}
                        >
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div
                                className={`w-9 h-9 rounded-full font-label-lg flex items-center justify-center font-bold ${
                                  op.role === 'Kasir'
                                    ? 'bg-primary-fixed text-on-primary-fixed'
                                    : op.role === 'Petugas Cuci'
                                    ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                    : 'bg-secondary-fixed text-on-secondary-fixed'
                                }`}
                              >
                                {op.initials}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                                  {op.name}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                                  {op.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                                op.role === 'Kasir'
                                  ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                  : op.role === 'Petugas Cuci'
                                  ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                                  : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                              }`}
                            >
                              {op.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <span className="font-body-md text-body-md text-on-surface">{op.phone}</span>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                                op.status === 'Aktif'
                                  ? 'bg-secondary-fixed text-on-secondary-fixed'
                                  : 'bg-surface-container-high text-on-surface-variant'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  op.status === 'Aktif' ? 'bg-secondary' : 'bg-outline'
                                }`}
                              ></span>
                              <span>{op.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              {op.lastActive}
                            </span>
                          </td>
                          <td className="py-3.5 px-space-md text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                aria-label="Edit Staf"
                                onClick={() => {
                                  alert(`Edit profil untuk: ${op.name}`);
                                }}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                aria-label={op.status === 'Aktif' ? 'Nonaktifkan Staf' : 'Aktifkan Staf Kembali'}
                                onClick={() => handleToggleStatus(op.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  op.status === 'Aktif'
                                    ? 'text-on-surface-variant hover:text-error hover:bg-error-container/40'
                                    : 'text-on-surface-variant hover:text-secondary hover:bg-secondary-fixed/40'
                                }`}
                                type="button"
                                title={op.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {op.status === 'Aktif' ? 'block' : 'check_circle'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-space-md py-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span>
                  Menampilkan <strong className="text-on-surface font-label-md">{filteredOperators.length}</strong> akun staf
                </span>
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    LaundryKu Access Control v1.2
                  </span>
                </div>
              </div>
            </div>

            {/* Operational Flow Quick Note Banner */}
            <div className="mt-space-lg p-space-md rounded-xl bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">security</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Pengaturan Otorisasi &amp; Hak Akses Peran
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Kasir memiliki akses POS &amp; Penerimaan, Petugas Cuci memproses cucian, dan Kurir memiliki modul Antar/Jemput.
                  </span>
                </div>
              </div>
              <Link
                className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline whitespace-nowrap"
                href="/admin/pengaturan"
              >
                <span>Buka Otorisasi Outlet</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Modal Tambah Akun Operator Baru */}
            {isModalOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsModalOpen(false);
                }}
              >
                <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-space-sm mb-space-md border-b-0">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                          Tambah Operator Baru
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Buat kredensial akun staf untuk outlet operasional
                        </p>
                      </div>
                    </div>
                    <button
                      aria-label="Tutup form"
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <form className="flex flex-col gap-space-md" onSubmit={handleAddOperator}>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Nama Lengkap Operator
                      </label>
                      <input
                        className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg text-body-md text-on-surface placeholder:text-outline focus:outline-none transition-colors border border-transparent focus:border-primary"
                        placeholder="Contoh: Rendi Pratama"
                        required
                        type="text"
                        value={newOperatorName}
                        onChange={(e) => setNewOperatorName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Peran Akun Staf
                      </label>
                      <div className="relative">
                        <select
                          className="w-full h-11 pl-3 pr-9 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg text-body-md text-on-surface appearance-none focus:outline-none cursor-pointer transition-colors border border-transparent focus:border-primary"
                          value={newOperatorRole}
                          onChange={(e) =>
                            setNewOperatorRole(e.target.value as 'Kasir' | 'Petugas Cuci' | 'Kurir')
                          }
                          required
                        >
                          <option value="Kasir">Kasir (Akses POS, Pembayaran, Check-in &amp; Tagihan)</option>
                          <option value="Petugas Cuci">Petugas Cuci (Akses Antrean Cuci, Pengering, Setrika)</option>
                          <option value="Kurir">Kurir (Akses Penjemputan, Pengantaran &amp; Titik Lokasi)</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          Email Operator
                        </label>
                        <input
                          className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg text-body-md text-on-surface placeholder:text-outline focus:outline-none transition-colors border border-transparent focus:border-primary"
                          placeholder="nama@laundryku.com"
                          required
                          type="email"
                          value={newOperatorEmail}
                          onChange={(e) => setNewOperatorEmail(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          Nomor Handphone (WhatsApp)
                        </label>
                        <input
                          className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg text-body-md text-on-surface placeholder:text-outline focus:outline-none transition-colors border border-transparent focus:border-primary"
                          placeholder="0812-xxxx-xxxx"
                          required
                          type="tel"
                          value={newOperatorPhone}
                          onChange={(e) => setNewOperatorPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          Kata Sandi Sementara
                        </label>
                        <button
                          className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                          onClick={generatePassword}
                          type="button"
                        >
                          Buat Otomatis
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container-lowest rounded-lg text-body-md font-mono text-on-surface focus:outline-none transition-colors border border-transparent focus:border-primary"
                          required
                          type="text"
                          value={newOperatorPwd}
                          onChange={(e) => setNewOperatorPwd(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                          lock_reset
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Staf wajib mengganti kata sandi saat pertama kali login.
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">info</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Akun yang dibuat akan langsung aktif dan dapat digunakan login ke portal operasional sesuai izin akses perannya.
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-colors cursor-pointer"
                        type="button"
                      >
                        Batal
                      </button>
                      <button
                        className="px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                        type="submit"
                      >
                        Simpan &amp; Buat Akun
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-lg mt-auto">
        <div className="w-full px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-on-surface font-semibold">LaundryKu Portal Operasional</span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Sistem Manajemen Presisi Satu Halaman</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 LaundryKu Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
