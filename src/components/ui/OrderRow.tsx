"use client";

import { useState } from "react";
import { OrderRepository } from "@/lib/repositories/orderRepository";
import { useOrderStatus } from "@/hooks/useOrderStatus";

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
  special_notes?: string;
  created_at: string;
  order_items: OrderItem[];
};

type Props = {
  order: Order;
  onStatusChange: (id: string, status: string) => void;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  preparing: "bg-orange-100 text-orange-800 border-orange-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function OrderRow({ order, onStatusChange }: Props) {
  // Observer pattern — this component observes this specific order in real time
  const status = useOrderStatus(order.id, order.status);
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(
    newStatus:
      | "pending"
      | "confirmed"
      | "preparing"
      | "delivered"
      | "cancelled",
  ) {
    setUpdating(true);
    const { error } = await OrderRepository.updateStatus(order.id, newStatus);
    if (!error) {
      onStatusChange(order.id, newStatus);
    }
    setUpdating(false);
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-beige-border rounded-2xl p-5">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-body text-xs text-cocoa-soft font-mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span
              className={`font-body text-xs font-semibold px-3 py-1 rounded-pill border capitalize ${statusColors[status] ?? ""}`}
            >
              {status}
            </span>
          </div>
          <p className="font-display text-lg text-cocoa">
            {order.customer_name}
          </p>
          <p className="font-body text-xs text-cocoa-soft">
            {order.customer_phone} · {formattedDate}
          </p>
        </div>

        <div className="text-right">
          <p className="font-body text-lg font-semibold text-orange-dark">
            ৳{order.total_amount}
          </p>
          <p className="font-body text-xs text-cocoa-soft capitalize">
            {order.delivery_type} delivery · ৳{order.delivery_fee}
          </p>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-beige rounded-xl p-3 mb-4">
        {order.order_items?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between font-body text-sm text-cocoa"
          >
            <span>
              {item.cakes?.name}
              {item.size_label && (
                <span className="text-cocoa-soft"> · {item.size_label}</span>
              )}
              <span className="text-cocoa-soft"> × {item.quantity}</span>
            </span>
            <span>৳{item.unit_price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Delivery address */}
      <p className="font-body text-xs text-cocoa-soft mb-4">
        📍 {order.delivery_address} · Deliver by{" "}
        {new Date(order.delivery_date).toLocaleDateString("en-BD", {
          month: "short",
          day: "numeric",
        })}
      </p>

      {order.special_notes && (
        <p className="font-body text-xs text-cocoa-soft mb-4">
          📝 {order.special_notes}
        </p>
      )}

      {/* Status update buttons */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            "pending",
            "confirmed",
            "preparing",
            "delivered",
            "cancelled",
          ] as const
        ).map((s) => (
          <button
            key={s}
            disabled={updating || status === s}
            onClick={() => handleStatusChange(s)}
            className={`font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 capitalize transition-colors disabled:opacity-40
                ${
                  status === s
                    ? "bg-cocoa text-cream border-cocoa"
                    : "bg-white text-cocoa border-beige-border hover:border-cocoa"
                }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
