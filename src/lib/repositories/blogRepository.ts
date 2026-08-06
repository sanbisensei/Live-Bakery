// import { supabase } from "@/lib/supabase";

// export const BlogRepository = {
//   async getAll() {
//     const { data, error } = await supabase
//       .from("blog_posts")
//       .select("id, title, slug, cover_image, tag, published_at")
//       .eq("is_published", true)
//       .order("published_at", { ascending: false });

//     return { data, error };
//   },

//   async getBySlug(slug: string) {
//     console.log("Looking up slug:", JSON.stringify(slug));
//     const { data, error } = await supabase
//       .from("blog_posts")
//       .select("*, profiles(full_name)")
//       .eq("slug", slug)
//       .eq("is_published", true)
//       .single();
//     console.log("Result data:", data, "Result error:", error);
//     return { data, error };
//   },
// };
import { supabase } from "@/lib/supabase";

export const BlogRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, cover_image, tag, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    return { data, error };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, profiles(full_name)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    return { data, error };
  },

  // ---- Admin methods ----

  async getAllAdmin() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async create(post: {
    title: string;
    slug: string;
    content?: string;
    cover_image?: string;
    tag?: string;
    is_published?: boolean;
    published_at?: string;
    author_id?: string;
  }) {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(post)
      .select()
      .single();

    return { data, error };
  },

  async update(
    id: string,
    updates: {
      title?: string;
      slug?: string;
      content?: string;
      cover_image?: string;
      tag?: string;
      is_published?: boolean;
      published_at?: string | null;
    },
  ) {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    return { error };
  },
};
