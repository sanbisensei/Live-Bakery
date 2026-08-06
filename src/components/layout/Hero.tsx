// import Link from "next/link";

// export default function Hero() {
//   return (
//     <section className="px-8 py-16 bg-cream">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
//         <div>
//           <p className="font-body text-xs tracking-widest uppercase text-orange-dark mb-3">
//             Home-baked in Mohammadpur
//           </p>
//           <h1 className="font-display text-4xl md:text-5xl text-cocoa leading-tight mb-4">
//             Every slice,
//             <br />
//             made by hand
//           </h1>
//           <p className="font-body text-base text-cocoa-soft mb-6 max-w-sm">
//             Order online, pick your size, and pay when it arrives at your door.
//           </p>
//           <div className="flex gap-3">
//             <Link
//               href="/cakes"
//               className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-6 py-3"
//             >
//               Browse cakes
//             </Link>
//             <Link
//               href="/blog"
//               className="font-body text-sm font-semibold border-2 border-cocoa text-cocoa rounded-pill px-6 py-3"
//             >
//               Read the blog
//             </Link>
//           </div>
//         </div>

//         <div className="bg-beige rounded-2xl h-64 md:h-80 flex items-center justify-center">
//           <span className="font-body text-sm text-cocoa-soft">
//             [ hero cake photo ]
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTilt(maxDeg = 7) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const badge = badgeRef.current;
    if (!wrap || !card || prefersReducedMotion()) return;

    const handleMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) translateZ(0)`;
      if (badge) {
        // use the standalone `translate` property, not `transform`, so this
        // doesn't fight with the badge's own scale/rotate CSS animations
        badge.style.translate = `${px * -14}px ${py * -14}px`;
      }
    };
    const handleLeave = () => {
      card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
      if (badge) badge.style.translate = "0px 0px";
    };

    wrap.addEventListener("mousemove", handleMove);
    wrap.addEventListener("mouseleave", handleLeave);
    return () => {
      wrap.removeEventListener("mousemove", handleMove);
      wrap.removeEventListener("mouseleave", handleLeave);
    };
  }, [maxDeg]);

  return { wrapRef, cardRef, badgeRef };
}

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
    };
    const handleLeave = () => {
      el.style.transform = "translate(0, 0)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <Link ref={ref} href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Hero() {
  const { wrapRef, cardRef, badgeRef } = useTilt(7);

  return (
    <section className="relative overflow-hidden px-6 py-12 md:py-16 bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(107,68,35,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center max-w-6xl mx-auto">
        <div>
          <p className="hero-in font-body text-xs tracking-widest uppercase text-orange-dark mb-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-dark opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-dark" />
            </span>
            Home-baked in Mohammadpur
          </p>

          <h1 className="font-display text-5xl md:text-6xl text-cocoa leading-[1.05] mb-4">
            <span className="block overflow-hidden">
              <span
                className="word-in inline-block"
                style={{ animationDelay: "0.05s" }}
              >
                Every
              </span>{" "}
              <span
                className="word-in inline-block"
                style={{ animationDelay: "0.12s" }}
              >
                slice,
              </span>
            </span>
            <span className="block overflow-hidden relative w-fit">
              <span
                className="word-in inline-block italic text-orange-dark relative"
                style={{ animationDelay: "0.2s" }}
              >
                made by hand
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 20"
                  className="underline-draw absolute -bottom-2 left-0 w-full h-4 text-orange-dark"
                >
                  <path
                    d="M2 12 C 40 4, 70 18, 108 10 S 178 2, 218 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p
            className="hero-in font-body text-base text-cocoa-soft mb-6 max-w-sm"
            style={{ animationDelay: "0.32s" }}
          >
            Order online, pick your size, and pay when it arrives at your door.
          </p>

          <div
            className="hero-in flex flex-wrap gap-3 mb-6"
            style={{ animationDelay: "0.4s" }}
          >
            <MagneticLink
              href="/cakes"
              className="group font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-6 py-3 transition-shadow duration-300 hover:shadow-lg hover:shadow-cocoa/20 inline-flex items-center gap-2 will-change-transform"
            >
              Browse cakes
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M2 8h11M9 3l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </MagneticLink>
            <MagneticLink
              href="/blog"
              className="font-body text-sm font-semibold border-2 border-cocoa text-cocoa rounded-pill px-6 py-3 transition-colors duration-300 hover:bg-cocoa hover:text-cream will-change-transform"
            >
              Read the blog
            </MagneticLink>
          </div>

          <div
            className="hero-in flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-xs text-cocoa-soft"
            style={{ animationDelay: "0.48s" }}
          >
            <span className="flex items-center gap-1.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5 text-orange-dark"
              >
                <path
                  d="M8 1.5l1.9 4.2 4.6.5-3.4 3.1.9 4.5L8 11.6l-4 2.2.9-4.5-3.4-3.1 4.6-.5L8 1.5z"
                  fill="currentColor"
                />
              </svg>
              4.9 from 200+ orders
            </span>
            <span className="w-1 h-1 rounded-full bg-cocoa-soft/40" />
            <span>Same-day delivery</span>
            <span className="w-1 h-1 rounded-full bg-cocoa-soft/40" />
            <span>Pay on arrival</span>
          </div>
        </div>

        {/* image panel: curtain-reveal on load, tilts toward the cursor for depth.
            swap the inner placeholder <div> for <Image src="..." alt="..." fill className="object-cover" />
            — the reveal-mask and tilt wrappers around it don't need to change. */}
        <div
          ref={wrapRef}
          className="relative"
          style={{ perspective: "900px" }}
        >
          {/* clip-path curtain reveal lives on this inner wrapper only, so it never
              clips the badge below, which intentionally sits outside the card's edges */}
          <div className="reveal-mask">
            <div
              ref={cardRef}
              className="relative bg-beige rounded-2xl h-64 md:h-[22rem] flex items-center justify-center overflow-hidden transition-transform duration-300 ease-out will-change-transform"
            >
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-orange-dark/10"
              />
              <div
                aria-hidden="true"
                className="absolute -left-8 -bottom-12 w-48 h-48 rounded-full bg-cocoa/10"
              />

              <div className="relative flex flex-col items-center">
                <div className="w-52 h-12 rounded-[50%] bg-cream border-4 border-cocoa/15 shadow-sm" />
                <div className="-mt-4 w-60 h-20 rounded-2xl bg-cream border-4 border-cocoa/15" />
                <div className="-mt-4 w-72 h-24 rounded-2xl bg-orange-dark/15 border-4 border-cocoa/15" />
                <div
                  aria-hidden="true"
                  className="crumb absolute -top-8 left-3 w-2.5 h-2.5 rounded-full bg-orange-dark/50"
                />
                <div
                  aria-hidden="true"
                  className="crumb crumb-delay-1 absolute -top-3 right-1 w-2 h-2 rounded-full bg-cocoa/40"
                />
                <div
                  aria-hidden="true"
                  className="crumb crumb-delay-2 absolute top-6 -left-9 w-2.5 h-2.5 rounded-full bg-orange-dark/40"
                />
              </div>
            </div>
          </div>

          <div
            ref={badgeRef}
            className="badge-pop spin-slow absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-cream border border-cocoa/20 shadow-md flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <path
                  id="stampCircle"
                  d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                />
              </defs>
              <text
                className="font-body"
                fontSize="8.2"
                letterSpacing="1.5"
                fill="#6B4423"
              >
                <textPath href="#stampCircle" startOffset="0%">
                  FRESH BAKED DAILY • FRESH BAKED DAILY •
                </textPath>
              </text>
              <circle
                cx="50"
                cy="50"
                r="14"
                fill="none"
                stroke="#D97B3F"
                strokeWidth="1.5"
              />
              <path
                d="M42 52 l6 6 12-14"
                fill="none"
                stroke="#D97B3F"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wordRise {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes underlineDraw {
          from { stroke-dashoffset: 240; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes curtainReveal {
          from { clip-path: inset(0 0 100% 0); }
          to { clip-path: inset(0 0 0% 0); }
        }
        @keyframes crumbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spinSlow {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }
        @keyframes badgePop {
          from { opacity: 0; scale: 0.4; }
          to { opacity: 1; scale: 1; }
        }
        .badge-pop {
          animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.75s both;
        }
        .hero-in {
          animation: heroRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .word-in {
          animation: wordRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .underline-draw {
          stroke-dasharray: 240;
          stroke-dashoffset: 240;
          animation: underlineDraw 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
        }
        .reveal-mask {
          animation: curtainReveal 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.15s both;
        }
        .crumb { animation: crumbFloat 3.2s ease-in-out infinite; }
        .crumb-delay-1 { animation-delay: 0.6s; }
        .crumb-delay-2 { animation-delay: 1.1s; }
        .spin-slow { animation: spinSlow 18s linear infinite; animation-delay: 1.35s; }
        @media (prefers-reduced-motion: reduce) {
          .hero-in, .word-in, .underline-draw, .reveal-mask, .crumb, .spin-slow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
