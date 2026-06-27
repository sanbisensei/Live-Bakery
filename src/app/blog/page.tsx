const dummyPosts = [
  {
    slug: "perfect-chocolate-ganache",
    title: "The secret to perfect chocolate ganache",
    tag: "Recipe",
    date: "Mar 10, 2025",
  },
  {
    slug: "storing-cakes-properly",
    title: "How to store your cake so it stays fresh",
    tag: "Tips",
    date: "Apr 2, 2025",
  },
  {
    slug: "our-baking-story",
    title: "How Afsana's Kitchen started",
    tag: "Story",
    date: "May 18, 2025",
  },
];

export default function BlogPage() {
  return (
    <div className="px-8 py-12 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl text-cocoa mb-8">
        From the kitchen
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dummyPosts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-white border border-beige-border rounded-2xl overflow-hidden block"
          >
            <div className="bg-beige h-36 flex items-center justify-center">
              <span className="font-body text-xs text-cocoa-soft">
                [ post image ]
              </span>
            </div>
            <div className="p-4">
              <span className="font-body text-xs border border-cocoa-soft text-cocoa-soft rounded-pill px-2 py-0.5">
                {post.tag}
              </span>
              <h3 className="font-display text-base text-cocoa mt-3 mb-2 leading-snug">
                {post.title}
              </h3>
              <p className="font-body text-xs text-cocoa-soft">{post.date}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
