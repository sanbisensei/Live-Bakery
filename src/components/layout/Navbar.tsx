"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        setUserName(
          session.user.user_metadata.full_name ||
            profile?.full_name ||
            session.user.email ||
            "Account",
        );
      }
      setLoading(false);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

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

      <div className="flex gap-3 items-center">
        {loading ? null : userName ? (
          <>
            <span className="font-body text-sm font-semibold text-cocoa">
              Hi, {userName.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2"
          >
            Login
          </Link>
        )}
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
