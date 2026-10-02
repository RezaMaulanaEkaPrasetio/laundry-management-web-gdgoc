/**
 * LaundryKu Central Order Store & Business Logic Engine
 * Menyediakan Single Source of Truth, Validasi Matematis, & State Machine Penjamin Mutu.
 */

export type OrderStatus =
  | 'terjadwal'
  | 'penjemputan'
  | 'sudah_dijemput'
  | 'dicuci'
  | 'selesai_dicuci'
  | 'siap_diantar'
  | 'selesai';

export interface LaundryOrder {
  id: string;
  customer: string;
  phone: string;
  pickupAddress?: string;
  pickupMethod: 'dropoff' | 'pickup';
  service: string;
  serviceType: 'ckl' | 'ckg' | 'satuan';
  speedLevel: 'reguler' | 'express' | 'kilat';
  ratePerKg: number;
  weight: number; // Dalam Kg, default 0 sebelum ditimbang
  deliveryFee: number;
  discount: number;
  total: number;
  paid: boolean;
  paymentMethod?: 'cash' | 'qris' | 'cod';
  status: OrderStatus;
  statusLabel: string;
  statusBg: string;
  statusText: string;
  time: string;
  notes?: string;
  washingMachine?: string;
  dryerMachine?: string;
  rackLocation?: string;
  createdAt: string;
}

// Default initial dataset yang realistis dan matematis
export const INITIAL_ORDERS: LaundryOrder[] = [
  {
    id: '#LKU-260930',
    customer: 'Anisa Rahmawati',
    phone: '0812-9988-7711',
    pickupAddress: 'Jl. Kemang Timur No. 12, Jakarta Selatan',
    pickupMethod: 'pickup',
    service: 'Reguler Cuci Setrika (CKG)',
    serviceType: 'ckg',
    speedLevel: 'reguler',
    ratePerKg: 10000,
    weight: 0,
    deliveryFee: 10000,
    discount: 10000,
    total: 0,
    paid: false,
    status: 'terjadwal',
    statusLabel: 'Terjadwal Penjemputan',
    statusBg: 'bg-[#E8F0FE]',
    statusText: 'text-[#1A73E8]',
    time: '14:00 WIB • Terjadwal',
    notes: 'Pagar putih, mohon konfirmasi sebelum sampai',
    createdAt: '2026-09-27T08:00:00Z',
  },
  {
    id: '#LKU-260901',
    customer: 'Budi Santoso',
    phone: '0812-3456-7890',
    pickupAddress: 'Jl. Fatmawati No. 88, Cilandak',
    pickupMethod: 'dropoff',
    service: 'Reguler Cuci Setrika (CKG)',
    serviceType: 'ckg',
    speedLevel: 'reguler',
    ratePerKg: 10000,
    weight: 4.0,
    deliveryFee: 0,
    discount: 3000,
    total: 37000, // 4 * 10000 - 3000 = 37.000
    paid: false,
    status: 'penjemputan',
    statusLabel: 'Menunggu Pembayaran',
    statusBg: 'bg-tertiary-fixed',
    statusText: 'text-on-tertiary-fixed',
    time: '08:30 WIB • Hari ini',
    notes: 'Kemeja kerja mohon digantung rapi',
    createdAt: '2026-09-27T08:30:00Z',
  },
  {
    id: '#LKU-260902',
    customer: 'Siti Rahmawati',
    phone: '0857-1122-3344',
    pickupAddress: 'Apartemen Kemang Village Tower Infinity Unit 12B',
    pickupMethod: 'dropoff',
    service: 'Express Cuci Setrika (1 Hari)',
    serviceType: 'ckg',
    speedLevel: 'express',
    ratePerKg: 15000, // 10000 * 1.5
    weight: 4.0,
    deliveryFee: 0,
    discount: 0,
    total: 60000, // 4 * 15000 = 60.000
    paid: true,
    paymentMethod: 'qris',
    status: 'dicuci',
    statusLabel: 'Sedang Dicuci (Mesin #02)',
    statusBg: 'bg-[#FEF7E0]',
    statusText: 'text-[#B06000]',
    washingMachine: 'Mesin Cuci #02 (Front Load)',
    time: '09:15 WIB • Hari ini',
    createdAt: '2026-09-27T09:15:00Z',
  },
  {
    id: '#LKU-260903',
    customer: 'Hendro Kusumo',
    phone: '0819-9876-5432',
    pickupAddress: 'Jl. Radio Dalam No. 15',
    pickupMethod: 'pickup',
    service: 'Reguler Cuci Lipat (CKL)',
    serviceType: 'ckl',
    speedLevel: 'reguler',
    ratePerKg: 8000,
    weight: 3.5,
    deliveryFee: 0,
    discount: 0,
    total: 28000, // 3.5 * 8000 = 28.000
    paid: true,
    paymentMethod: 'cash',
    status: 'siap_diantar',
    statusLabel: 'Siap Diantar (Rak B-04)',
    statusBg: 'bg-surface-variant',
    statusText: 'text-on-surface-variant',
    rackLocation: 'Rak B-04',
    time: '10:02 WIB • Kemarin',
    createdAt: '2026-09-26T10:02:00Z',
  },
  {
    id: '#LKU-260925',
    customer: 'Bambang Triatmojo',
    phone: '0812-7788-9900',
    pickupAddress: 'Jl. Kemang Raya No. 42A',
    pickupMethod: 'pickup',
    service: 'Cuci Komplit Reguler',
    serviceType: 'ckg',
    speedLevel: 'reguler',
    ratePerKg: 8000,
    weight: 4.8,
    deliveryFee: 0,
    discount: 0,
    total: 38400, // 4.8 * 8000 = 38.400
    paid: true,
    paymentMethod: 'qris',
    status: 'dicuci',
    statusLabel: 'Sedang Dicuci & Dikeringkan',
    statusBg: 'bg-[#FEF7E0]',
    statusText: 'text-[#B06000]',
    washingMachine: 'Tabung 05',
    time: '10:20 WIB • Hari ini',
    notes: 'Pakaian kemeja putih jangan dicampur warna gelap. Bagian kerah mohon ekstra bersih.',
    createdAt: '2026-09-27T09:45:00Z',
  },
];

