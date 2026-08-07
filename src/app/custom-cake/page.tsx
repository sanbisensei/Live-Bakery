"use client";

import { useEffect, useState } from "react";
import { CakeRepository } from "@/lib/repositories/cakeRepository";

// TODO: replace with the real business WhatsApp number, digits only, country code first (no + or spaces)
const WHATSAPP_NUMBER = "8801XXXXXXXXX";

type CakeImage = { url: string };
type Cake = { id: string; name: string; cake_images: CakeImage[] };

const FALLBACK_COUNT = 10;

function buildWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function GalleryColumn({
  images,
  direction,
  duration,
}: {
  images: string[];
  direction: "up" | "down";
  duration: number;
}) {
  // Duplicate the list once so the CSS loop is seamless
  const loop = [...images, ...images];

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${
          direction === "up" ? "animate-drift-up" : "animate-drift-down"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((url, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-beige shrink-0 aspect-[3/4]"
          >
            {url ? (
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🎂
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CustomCakePage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await CakeRepository.getAll();
      const cakes = (data as Cake[]) ?? [];
      const urls = cakes
        .flatMap((c) => c.cake_images?.map((img) => img.url) ?? [])
        .filter(Boolean);
      setImages(urls);
      setLoading(false);
    }
    load();
  }, []);

  // Split real photos across 3 columns; pad with empty slots (🎂 placeholder) if the catalog is thin
  const padded =
    images.length > 0
      ? images
      : Array.from({ length: FALLBACK_COUNT }, () => "");

  const col1 = padded.filter((_, i) => i % 3 === 0);
  const col2 = padded.filter((_, i) => i % 3 === 1);
  const col3 = padded.filter((_, i) => i % 3 === 2);

  const whatsappMessage =
    "Hi Afsana's Kitchen! I'd like to talk about a custom cake order.";

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: copy */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-orange-dark mb-3">
              Made to order
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-cocoa leading-tight mb-5">
              Tell us the occasion.
              <br />
              We&apos;ll bake the rest.
            </h1>
            <p className="font-body text-base text-cocoa-soft leading-relaxed mb-8 max-w-md">
              Every custom order at Afsana&apos;s Kitchen starts as a
              conversation, not a form. Send a reference photo, a flavor
              craving, or just a vague idea — we&apos;ll shape it into a cake
              from there.
            </p>
            <a
              href={buildWhatsappLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold bg-pistachio text-cream rounded-pill px-6 py-3.5 hover:opacity-90 transition-opacity"
            >
              Chat with us on WhatsApp
            </a>
            <p className="font-body text-xs text-cocoa-soft mt-4">
              Usually replies within a few hours · Dhaka Uddan, Mohammadpur
            </p>
          </div>

          {/* Right: living gallery */}
          <div
            className="h-[420px] md:h-[520px] grid grid-cols-3 gap-4"
            aria-hidden="true"
          >
            {!loading && (
              <>
                <GalleryColumn images={col1} direction="up" duration={32} />
                <GalleryColumn images={col2} direction="down" duration={26} />
                <GalleryColumn images={col3} direction="up" duration={38} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbered steps are earned here */}
      <section className="bg-beige py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-display text-3xl text-cocoa mb-10 text-center">
            How a custom cake comes together
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-beige-border">
              <span className="font-display text-3xl text-orange-dark">01</span>
              <h3 className="font-display text-lg text-cocoa mt-3 mb-2">
                Share your idea
              </h3>
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                Message us on WhatsApp with the occasion, flavor, size, and any
                photos you&apos;d like us to draw inspiration from.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-beige-border">
              <span className="font-display text-3xl text-orange-dark">02</span>
              <h3 className="font-display text-lg text-cocoa mt-3 mb-2">
                We quote &amp; confirm
              </h3>
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                We&apos;ll send a price and delivery date. Once you confirm,
                your slot is booked and baking begins.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-beige-border">
              <span className="font-display text-3xl text-orange-dark">03</span>
              <h3 className="font-display text-lg text-cocoa mt-3 mb-2">
                Pick up or delivery
              </h3>
              <p className="font-body text-sm text-cocoa-soft leading-relaxed">
                Baked fresh the morning of, then handed to you in Mohammadpur or
                delivered to your door. Pay in cash on arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-6xl mx-auto px-8 py-16 text-center">
        <h2 className="font-display text-3xl text-cocoa mb-3">
          Ready to talk cake?
        </h2>
        <p className="font-body text-sm text-cocoa-soft mb-8">
          No form to fill out — just say hello.
        </p>
        <a
          href={buildWhatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-6 py-3.5 hover:opacity-90 transition-opacity"
        >
          Chat with us on WhatsApp
        </a>
      </section>
    </main>
  );
}
