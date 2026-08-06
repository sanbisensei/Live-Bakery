import { supabase } from "@/lib/supabase";

export const PromoRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async create(promo: {
    code: string;
    discount_pct: number;
    max_uses?: number;
    expires_at?: string;
    is_active?: boolean;
  }) {
    const { data, error } = await supabase
      .from("promo_codes")
      .insert(promo)
      .select()
      .single();

    return { data, error };
  },

  async update(
    id: string,
    updates: {
      code?: string;
      discount_pct?: number;
      max_uses?: number | null;
      expires_at?: string | null;
      is_active?: boolean;
    },
  ) {
    const { data, error } = await supabase
      .from("promo_codes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    return { error };
  },
};
