import { BlogRepository } from "@/lib/repositories/blogRepository"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
  const { data: post, error } = await BlogRepository.getBySlug(params.slug)

  if (error || !post) return notFound()

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">

      {/* Breadcrumb */}
      <p className="font-body text-xs text-cocoa-soft mb-6">
        <Link href="/" className="hover:text-cocoa">Home</Link>
        {" › "}
        <Link href="/blog" className="hover:text-cocoa">Blog</Link>
        {" › "}
        {post.title}
      </p>

      {/* Tag + date */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-body text-xs border border-cocoa-soft text-cocoa-soft rounded-pill px-3 py-1">
          {post.tag}
        </span>
        {formattedDate && (
          <span className="font-body text-xs text-cocoa-soft">{formattedDate}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl text-cocoa leading-tight mb-4">
        {post.title}
      </h1>

      {/* Author */}
      {post.profiles?.full_name && (
        <p className="font-body text-sm text-cocoa-soft mb-8">
          By {post.profiles.full_name}
        </p>
      )}

      {/* Cover image */}
      {post.cover_image ? (
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl mb-8"
        />
      ) : (
        <div className="w-full h-64 bg-beige rounded-2xl flex items-center justify-center mb-8">
          <span className="font-body text-sm text-cocoa-soft">[ cover image ]</span>
        </div>
      )}

      {/* Content */}
      <div className="font-body text-base text-cocoa-soft leading-relaxed whitespace-pre-line">
        {post.content ?? "Content coming soon."}
      </div>

      {/* Back link */}
      <div className="mt-12 pt-6 border-t border-beige-border">
        <Link
          href="/blog"
          className="font-body text-sm font-semibold text-cocoa border-2 border-cocoa rounded-pill px-6 py-3"
        >
          ← Back to blog
        </Link>
      </div>

    </div>
  )
}