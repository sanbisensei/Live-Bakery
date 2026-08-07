// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useCart } from "@/lib/cartContext";

// export default function Navbar() {
//   const [userName, setUserName] = useState<string | null>(null);
//   const [mounted, setMounted] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { count } = useCart();

//   useEffect(() => {
//     async function init() {
//       const { data } = await supabase.auth.getSession();

//       if (data.session?.user) {
//         const { data: profile } = await supabase
//           .from("profiles")
//           .select("full_name , role")
//           .eq("id", data.session.user.id)
//           .single();

//         setUserName(profile?.full_name || data.session.user.email || "Account");
//         setIsAdmin(profile?.role === "admin");
//       }

//       // Set mounted after async work — avoids synchronous setState in effect
//       setMounted(true);
//     }

//     init();

//     const { data: listener } = supabase.auth.onAuthStateChange(() => {
//       init();
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   async function handleLogout() {
//     await supabase.auth.signOut();
//     window.location.href = "/";
//   }

//   return (
//     <header className="flex items-center justify-between px-8 py-4 bg-cream border-b border-beige-border">
//       <Link href="/" className="font-display text-xl font-semibold text-cocoa">
//         Afsana&apos;s Kitchen
//       </Link>

//       <nav className="flex gap-6 font-body text-sm text-cocoa-soft">
//         <Link href="/cakes">Cakes</Link>
//         <Link href="/blog">Blog</Link>
//         <Link href="/reviews">Reviews</Link>
//         <Link href="/custom-cake">Custom cake</Link>
//       </nav>

//       <div className="flex gap-3 items-center">
//         {mounted && userName ? (
//           <>
//             <span className="font-body text-sm font-semibold text-cocoa">
//               Hi, {userName.split(" ")[0]}
//             </span>
//             <button
//               onClick={handleLogout}
//               className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2"
//             >
//               Logout
//             </button>
//           </>
//         ) : mounted && !userName ? (
//           <Link
//             href="/login"
//             className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2"
//           >
//             Login
//           </Link>
//         ) : null}
//         {mounted && isAdmin && (
//           <Link
//             href="/admin"
//             className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2"
//           >
//             Admin
//           </Link>
//         )}
//         <Link
//           href="/checkout"
//           className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill px-5 py-2"
//         >
//           Order now {mounted && count > 0 ? `(${count})` : ""}
//         </Link>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cartContext";

const NAV_LINKS = [
  { href: "/cakes", label: "Cakes" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/custom-cake", label: "Custom cake" },
];

export default function Navbar() {
  // --- original state, untouched ---
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { count } = useCart();

  // --- UI-only additions: current route for the active-link underline,
  // and scroll position for the header shadow. Neither reads or writes
  // any auth/cart/admin state above. ---
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name , role")
          .eq("id", data.session.user.id)
          .single();

        setUserName(profile?.full_name || data.session.user.email || "Account");
        setIsAdmin(profile?.role === "admin");
      }

      // Set mounted after async work — avoids synchronous setState in effect
      setMounted(true);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      init();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // UI-only effect: tracks scroll position for the header shadow.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // UI-only effect: close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-cream border-b transition-[box-shadow,border-color] duration-300 ease-out ${
        scrolled
          ? "border-beige-border shadow-sm shadow-cocoa/5"
          : "border-transparent shadow-none"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-10 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-cocoa transition-opacity duration-200 hover:opacity-80"
        >
          Afsana&apos;s Kitchen
        </Link>

        <nav className="hidden md:flex gap-8 font-body text-sm text-cocoa-soft">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-1 transition-colors duration-200 ${
                  active ? "text-cocoa" : "hover:text-cocoa"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-orange-dark transition-all duration-300 ease-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex gap-3 items-center">
          {mounted && userName ? (
            <>
              <span className="hidden lg:inline font-body text-sm font-semibold text-cocoa">
                Hi, {userName.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2 transition-colors duration-300 hover:bg-cocoa hover:text-cream"
              >
                Logout
              </button>
            </>
          ) : mounted && !userName ? (
            <Link
              href="/login"
              className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2 transition-colors duration-300 hover:bg-cocoa hover:text-cream"
            >
              Login
            </Link>
          ) : null}
          {mounted && isAdmin && (
            <Link
              href="/admin"
              className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2 transition-opacity duration-300 hover:opacity-85"
            >
              Admin
            </Link>
          )}
          <Link
            href="/checkout"
            className="group relative font-body text-sm font-semibold bg-orange text-cocoa rounded-pill px-5 py-2 transition-colors duration-300 hover:bg-orange-dark inline-flex items-center gap-1.5"
          >
            Order now
            {mounted && count > 0 && (
              <span
                key={count}
                className="cart-pop inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-cocoa text-cream text-xs font-semibold"
              >
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* mobile: order button stays visible, hamburger toggles the drawer below */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/checkout"
            className="relative font-body text-sm font-semibold bg-orange text-cocoa rounded-pill px-4 py-2 transition-colors duration-300 hover:bg-orange-dark inline-flex items-center gap-1.5"
          >
            Order now
            {mounted && count > 0 && (
              <span
                key={count}
                className="cart-pop inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-cocoa text-cream text-[11px] font-semibold"
              >
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="relative w-9 h-9 flex items-center justify-center text-cocoa"
          >
            <span
              className={`absolute h-[1.5px] w-5 bg-cocoa transition-all duration-300 ease-out ${
                mobileOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-cocoa transition-all duration-200 ease-out ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-cocoa transition-all duration-300 ease-out ${
                mobileOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t ${
          mobileOpen
            ? "max-h-96 opacity-100 border-beige-border"
            : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 font-body text-sm text-cocoa-soft">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2.5 border-b border-beige-border last:border-b-0 transition-colors duration-200 ${
                  active ? "text-cocoa font-semibold" : "hover:text-cocoa"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="flex flex-col gap-2 pt-3">
            {mounted && userName ? (
              <>
                <span className="font-body text-sm font-semibold text-cocoa px-0.5">
                  Hi, {userName.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2 transition-colors duration-300 hover:bg-cocoa hover:text-cream text-left"
                >
                  Logout
                </button>
              </>
            ) : mounted && !userName ? (
              <Link
                href="/login"
                className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2 transition-colors duration-300 hover:bg-cocoa hover:text-cream text-center"
              >
                Login
              </Link>
            ) : null}
            {mounted && isAdmin && (
              <Link
                href="/admin"
                className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2 text-center"
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      </div>

      <style>{`
        @keyframes cartPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .cart-pop {
          animation: cartPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cart-pop { animation: none; }
        }
      `}</style>
    </header>
  );
}
