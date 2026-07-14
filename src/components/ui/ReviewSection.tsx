"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Review = {
  id: string;
  rating: number;
  message: string;
  created_at: string;
  profiles: { full_name: string };
};

export default function ReviewSection({
  reviews,
  cakeId,
}: {
  reviews: Review[];
  cakeId: string;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("reviews").insert({
      cake_id: cakeId,
      user_id: session.user.id,
      rating,
      message,
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-cocoa mb-6">
        Customer reviews
      </h2>

      {/* Review list */}
      {reviews?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                {review.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-body text-sm text-cocoa-soft mb-8">
          No reviews yet — be the first!
        </p>
      )}

      {/* Leave a review */}
      <div className="bg-white border border-beige-border rounded-2xl p-6 max-w-lg">
        <h3 className="font-display text-lg text-cocoa mb-4">Leave a review</h3>

        {!isLoggedIn ? (
          <p className="font-body text-sm text-cocoa-soft">
            You need to{" "}
            <a href="/login" className="text-orange-dark font-semibold">
              login
            </a>{" "}
            to leave a review.
          </p>
        ) : submitted ? (
          <p className="font-body text-sm text-pistachio font-semibold">
            ✓ Thank you for your review!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="font-body text-xs text-cocoa-soft mb-2">
                Your rating
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-orange" : "text-cocoa-soft"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Message
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream resize-none"
              />
            </div>

            {error && <p className="font-body text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill py-3 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
