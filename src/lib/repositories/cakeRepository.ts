// import { supabase } from "@/lib/supabase";

// export const CakeRepository = {
//   async getAll() {
//     const { data, error } = await supabase
//       .from("cakes")
//       .select("*, cake_images(*), cake_sizes(*)")
//       .eq("is_available", true);

//     return { data, error };
//   },

//   async getFeatured() {
//     const { data, error } = await supabase
//       .from("cakes")
//       .select("*, cake_images(*), cake_sizes(*)")
//       .eq("is_featured", true)
//       .eq("is_available", true);

//     return { data, error };
//   },

//   async getBySlug(slug: string) {
//     const { data, error } = await supabase
//       .from("cakes")
//       .select(
//         `
//         *,
//         cake_images(*),
//         cake_sizes(*),
//         categories(name),
//         reviews(
//           id,
//           rating,
//           message,
//           created_at,
//           profiles(full_name)
//         )
//       `,
//       )
//       .eq("slug", slug)
//       .single();

//     return { data, error };
//   },
// };
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

  // ---- Admin methods ----

  async getAllAdmin() {
    const { data, error } = await supabase
      .from("cakes")
      .select("*, cake_images(*), cake_sizes(*), categories(name)")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async create(cake: {
    name: string;
    slug: string;
    base_price: number;
    category_id?: string;
    description?: string;
    discount_pct?: number;
    is_available?: boolean;
    is_featured?: boolean;
  }) {
    const { data, error } = await supabase
      .from("cakes")
      .insert(cake)
      .select()
      .single();

    return { data, error };
  },

  async update(
    id: string,
    updates: {
      name?: string;
      slug?: string;
      base_price?: number;
      category_id?: string | null;
      description?: string;
      discount_pct?: number;
      is_available?: boolean;
      is_featured?: boolean;
    },
  ) {
    const { data, error } = await supabase
      .from("cakes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("cakes").delete().eq("id", id);
    return { error };
  },

  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    return { data, error };
  },
};

export const CakeImageRepository = {
  async add(image: {
    cake_id: string;
    url: string;
    is_primary?: boolean;
    sort_order?: number;
  }) {
    const { data, error } = await supabase
      .from("cake_images")
      .insert(image)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("cake_images").delete().eq("id", id);
    return { error };
  },

  async setPrimary(cakeId: string, imageId: string) {
    // Unset any existing primary image for this cake, then set the new one
    await supabase
      .from("cake_images")
      .update({ is_primary: false })
      .eq("cake_id", cakeId);

    const { error } = await supabase
      .from("cake_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    return { error };
  },
};

export const CakeSizeRepository = {
  async add(size: { cake_id: string; label: string; price_add?: number }) {
    const { data, error } = await supabase
      .from("cake_sizes")
      .insert(size)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: { label?: string; price_add?: number }) {
    const { data, error } = await supabase
      .from("cake_sizes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("cake_sizes").delete().eq("id", id);
    return { error };
  },
};
