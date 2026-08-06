"use client";

import { useEffect, useState } from "react";
import { OrderRepository } from "@/lib/repositories/orderRepository";
import OrderRow from "@/components/ui/OrderRow";

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  size_label?: string;
  cakes: { name: string } | null;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_type: string;
  delivery_fee: number;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  special_notes?: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    const { data, error } = await OrderRepository.getAll();
    if (error) {
      setErrorMsg(error.message);
    } else {
      setOrders((data as Order[]) ?? []);
      setErrorMsg(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleStatusChange(id: string, newStatus: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  }

  function handleCancelled(id: string) {
    // Remove the cancelled order from the dashboard entirely
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-cocoa mb-1">Orders</h1>
      <p className="font-body text-sm text-cocoa-soft mb-6">
        Manage incoming orders and update their status in real time.
      </p>

      {loading && (
        <p className="font-body text-sm text-cocoa-soft">Loading orders...</p>
      )}

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 font-body text-sm mb-4">
          Failed to load orders: {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && orders.length === 0 && (
        <p className="font-body text-sm text-cocoa-soft">No orders yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            onCancelled={handleCancelled}
          />
        ))}
      </div>
    </div>
  );
}
