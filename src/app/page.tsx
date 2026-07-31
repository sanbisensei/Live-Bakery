import { CakeRepository } from "@/lib/repositories/cakeRepository";
import Hero from "@/components/layout/Hero";
import CakeCard from "@/components/ui/CakeCard";
import Link from "next/link";

export default async function Home() {
  const { data: featuredCakes } = await CakeRepository.getFeatured();

  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Featured Cakes */}
      <section className="max-w-6xl mx-auto px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-orange-dark mb-1">
              Fresh picks
            </p>
            <h2 className="font-display text-3xl text-cocoa">Featured cakes</h2>
          </div>
          <Link
            href="/cakes"
            className="font-body text-sm font-semibold border-2 border-cocoa text-cocoa rounded-pill px-5 py-2"
          >
            View all
          </Link>
        </div>

        {featuredCakes && featuredCakes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCakes.map(
              (cake: {
                id: string;
                slug: string;
                name: string;
                base_price: number;
                discount_pct: number;
                cake_images: { url: string }[];
              }) => {
                const finalPrice =
                  cake.discount_pct > 0
                    ? Math.round(
                        cake.base_price * (1 - cake.discount_pct / 100),
                      )
                    : cake.base_price;

                return (
                  <CakeCard
                    id={cake.id}
                    key={cake.id}
                    slug={cake.slug}
                    name={cake.name}
                    price={finalPrice}
                    originalPrice={
                      cake.discount_pct > 0 ? cake.base_price : undefined
                    }
                    imageUrl={cake.cake_images?.[0]?.url}
                  />
                );
              },
            )}
          </div>
        ) : (
          <p className="font-body text-sm text-cocoa-soft">
            No featured cakes yet — check back soon!
          </p>
        )}
      </section>

      {/* Why order from us */}
      <section className="bg-beige py-14">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-display text-3xl text-cocoa mb-10 text-center">
            Why Afsana&apos;s Kitchen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-beige-border">
              <div className="text-3xl mb-3">🎂</div>
              <h3 className="font-display text-lg text-cocoa mb-2">
                Baked fresh daily
              </h3>
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                Every cake is made the morning of delivery — no freezing, no
                shortcuts.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-beige-border">
              <div className="text-3xl mb-3">💵</div>
              <h3 className="font-display text-lg text-cocoa mb-2">
                Pay on delivery
              </h3>
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                No cards, no bKash needed. Just pay in cash when your order
                arrives.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-beige-border">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-display text-lg text-cocoa mb-2">
                Your size, your way
              </h3>
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                Choose from multiple sizes or contact us for a fully custom
                order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="max-w-6xl mx-auto px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-orange-dark mb-1">
              From the kitchen
            </p>
            <h2 className="font-display text-3xl text-cocoa">
              Recipes &amp; tips
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-body text-sm font-semibold border-2 border-cocoa text-cocoa rounded-pill px-5 py-2"
          >
            Read all
          </Link>
        </div>
        <p className="font-body text-sm text-cocoa-soft">
          Head to the blog to read Afsana&apos;s recipes and baking tips.
        </p>
      </section>
    </main>
  );
}
