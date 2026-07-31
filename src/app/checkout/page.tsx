"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cartContext";
import {
  deliveryStrategies,
  getDeliveryStrategy,
} from "@/lib/delivery/strategies";
import { OrderRepository } from "@/lib/repositories/orderRepository";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    delivery_date: "",
    special_notes: "",
  });

  const [deliveryType, setDeliveryType] = useState<"standard" | "fast">(
    "standard",
  );
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoId, setPromoId] = useState<string | undefined>(undefined);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Wait for client mount before rendering cart-dependent UI
  useEffect(() => {
    async function init() {
      setMounted(true);
    }
    init();
  }, []);

  const strategy = getDeliveryStrategy(deliveryType);
  const deliveryFee = strategy.calculateFee();
  const discountAmount = Math.round(total * (discount / 100));
  const grandTotal = total - discountAmount + deliveryFee;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function applyPromo() {
    setPromoError("");
    setDiscount(0);
    setPromoId(undefined);

    if (!promoCode.trim()) return;

    const { data, error } = await supabase
      .from("promo_codes")
      .select("id, discount_pct, is_active, expires_at, max_uses, used_count")
      .eq("code", promoCode.trim().toUpperCase())
      .single();

    if (error || !data) {
      setPromoError("Invalid promo code.");
      return;
    }
    if (!data.is_active) {
      setPromoError("This promo code is no longer active.");
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setPromoError("This promo code has expired.");
      return;
    }
    if (data.max_uses && data.used_count >= data.max_uses) {
      setPromoError("This promo code has reached its usage limit.");
      return;
    }

    setDiscount(data.discount_pct);
    setPromoId(data.id);
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);
    setError("");

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    // const { data: order, error: orderError } = await OrderRepository.create({
    //   ...form,
    //   delivery_type: deliveryType,
    //   delivery_fee: deliveryFee,
    //   subtotal: total,
    //   discount_amount: discountAmount,
    //   total_amount: grandTotal,
    //   promo_code_id: promoId,
    //   user_id: userId,
    // });

    // if (orderError || !order) {
    //   setError("Failed to place order. Please try again.");
    //   setPlacing(false);
    //   return;
    // }
    const { data: order, error: orderError } = await OrderRepository.create({
      ...form,
      delivery_type: deliveryType,
      delivery_fee: deliveryFee,
      subtotal: total,
      discount_amount: discountAmount,
      total_amount: grandTotal,
      promo_code_id: promoId,
      user_id: userId,
    });

    if (orderError || !order) {
      setError("Failed to place order. Please try again.");
      setPlacing(false);
      return;
    }

    const { error: itemsError } = await OrderRepository.addItems(
      order.id,
      items.map((item) => ({
        cake_id: item.cakeId,
        cake_size_id: item.sizeId,
        size_label: item.sizeLabel,
        quantity: item.quantity,
        unit_price: item.unitPrice + (item.priceAdd ?? 0),
      })),
    );

    if (itemsError) {
      setError("Order created but items failed. Contact us.");
      setPlacing(false);
      return;
    }

    clearCart();
    router.push("/checkout/success");
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="font-display text-3xl text-cocoa mb-2">Checkout</h1>
      <p className="font-body text-sm text-cocoa-soft mb-10">
        No payment needed now — pay in cash when your order arrives.
      </p>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT — form */}
          <div className="flex flex-col gap-6">
            {/* Delivery details */}
            <div className="bg-white border border-beige-border rounded-2xl p-6">
              <h2 className="font-display text-xl text-cocoa mb-5">
                Delivery details
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-body text-xs text-cocoa-soft block mb-1">
                    Full name
                  </label>
                  <input
                    name="customer_name"
                    required
                    value={form.customer_name}
                    onChange={handleChange}
                    className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-cocoa-soft block mb-1">
                    Phone number
                  </label>
                  <input
                    name="customer_phone"
                    required
                    value={form.customer_phone}
                    onChange={handleChange}
                    className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="font-body text-xs text-cocoa-soft block mb-1">
                  Delivery address
                </label>
                <textarea
                  name="delivery_address"
                  required
                  rows={2}
                  value={form.delivery_address}
                  onChange={handleChange}
                  className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="font-body text-xs text-cocoa-soft block mb-1">
                  Preferred delivery date
                </label>
                <input
                  type="date"
                  name="delivery_date"
                  required
                  value={form.delivery_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
                />
              </div>

              <div>
                <label className="font-body text-xs text-cocoa-soft block mb-1">
                  Special instructions (optional)
                </label>
                <textarea
                  name="special_notes"
                  rows={2}
                  value={form.special_notes}
                  onChange={handleChange}
                  className="w-full border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream resize-none"
                />
              </div>
            </div>

            {/* Delivery speed */}
            <div className="bg-white border border-beige-border rounded-2xl p-6">
              <h2 className="font-display text-xl text-cocoa mb-5">
                Delivery speed
              </h2>
              <div className="flex flex-col gap-3">
                {deliveryStrategies.map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => setDeliveryType(s.type)}
                    className={`flex items-center justify-between border-2 rounded-2xl px-5 py-4 transition-colors
                      ${
                        deliveryType === s.type
                          ? "border-cocoa bg-beige"
                          : "border-beige-border bg-white"
                      }`}
                  >
                    <div className="text-left">
                      <p className="font-body text-sm font-semibold text-cocoa">
                        {s.label}
                      </p>
                      <p className="font-body text-xs text-cocoa-soft">
                        {s.description}
                      </p>
                    </div>
                    <span className="font-body text-sm font-semibold text-orange-dark">
                      ৳{s.calculateFee()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white border border-beige-border rounded-2xl p-6">
              <h2 className="font-display text-xl text-cocoa mb-5">
                Promo code
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-cocoa rounded-lg px-3 py-2 font-body text-sm bg-cream"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="font-body text-sm font-semibold border-2 border-cocoa text-cocoa rounded-pill px-5 py-2"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="font-body text-xs text-red-500 mt-2">
                  {promoError}
                </p>
              )}
              {discount > 0 && (
                <p className="font-body text-xs text-pistachio font-semibold mt-2">
                  ✓ {discount}% discount applied!
                </p>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white border border-beige-border rounded-2xl p-6">
              <h2 className="font-display text-xl text-cocoa mb-3">
                Payment method
              </h2>
              <div className="flex items-center gap-4 bg-beige rounded-xl px-5 py-4 border border-beige-border">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-body text-sm font-semibold text-cocoa">
                    Cash on delivery
                  </p>
                  <p className="font-body text-xs text-cocoa-soft">
                    Pay in cash when your order arrives. No cards or bKash
                    needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — order summary */}
          <div>
            <div className="bg-white border border-beige-border rounded-2xl p-6 sticky top-6">
              <h2 className="font-display text-xl text-cocoa mb-5">
                Order summary
              </h2>

              {/* Only render cart contents after mount to avoid hydration mismatch */}
              {!mounted ? (
                <p className="font-body text-sm text-cocoa-soft">
                  Loading your cart...
                </p>
              ) : items.length === 0 ? (
                <p className="font-body text-sm text-cocoa-soft">
                  Your cart is empty.{" "}
                  <Link
                    href="/cakes"
                    className="text-orange-dark font-semibold"
                  >
                    Browse cakes
                  </Link>
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-3 mb-5">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <p className="font-body text-sm text-cocoa">
                            {item.cakeName}
                          </p>
                          {item.sizeLabel && (
                            <p className="font-body text-xs text-cocoa-soft">
                              {item.sizeLabel}
                            </p>
                          )}
                          <p className="font-body text-xs text-cocoa-soft">
                            × {item.quantity}
                          </p>
                        </div>
                        <span className="font-body text-sm font-semibold text-cocoa">
                          ৳
                          {(item.unitPrice + (item.priceAdd ?? 0)) *
                            item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-beige-border pt-4 flex flex-col gap-2">
                    <div className="flex justify-between font-body text-sm text-cocoa-soft">
                      <span>Subtotal</span>
                      <span>৳{total}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between font-body text-sm text-pistachio">
                        <span>Promo discount</span>
                        <span>− ৳{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-body text-sm text-cocoa-soft">
                      <span>{strategy.label}</span>
                      <span>৳{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-body text-base font-semibold text-cocoa border-t border-beige-border pt-3 mt-1">
                      <span>Total</span>
                      <span>৳{grandTotal}</span>
                    </div>
                  </div>

                  {error && (
                    <p className="font-body text-xs text-red-500 mt-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={placing}
                    className="w-full mt-5 font-body text-sm font-semibold bg-orange text-cocoa rounded-pill py-3 disabled:opacity-60"
                  >
                    {placing
                      ? "Placing order..."
                      : `Place order — ৳${grandTotal}`}
                  </button>

                  <p className="font-body text-xs text-cocoa-soft text-center mt-3">
                    No payment now · pay on arrival in cash
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
