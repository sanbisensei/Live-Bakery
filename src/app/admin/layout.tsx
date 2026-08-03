import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-cocoa text-cream flex flex-col px-4 py-8 shrink-0">
        <div className="font-display text-lg mb-1">Admin Panel</div>
        <div className="font-body text-xs text-cocoa-soft mb-8">
          Afsana&apos;s Kitchen
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/admin"
            className="font-body text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            📦 Orders
          </Link>
          <Link
            href="/admin/cakes"
            className="font-body text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            🎂 Cakes
          </Link>
          <Link
            href="/admin/blog"
            className="font-body text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            📝 Blog
          </Link>
          <Link
            href="/admin/promos"
            className="font-body text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            🏷️ Promos
          </Link>
        </nav>

        <div className="mt-auto">
          <Link
            href="/"
            className="font-body text-xs text-cocoa-soft hover:text-cream transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-cream px-8 py-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
