"use client";

import { useEffect, useState } from "react";
import { CakeRepository } from "@/lib/repositories/cakeRepository";
import AddToOrderButton from "@/components/ui/AddToOrderButton";
import SizeSelector from "@/components/ui/sizeSelector";
import ReviewSection from "@/components/ui/ReviewSection";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

type Size = {
  id: string;
  label: string;
  price_add: number;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default function CakeDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [cake, setCake] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await CakeRepository.getBySlug(slug);
      if (error || !data) {
        setLoading(false);
        return;
      }
      setCake(data);
      if (data.cake_sizes?.length > 0) {
        setSelectedSize(data.cake_sizes[0]);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20 text-center">
        <p className="font-body text-sm text-cocoa-soft">Loading...</p>
      </div>
    );
  }

  if (!cake) return notFound();

  const discountedPrice =
    cake.discount_pct > 0
      ? Math.round(cake.base_price * (1 - cake.discount_pct / 100))
      : null;

  const averageRating =
    cake.reviews?.length > 0
      ? (
          cake.reviews.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0,
          ) / cake.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Breadcrumb */}
      <p className="font-body text-xs text-cocoa-soft mb-6">
        <Link href="/" className="hover:text-cocoa">
          Home
        </Link>
        {" › "}
        <Link href="/cakes" className="hover:text-cocoa">
          Cakes
        </Link>
        {" › "}
        {cake.name}
      </p>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {/* Left: image */}
        <div className="bg-beige rounded-2xl h-72 md:h-96 flex items-center justify-center overflow-hidden">
          {cake.cake_images?.[0]?.url ? (
            <img
              src={cake.cake_images[0].url}
              alt={cake.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <span className="font-body text-sm text-cocoa-soft">
              [ no photo yet ]
            </span>
          )}
        </div>

        {/* Right: info */}
        <div className="flex flex-col gap-4">
          {cake.categories?.name && (
            <span className="font-body text-xs border border-cocoa-soft text-cocoa-soft rounded-pill px-3 py-1 w-fit">
              {cake.categories.name}
            </span>
          )}

          <h1 className="font-display text-3xl text-cocoa leading-tight">
            {cake.name}
          </h1>

          {averageRating && (
            <div className="flex items-center gap-2">
              <span className="text-orange text-lg">
                {"★".repeat(Math.round(Number(averageRating)))}
                {"☆".repeat(5 - Math.round(Number(averageRating)))}
              </span>
              <span className="font-body text-sm text-cocoa-soft">
                {averageRating} · {cake.reviews.length} review
                {cake.reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="font-body text-2xl font-semibold text-orange-dark">
              ৳{discountedPrice ?? cake.base_price}
            </span>
            {discountedPrice && (
              <>
                <span className="font-body text-base text-cocoa-soft line-through">
                  ৳{cake.base_price}
                </span>
                <span className="font-body text-xs border border-pistachio text-pistachio rounded-pill px-2 py-0.5">
                  {cake.discount_pct}% off
                </span>
              </>
            )}
          </div>

          {cake.description && (
            <p className="font-body text-sm text-cocoa-soft leading-relaxed">
              {cake.description}
            </p>
          )}

          {cake.cake_sizes?.length > 0 && (
            <SizeSelector
              sizes={cake.cake_sizes}
              onSelect={(size) => setSelectedSize(size)}
            />
          )}

          <AddToOrderButton
            cake={cake}
            selectedSizeId={selectedSize?.id}
            selectedSizeLabel={selectedSize?.label}
            selectedPriceAdd={selectedSize?.price_add}
          />
        </div>
      </div>

      <ReviewSection reviews={cake.reviews} cakeId={cake.id} />
    </div>
  );
}
