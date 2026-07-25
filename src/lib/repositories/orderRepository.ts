// Facade Pattern

import { supabase } from "@/lib/supabase";

export const OrderRepository = {
  async create(order: {
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    delivery_date: string;
    special_notes?: string;
    delivery_type: "standard" | "fast";
    delivery_fee: number;
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    promo_code_id?: string;
    user_id?: string;
  }) {
    const { data, error } = await supabase
      .from("orders")
      .insert({ ...order, payment_method: "cod" })
      .select()
      .single();

    return { data, error };
  },

  async addItems(
    orderId: string,
    items: {
      cake_id: string;
      cake_size_id?: string;
      size_label?: string;
      quantity: number;
      unit_price: number;
    }[],
  ) {
    const { error } = await supabase
      .from("order_items")
      .insert(items.map((item) => ({ ...item, order_id: orderId })));

    return { error };
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(", order_items(, cakes(name))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async getAll() {
    const { data, error } = await supabase
      .from("orders")
      .select(", order_items(, cakes(name))")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async updateStatus(
    orderId: string,
    status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled",
  ) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    return { error };
  },
};
