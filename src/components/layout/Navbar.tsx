"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useCart } from "@/lib/cartContext"

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.session.user.id)
          .single()

        setUserName(
          profile?.full_name || data.session.user.email || "Account"
        )
      }

      // Set mounted after async work — avoids synchronous setState in effect
      setMounted(true)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      init()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/"
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
        {mounted && userName ? (
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
        ) : mounted && !userName ? (
          <Link
            href="/login"
            className="font-body text-sm font-semibold border border-cocoa text-cocoa rounded-pill px-5 py-2"
          >
            Login
          </Link>
        ) : null}

        <Link
          href="/checkout"
          className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill px-5 py-2"
        >
          Order now {mounted && count > 0 ? `(${count})` : ""}
        </Link>
      </div>
    </header>
  )
}