"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ReviewRepository } from "@/lib/repositories/reviewRepository";

type Review = {
  id: string;
  rating: number;
  message: string;
  created_at: string;
  profiles: { full_name: string } | null;
  cakes: { name: string; slug: string } | null;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await ReviewRepository.getAll();
      if (error) {
        setErrorMsg(error.message);
      } else {
        setReviews((data as Review[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-8 py-14">
      <p className="font-body text-xs tracking-widest uppercase text-orange-dark mb-1">
        What people are saying
      </p>
      <h1 className="font-display text-3xl text-cocoa mb-8">
        Customer reviews
      </h1>

      {loading && (
        <p className="font-body text-sm text-cocoa-soft">Loading reviews...</p>
      )}

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 font-body text-sm mb-4">
          Failed to load reviews: {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && reviews.length === 0 && (
        <p className="font-body text-sm text-cocoa-soft">
          No reviews yet — be the first to order and leave one!
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-beige-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-beige border border-beige-border flex items-center justify-center font-body text-sm font-semibold text-cocoa">
                  {review.profiles?.full_name?.[0] ?? "?"}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-cocoa">
                    {review.profiles?.full_name ?? "Customer"}
                  </p>
                  <p className="text-orange text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-cocoa-soft leading-relaxed mb-3">
                {review.message}
              </p>

              {review.cakes && (
                <Link
                  href={`/cakes/${review.cakes.slug}`}
                  className="font-body text-xs font-semibold text-orange-dark"
                >
                  On {review.cakes.name} →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
