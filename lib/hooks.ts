'use client'

import { useState, useEffect, useCallback } from 'react'

interface CurrentUser {
  id: string
  name: string
  role: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}

export function useOrders(filterParams?: Record<string, string>) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams(filterParams ?? {})
      const res = await fetch(`/api/orders?${params.toString()}`)
      if (!res.ok) throw new Error('Gagal memuat data order')
      const data = await res.json()
      setOrders(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterParams])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}
