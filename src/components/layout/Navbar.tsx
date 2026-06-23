import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-cream border-b border-beige-border">
      <Link href="/" className="font-display text-xl font-semibold text-cocoa">
        Afsana&apos;s Kitchen
      </Link>

      <nav className="flex gap-6 font-body text-sm text-cocoa-soft">
        <Link href="/cakes">Cakes</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/reviews">Reviews</Link>
        <Link href="/custom-cake">Custom cake</Link>
      </nav>

      <div className="flex gap-3">
        <Link
          href="/login"
          className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2"
        >
          Login
        </Link>
        <Link
          href="/cakes"
          className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill px-5 py-2"
        >
          Order now
        </Link>
      </div>
    </header>
  );
}
