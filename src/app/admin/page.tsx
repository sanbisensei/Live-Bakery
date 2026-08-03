"use client";

import { useEffect, useState } from "react";
import { OrderRepository } from "@/lib/repositories/orderRepository";
import OrderRow from "@/components/ui/OrderRow";

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  size_label?: string;
  cakes: { name: string };
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
  payment_status: string;
  special_notes?: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const { data } = await OrderRepository.getAll();
      if (data) setOrders(data as Order[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa mb-2">Orders</h1>
      <p className="font-body text-sm text-cocoa-soft mb-6">
        Manage and update customer orders
      </p>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(
          [
            "all",
            "pending",
            "confirmed",
            "preparing",
            "delivered",
            "cancelled",
          ] as const
        ).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-xs font-semibold px-4 py-2 rounded-pill border-2 capitalize transition-colors
                ${
                  filter === s
                    ? "bg-cocoa text-cream border-cocoa"
                    : "bg-white text-cocoa border-beige-border"
                }`}
          >
            {s} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-body text-sm text-cocoa-soft">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className="font-body text-sm text-cocoa-soft">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onStatusChange={(id, status) => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === id ? { ...o, status } : o)),
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
