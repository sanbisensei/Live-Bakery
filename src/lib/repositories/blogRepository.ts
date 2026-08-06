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
