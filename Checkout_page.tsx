"use client"

import { useState } from "react"
import { useCart } from "@/lib/cartContext"
import { deliveryStrategies, getDeliveryStrategy } from "@/lib/delivery/strategies"
import { OrderRepository } from "@/lib/repositories/orderRepository"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    delivery_date: "",
    special_notes: "",
  })

  const [deliveryType, setDeliveryType] = useState<"standard" | "fast">("standard")
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoId, setPromoId] = useState<string | undefined>(undefined)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")

  const strategy = getDeliveryStrategy(deliveryType)
  const deliveryFee = strategy.calculateFee()
  const discountAmount = Math.round(total * (discount / 100))
  const grandTotal = total - discountAmount + deliveryFee

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function applyPromo() {
    setPromoError("")
    setDiscount(0)
    setPromoId(undefined)

    if (!promoCode.trim()) return

    const { data, error } = await supabase
      .from("promo_codes")
      .select("id, discount_pct, is_active, expires_at, max_uses, used_count")
      .eq("code", promoCode.trim().toUpperCase())
      .single()

    if (error || !data) {
      setPromoError("Invalid promo code.")
      return
    }
    if (!data.is_active) {
      setPromoError("This promo code is no longer active.")
      return
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setPromoError("This promo code has expired.")
      return
    }
    if (data.max_uses && data.used_count >= data.max_uses) {
      setPromoError("This promo code has reached its usage limit.")
      return
    }

    setDiscount(data.discount_pct)
    setPromoId(data.id)
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      setError("Your cart is empty.")
      return
    }

    setPlacing(true)
    setError("")

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user.id

    const { data: order, error: orderError } = await OrderRepository.create({
      ...form,
      delivery_type: deliveryType,
      delivery_fee: deliveryFee,
      subtotal: total,
      discount_amount: discountAmount,
      total_amount: grandTotal,
      promo_code_id: promoId,
      user_id: userId,
    })

    if (orderError || !order) {
      setError("Failed to place order. Please try again.")
      setPlacing(false)
      return
    }

    const { error: itemsError } = await OrderRepository.addItems(
      order.id,
      items.map((item) => ({
        cake_id: item.cakeId,
        cake_size_id: item.sizeId,
        size_label: item.sizeLabel,
        quantity: item.quantity,
        unit_price: item.unitPrice + (item.priceAdd ?? 0),
      }))
    )

    if (itemsError) {
      setError("Order created but items failed. Contact us.")
      setPlacing(false)
      return
    }

    clearCart()
    router.push(`/checkout/success`)
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