import { supabase } from "@/lib/supabase";

export const ReviewRepository = {
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
