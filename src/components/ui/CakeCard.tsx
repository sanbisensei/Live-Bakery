import Link from "next/link";
import AddToOrderButton from "@/components/ui/AddToOrderButton";

// type CakeCardProps = {
//   slug: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   imageUrl?: string;
// };
type CakeCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
};
export default function CakeCard({
  id,
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
            [ cake photo ]
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
          <AddToOrderButton
            cake={{
              id,
              name,
              slug,
              base_price: originalPrice ?? price,
              discount_pct: originalPrice
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0,
            }}
            className="flex-1 inline-flex items-center justify-center h-10
      font-body text-xs font-semibold bg-orange text-cocoa rounded-pill
      transition-colors duration-200 hover:bg-orange-dark"
          />
          <Link
            href={`/cakes/${slug}`}
            className="flex-1 inline-flex items-center justify-center h-10
      font-body text-xs font-semibold border-2 border-cocoa text-cocoa rounded-pill
      transition-colors duration-200 hover:bg-cocoa hover:text-cream"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
