import Link from "next/link";

type CakeCardProps = {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
};

export default function CakeCard({
  slug,
  name,
  price,
  originalPrice,
}: CakeCardProps) {
  return (
    <div className="bg-white border border-beige-border rounded-2xl overflow-hidden">
      <div className="bg-beige h-32 flex items-center justify-center">
        <span className="font-body text-xs text-cocoa-soft">
          [ cake photo ]
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-cocoa mb-1">{name}</h3>

        <div className="flex items-baseline gap-2 mb-3">
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
          <button className="flex-1 font-body text-xs font-semibold bg-orange text-cocoa rounded-pill py-2">
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
