import { CakeRepository } from "@/lib/repositories/cakeRepository";
import CakeCard from "@/components/ui/CakeCard";

type CakeImage = {
  url: string;
};

type Cake = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  discount_pct: number;
  cake_images: CakeImage[];
};

export default async function CakesPage() {
  const { data: cakes, error } = await CakeRepository.getAll();

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-12">
        <p className="font-body text-sm text-red-500">
          Failed to load cakes. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="font-display text-3xl text-cocoa mb-2">Our Cakes</h1>
      <p className="font-body text-sm text-cocoa-soft mb-8">
        Everything is baked fresh to order in Mohammadpur.
      </p>

      {cakes && cakes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cakes.map((cake: Cake) => {
            const finalPrice =
              cake.discount_pct > 0
                ? Math.round(cake.base_price * (1 - cake.discount_pct / 100))
                : cake.base_price;

            return (
              <CakeCard
                key={cake.id}
                id={cake.id}
                slug={cake.slug}
                name={cake.name}
                price={finalPrice}
                originalPrice={
                  cake.discount_pct > 0 ? cake.base_price : undefined
                }
                imageUrl={cake.cake_images?.[0]?.url}
              />
            );
          })}
        </div>
      ) : (
        <p className="font-body text-sm text-cocoa-soft">
          No cakes available right now. Check back soon!
        </p>
      )}
    </div>
  );
}