const STORAGE_KEY = 'laundryku_orders_master_v1';
const EVENT_KEY = 'laundryku_order_state_change';

// Helper: hitung total harga secara akurat
export function calculateOrderPrice(
  weight: number,
  ratePerKg: number,
  deliveryFee: number = 0,
  discount: number = 0
): number {
  if (weight <= 0) return 0;
  const rawSubtotal = Math.round(weight * ratePerKg);
  const netTotal = Math.max(0, rawSubtotal + deliveryFee - discount);
  return netTotal;
}

// Status Map Metadata
export const STATUS_META: Record<
  OrderStatus,
  { label: string; bg: string; text: string; step: number }
> = {
  terjadwal: {
    label: 'Terjadwal',
    bg: 'bg-[#E8F0FE]',
    text: 'text-[#1A73E8]',
    step: 1,
  },
  penjemputan: {
    label: 'Menunggu Penjemputan',
    bg: 'bg-primary-fixed',
    text: 'text-on-primary-fixed-variant',
    step: 2,
  },
  sudah_dijemput: {
    label: 'Sudah Dijemput',
    bg: 'bg-secondary-container',
    text: 'text-on-secondary-container',
    step: 3,
  },
  dicuci: {
    label: 'Sedang Dicuci',
    bg: 'bg-[#FEF7E0]',
    text: 'text-[#B06000]',
    step: 4,
  },
  selesai_dicuci: {
    label: 'Selesai Dicuci',
    bg: 'bg-[#E6F4EA]',
    text: 'text-[#137333]',
    step: 5,
  },
  siap_diantar: {
    label: 'Siap Diantar',
    bg: 'bg-surface-variant',
    text: 'text-on-surface-variant',
    step: 6,
  },
  selesai: {
    label: 'Selesai & Diterima',
    bg: 'bg-secondary-fixed',
    text: 'text-on-secondary-fixed',
    step: 7,
  },
};

// Ambil semua orders dari storage
export function getOrders(): LaundryOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading order store:', e);
    return INITIAL_ORDERS;
  }
}

// Simpan orders ke storage & siarkan event perubahan
export function saveOrders(orders: LaundryOrder[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event(EVENT_KEY));
  } catch (e) {
    console.error('Error saving order store:', e);
  }
}

// Tambah order baru
export function addOrder(order: Omit<LaundryOrder, 'id' | 'createdAt' | 'statusBg' | 'statusText'>): LaundryOrder {
  const all = getOrders();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randSeq = String(Math.floor(100 + Math.random() * 900));
  const newId = `#LKU-${dateStr}${randSeq}`;

  const meta = STATUS_META[order.status];
  const newOrder: LaundryOrder = {
    ...order,
    id: newId,
    statusBg: meta.bg,
    statusText: meta.text,
    createdAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...all];
  saveOrders(updated);
  return newOrder;
}

// Update order tertentu
export function updateOrder(id: string, updates: Partial<LaundryOrder>): LaundryOrder | null {
  const all = getOrders();
  let found: LaundryOrder | null = null;

  const updated = all.map((o) => {
    if (o.id === id) {
      const merged: LaundryOrder = { ...o, ...updates };

      // Jika ada perubahan status, perbarui label dan warnanya
      if (updates.status && STATUS_META[updates.status]) {
        const meta = STATUS_META[updates.status];
        merged.statusLabel = updates.statusLabel || meta.label;
        merged.statusBg = meta.bg;
        merged.statusText = meta.text;
      }

      // Jika ada update berat/tarif, sinkronkan total matematis
      if (updates.weight !== undefined || updates.ratePerKg !== undefined) {
        const w = updates.weight !== undefined ? updates.weight : o.weight;
        const r = updates.ratePerKg !== undefined ? updates.ratePerKg : o.ratePerKg;
        merged.total = calculateOrderPrice(w, r, merged.deliveryFee, merged.discount);
      }

      found = merged;
      return merged;
    }
    return o;
  });

  if (found) {
    saveOrders(updated);
  }
  return found;
}

// Cari order berdasarkan ID
export function findOrderById(query: string): LaundryOrder | null {
  const all = getOrders();
  const clean = query.trim().toUpperCase().replace(/^#/, '');
  return (
    all.find((o) => o.id.toUpperCase().replace(/^#/, '') === clean) ||
    all.find((o) => o.customer.toLowerCase().includes(query.trim().toLowerCase())) ||
    null
  );
}

// Hook subscriber untuk mendengarkan perubahan data secara live antar tab/komponen
export function subscribeToOrders(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_KEY, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_KEY, callback);
    window.removeEventListener('storage', callback);
  };
}
