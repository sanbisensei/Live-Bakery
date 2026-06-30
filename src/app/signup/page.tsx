"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="bg-white border border-beige-border rounded-2xl p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl text-cocoa mb-1">
          Create your account
        </h1>
        <p className="font-body text-sm text-cocoa-soft mb-6">
          Track your orders and leave reviews
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-xs text-cocoa-soft block mb-1">
              Full name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
            />
          </div>

          <div>
            <label className="font-body text-xs text-cocoa-soft block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
            />
          </div>

          <div>
            <label className="font-body text-xs text-cocoa-soft block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
            />
          </div>

          {error && <p className="font-body text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill py-3 mt-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="font-body text-xs text-cocoa-soft text-center mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-dark font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
