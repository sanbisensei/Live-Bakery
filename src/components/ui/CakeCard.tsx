import Link from "next/link";
("use client");

import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import Toast from "@/components/ui/Toast";
type CakeCardProps = {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
};

export default function CakeCard({
  slug,
  name,
  price,
  originalPrice,
  imageUrl,
}: CakeCardProps) {
  return (
    <div className="bg-white border border-beige-border rounded-2xl overflow-hidden">
      <div className="bg-beige h-48 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-body text-xs text-cocoa-soft">
            [ cake photooo ]
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-cocoa mb-1">{name}</h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-body text-base font-semibold text-orange-dark">
            ৳{price}
          </span>
          {originalPrice && (
            <span className="font-body text-sm text-cocoa-soft line-through">
              ৳{originalPrice}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              addItem({
                cakeId: id,
                cakeName: name,
                slug,
                sizeId: undefined,
                sizeLabel: undefined,
                priceAdd: 0,
                unitPrice: price,
                quantity: 1,
              });
              setShowToast(true);
            }}
            className="flex-1 font-body text-xs font-semibold bg-orange text-cocoa rounded-pill py-2"
          >
            Add to order
          </button>
          <Link
            href={`/cakes/${slug}`}
            className="flex-1 text-center font-body text-xs font-semibold border-2 border-cocoa text-cocoa rounded-pill py-2"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
