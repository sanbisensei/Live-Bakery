import { BlogRepository } from "@/lib/repositories/blogRepository";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  tag: string | null;
  published_at: string | null;
};

export default async function BlogPage() {
  const { data: posts, error } = await BlogRepository.getAll();

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-12">
        <p className="font-body text-sm text-red-500">
          Failed to load posts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <p className="font-body text-xs tracking-widest uppercase text-orange-dark mb-1">
        From the kitchen
      </p>
      <h1 className="font-display text-3xl text-cocoa mb-2">
        Recipes &amp; tips
      </h1>
      <p className="font-body text-sm text-cocoa-soft mb-10">
        Afsana shares her favourite recipes, baking tips, and stories.
      </p>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: BlogPost) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white border border-beige-border rounded-2xl overflow-hidden block hover:shadow-sm transition-shadow"
            >
              {/* Cover image */}
              <div className="bg-beige h-44 flex items-center justify-center overflow-hidden">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-body text-xs text-cocoa-soft">
                    [ post image ]
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {post.tag && (
                  <span className="font-body text-xs border border-cocoa-soft text-cocoa-soft rounded-pill px-3 py-1">
                    {post.tag}
                  </span>
                )}
                <h3 className="font-display text-lg text-cocoa mt-3 mb-2 leading-snug">
                  {post.title}
                </h3>
                {post.published_at && (
                  <p className="font-body text-xs text-cocoa-soft">
                    {new Date(post.published_at).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="font-body text-sm text-cocoa-soft">
          No posts yet — check back soon!
        </p>
      )}
    </div>
  );
}
