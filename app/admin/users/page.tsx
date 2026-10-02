'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '../_components/AdminNav';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function UserManagementPage() {
  const { user: currentUser } = useCurrentUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'KASIR' | 'PETUGAS_CUCI' | 'KURIR' | 'ADMIN'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Nonaktif'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [operatorName, setOperatorName] = useState('');
  const [operatorRole, setOperatorRole] = useState<'KASIR' | 'PETUGAS_CUCI' | 'KURIR'>('KASIR');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [operatorPhone, setOperatorPhone] = useState('');
  const [operatorPwd, setOperatorPwd] = useState('LaundryKu2026#');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete/Deactivate Confirmation Modal State
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal mengambil data user', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setOperatorName('');
    setOperatorEmail('');
    setOperatorPhone('');
    setOperatorRole('KASIR');
    setOperatorPwd('LaundryKu2026#');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (op: any) => {
    setEditingUserId(op.id);
    setOperatorName(op.name);
    setOperatorEmail(op.email);
    setOperatorPhone(op.phone || '');
    setOperatorRole(op.role === 'ADMIN' ? 'KASIR' : op.role);
    setOperatorPwd('');
    setIsModalOpen(true);
  };

  const handleSaveOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorName.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingUserId) {
        // Edit User
        const res = await fetch(`/api/users/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: operatorName,
            phone: operatorPhone || '081200000000',
          }),
        });

        if (res.ok) {
          setNotification(`Data pengguna ${operatorName} berhasil diperbarui!`);
          setTimeout(() => setNotification(null), 3000);
          setIsModalOpen(false);
          fetchUsers();
        } else {
          alert('Gagal mengupdate pengguna');
        }
      } else {
        // Add User
        if (!operatorEmail.trim() || !operatorPwd) return;
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: operatorName,
            email: operatorEmail,
            password: operatorPwd,
            role: operatorRole,
            phone: operatorPhone || '081200000000',
          }),
        });

        if (res.ok) {
          setNotification(`Pengguna ${operatorName} berhasil ditambahkan!`);
          setTimeout(() => setNotification(null), 3000);
          setIsModalOpen(false);
          fetchUsers();
        } else {
          const err = await res.json();
          alert(err.error || 'Gagal menambahkan operator');
        }
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentIsActive: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentIsActive }),
      });
      if (res.ok) {
        setNotification(`Status akun berhasil diubah!`);
        setTimeout(() => setNotification(null), 3000);
        fetchUsers();
      } else {
        alert('Gagal memperbarui status user');
      }
    } catch {
      alert('Gagal menghubungi server');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteUser) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${confirmDeleteUser.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotification(`Akun ${confirmDeleteUser.name} telah dinonaktifkan!`);
        setTimeout(() => setNotification(null), 3000);
        setConfirmDeleteUser(null);
        fetchUsers();
      } else {
        alert('Gagal menonaktifkan pengguna');
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setIsDeleting(false);
    }
  };

  const generatePassword = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setOperatorPwd(`Staff#${rand}`);
  };

  // Calculations
  const totalCount = users.length;
  const kasirCount = users.filter((o) => o.role === 'KASIR').length;
  const cuciCount = users.filter((o) => o.role === 'PETUGAS_CUCI').length;
  const kurirCount = users.filter((o) => o.role === 'KURIR').length;
  const adminCount = users.filter((o) => o.role === 'ADMIN').length;
  const activeCount = users.filter((o) => o.isActive).length;

  const filteredOperators = users.filter((op) => {
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'Aktif' ? op.isActive : !op.isActive);
    const matchesSearch =
      searchQuery === '' ||
      op.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.phone?.includes(searchQuery);

    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleDesign = (role: string) => {
    switch (role) {
      case 'KASIR':
        return {
          label: 'Kasir',
          badgeClass: 'bg-blue-50 text-[#1677FF] border border-blue-200',
          avatarClass: 'bg-blue-100 text-[#1677FF] border border-blue-200',
        };
      case 'PETUGAS_CUCI':
        return {
          label: 'Petugas Cuci',
          badgeClass: 'bg-orange-50 text-[#EA580C] border border-orange-200',
          avatarClass: 'bg-orange-100 text-[#EA580C] border border-orange-200',
        };
      case 'KURIR':
        return {
          label: 'Kurir',
          badgeClass: 'bg-emerald-50 text-[#166534] border border-emerald-200',
          avatarClass: 'bg-emerald-100 text-[#166534] border border-emerald-200',
        };
      case 'ADMIN':
        return {
          label: 'Admin',
          badgeClass: 'bg-slate-100 text-[#172B4D] border border-slate-300 font-bold',
          avatarClass: 'bg-[#172B4D] text-white',
        };
      default:
        return {
          label: role,
          badgeClass: 'bg-gray-100 text-gray-700',
          avatarClass: 'bg-gray-200 text-gray-700',
        };
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'OP';
    const words = name.trim().split(' ');
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col justify-between font-sans antialiased selection:bg-[#1677FF]/20 selection:text-[#1677FF]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40">
        <AdminNav />
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 bg-[#172B4D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{notification}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              Manajemen Pengguna Staf
            </h1>
            {/* Inline Role Summary (Kecil) */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#6B7280]">
              <span>Staf Aktif: <strong className="text-[#172B4D] font-bold">{activeCount}</strong></span>
              <span>•</span>
              <span className="text-[#1677FF] font-semibold">Kasir: {kasirCount}</span>
              <span>•</span>
              <span className="text-[#EA580C] font-semibold">Petugas Cuci: {cuciCount}</span>
              <span>•</span>
              <span className="text-[#166534] font-semibold">Kurir: {kurirCount}</span>
              <span>•</span>
              <span className="text-[#172B4D] font-semibold">Admin: {adminCount}</span>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white hover:opacity-95 text-xs font-bold shadow-md shadow-[#1677FF]/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer self-start md:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, atau no. telepon..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
            />
            <svg className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Role & Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === 'all'
                    ? 'bg-white text-[#172B4D] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#172B4D]'
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('KASIR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === 'KASIR'
                    ? 'bg-white text-[#1677FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1677FF]'
                }`}
              >
                Kasir ({kasirCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('PETUGAS_CUCI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === 'PETUGAS_CUCI'
                    ? 'bg-white text-[#EA580C] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#EA580C]'
                }`}
              >
                Petugas Cuci ({cuciCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('KURIR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === 'KURIR'
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#166534]'
                }`}
              >
                Kurir ({kurirCount})
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF] cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10 text-[#6B7280] uppercase tracking-wider font-extrabold border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3.5 px-4">Pengguna Staf</th>
                  <th className="py-3.5 px-4">Peran (Role)</th>
                  <th className="py-3.5 px-4">Kontak / WA</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Terdaftar</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB] text-[#172B4D]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-6 h-6 animate-spin text-[#1677FF]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memuat data pengguna...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOperators.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-10 h-10 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-bold text-sm text-[#172B4D]">Tidak ada pengguna ditemukan</span>
                        <span className="text-xs text-[#94A3B8]">Coba ubah kata kunci pencarian atau filter peran staf.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOperators.map((op) => {
                    const roleDesign = getRoleDesign(op.role);
                    return (
                      <tr
                        key={op.id}
                        className={`hover:bg-[#F8FAFC] transition-colors duration-150 group ${
                          !op.isActive ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Pengguna: Avatar inisial dengan warna role */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${roleDesign.avatarClass}`}>
                              {getInitials(op.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-[#172B4D] group-hover:text-[#1677FF] transition-colors">
                                {op.name}
                              </span>
                              <span className="text-[11px] text-[#6B7280] truncate">
                                {op.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Pill Badge */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roleDesign.badgeClass}`}>
                            {roleDesign.label}
                          </span>
                        </td>

                        {/* Kontak / Phone */}
                        <td className="py-3 px-4 font-mono font-medium text-[#172B4D]">
                          {op.phone || '-'}
                        </td>

                        {/* Status Aktif / Nonaktif Toggle Switch / Pill */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(op.id, op.isActive)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              op.isActive
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                            }`}
                            title="Klik untuk ubah status aktif"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${op.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            <span>{op.isActive ? 'Aktif' : 'Nonaktif'}</span>
                          </button>
                        </td>

                        {/* Terdaftar */}
                        <td className="py-3 px-4 text-[#6B7280]">
                          {new Date(op.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Aksi: Edit & Hapus (Icon Buttons) */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(op)}
                              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#1677FF] hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Pengguna"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {/* Delete/Deactivate Button */}
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteUser(op)}
                              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#EA4335] hover:bg-red-50 transition-colors cursor-pointer"
                              title="Nonaktifkan / Hapus Pengguna"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah / Edit Pengguna */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E7EB] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div>
                  <h2 className="text-base font-extrabold text-[#172B4D]">
                    {editingUserId ? 'Edit Data Pengguna Staf' : 'Tambah Pengguna Staf Baru'}
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    {editingUserId
                      ? 'Perbarui informasi identitas operasional staf outlet.'
                      : 'Buat kredensial akun staf untuk outlet operasional LaundryKu.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[#6B7280] hover:text-[#172B4D] hover:bg-[#F1F5F9] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveOperator} className="flex flex-col gap-4">
                {/* Nama Lengkap */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                    Nama Lengkap Operator *
                  </label>
                  <input
                    type="text"
                    required
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Contoh: Rendi Pratama"
                    className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF] focus:bg-white transition-all"
                  />
                </div>

                {/* Role Selector: RADIO CARD VISUAL */}
                {!editingUserId && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                      Pilih Peran Akun Staf (Role) *
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Card Kasir */}
                      <button
                        type="button"
                        onClick={() => setOperatorRole('KASIR')}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          operatorRole === 'KASIR'
                            ? 'border-[#1677FF] bg-blue-50/50 shadow-sm ring-2 ring-[#1677FF]/20'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#1677FF] flex items-center justify-center font-bold text-xs">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </span>
                          {operatorRole === 'KASIR' && (
                            <span className="w-2 h-2 rounded-full bg-[#1677FF]"></span>
                          )}
                        </div>
                        <span className="font-extrabold text-xs text-[#172B4D]">Kasir</span>
                        <span className="text-[10px] text-[#6B7280] leading-tight mt-0.5">Order & Kasir</span>
                      </button>

                      {/* Card Petugas Cuci */}
                      <button
                        type="button"
                        onClick={() => setOperatorRole('PETUGAS_CUCI')}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          operatorRole === 'PETUGAS_CUCI'
                            ? 'border-[#EA580C] bg-orange-50/50 shadow-sm ring-2 ring-[#EA580C]/20'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="w-7 h-7 rounded-lg bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-xs">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </span>
                          {operatorRole === 'PETUGAS_CUCI' && (
                            <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>
                          )}
                        </div>
                        <span className="font-extrabold text-xs text-[#172B4D]">Petugas Cuci</span>
                        <span className="text-[10px] text-[#6B7280] leading-tight mt-0.5">Workshop & Timbang</span>
                      </button>

                      {/* Card Kurir */}
                      <button
                        type="button"
                        onClick={() => setOperatorRole('KURIR')}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          operatorRole === 'KURIR'
                            ? 'border-[#34A853] bg-emerald-50/50 shadow-sm ring-2 ring-[#34A853]/20'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#34A853] flex items-center justify-center font-bold text-xs">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                          </span>
                          {operatorRole === 'KURIR' && (
                            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
                          )}
                        </div>
                        <span className="font-extrabold text-xs text-[#172B4D]">Kurir</span>
                        <span className="text-[10px] text-[#6B7280] leading-tight mt-0.5">Jemput & Antar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Email & No Handphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                      Email Operator {!editingUserId && '*'}
                    </label>
                    <input
                      type="email"
                      required={!editingUserId}
                      disabled={!!editingUserId}
                      value={operatorEmail}
                      onChange={(e) => setOperatorEmail(e.target.value)}
                      placeholder="nama@laundryku.com"
                      className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF] disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                      Nomor HP / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={operatorPhone}
                      onChange={(e) => setOperatorPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password (for new user) */}
                {!editingUserId && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#6B7280]">
                        Kata Sandi Awal *
                      </label>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="text-xs font-bold text-[#1677FF] hover:underline cursor-pointer"
                      >
                        Acak Sandi
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={operatorPwd}
                      onChange={(e) => setOperatorPwd(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#1677FF] focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#172B4D] font-bold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#22C7D9] text-white font-bold text-xs shadow-md shadow-[#1677FF]/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : editingUserId ? 'Simpan Perubahan' : 'Buat Akun Staf'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus / Nonaktifkan */}
        {confirmDeleteUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E7EB] flex flex-col gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#EA4335] flex items-center justify-center mx-auto border border-red-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#172B4D]">
                  Nonaktifkan Pengguna?
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Akun <strong className="text-[#172B4D]">{confirmDeleteUser.name}</strong> ({confirmDeleteUser.email}) akan dinonaktifkan dan tidak dapat masuk ke sistem LaundryKu lagi.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-full py-2.5 rounded-xl bg-[#EA4335] hover:bg-[#DC2626] text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Memproses...' : 'Ya, Nonaktifkan Akun'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteUser(null)}
                  className="w-full py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#172B4D] font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E5E7EB] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
          <span>© 2026 LaundryKu User Access Management.</span>
          <span>v2.0 • PRD Compliant</span>
        </div>
      </footer>
    </div>
  );
}
