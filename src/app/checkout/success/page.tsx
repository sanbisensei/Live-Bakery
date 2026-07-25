import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎂</div>
        <h1 className="font-display text-3xl text-cocoa mb-3">Order placed!</h1>
        <p className="font-body text-sm text-cocoa-soft leading-relaxed mb-8">
          Thank you for your order. Afsana will confirm it shortly. You will pay
          in cash when your cake arrives.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/cakes"
            className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill px-6 py-3"
          >
            Order more cakes
          </Link>
          <Link
            href="/"
            className="font-body text-sm font-semibold border-2 border-cocoa text-cocoa rounded-pill px-6 py-3"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
