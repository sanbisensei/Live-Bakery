import { supabase } from "@/lib/supabase";

export const ReviewRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        message,
        created_at,
        profiles(full_name),
        cakes(name, slug)
      `,
      )
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async create(review: {
    cake_id: string;
    user_id: string;
    rating: number;
    message: string;
  }) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();

    return { data, error };
  },
};
