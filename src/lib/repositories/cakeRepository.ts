import { supabase } from "@/lib/supabase";

export const CakeRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("cakes")
      .select("*, cake_images(*), cake_sizes(*)")
      .eq("is_available", true);

    return { data, error };
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from("cakes")
      .select("*, cake_images(*), cake_sizes(*)")
      .eq("is_featured", true)
      .eq("is_available", true);

    return { data, error };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("cakes")
      .select(
        `
        *,
        cake_images(*),
        cake_sizes(*),
        categories(name),
        reviews(
          id,
          rating,
          message,
          created_at,
          profiles(full_name)
        )
      `,
      )
      .eq("slug", slug)
      .single();

    return { data, error };
  },
};
