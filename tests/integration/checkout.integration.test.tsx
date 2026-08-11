import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/cartContext", () => ({ useCart: vi.fn() }));
vi.mock("@/lib/repositories/orderRepository", () => ({
  OrderRepository: { create: vi.fn(), addItems: vi.fn() },
}));
vi.mock("@/lib/delivery/strategies", () => ({
  deliveryStrategies: [
    { type: "standard", label: "Standard delivery", description: "Regular", calculateFee: () => 80 },
    { type: "fast", label: "Fast delivery", description: "Priority", calculateFee: () => 150 },
  ],
  getDeliveryStrategy: (type: "standard" | "fast") =>
    type === "fast"
      ? { type: "fast", label: "Fast delivery", description: "Priority", calculateFee: () => 150 }
      : { type: "standard", label: "Standard delivery", description: "Regular", calculateFee: () => 80 },
}));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getSession: vi.fn() },
    from: vi.fn(),
  },
}));

import { useCart } from "@/lib/cartContext";
import { OrderRepository } from "@/lib/repositories/orderRepository";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import CheckoutPage from "@/app/checkout/page";

describe("Checkout - application integration", () => {
  it("applies a promo, calculates totals, creates order/items, clears cart, and navigates", async () => {
    const user = userEvent.setup();
    const clearCart = vi.fn();
    const push = vi.fn();

    vi.mocked(useCart).mockReturnValue({
      items: [
        {
          cakeId: "cake-1",
          cakeName: "Red Velvet",
          sizeId: "size-1",
          sizeLabel: "2 lb",
          quantity: 2,
          unitPrice: 450,
          priceAdd: 50,
        },
      ],
      total: 1000,
      clearCart,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    } as never);
    vi.mocked(useRouter).mockReturnValue({ push } as never);
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
      error: null,
    } as never);

    const single = vi.fn().mockResolvedValue({
      data: {
        id: "promo-1",
        discount_pct: 10,
        is_active: true,
        expires_at: null,
        max_uses: 100,
        used_count: 10,
      },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    vi.mocked(supabase.from).mockReturnValue({ select } as never);

    vi.mocked(OrderRepository.create).mockResolvedValue({
      data: { id: "order-1" },
      error: null,
    } as never);
    vi.mocked(OrderRepository.addItems).mockResolvedValue({ error: null } as never);

    const { container } = render(<CheckoutPage />);
    await user.type(screen.getByPlaceholderText(/WELCOME10/i), "welcome10");
    await user.click(screen.getByRole("button", { name: /^apply$/i }));
    expect(await screen.findByText(/10% discount applied/i)).toBeInTheDocument();
    expect(eq).toHaveBeenCalledWith("code", "WELCOME10");
    expect(screen.getByText("− ৳100")).toBeInTheDocument();
    expect(screen.getByText("৳980")).toBeInTheDocument();

    fireEvent.change(container.querySelector('input[name="customer_name"]')!, { target: { value: "Integration User" } });
    fireEvent.change(container.querySelector('input[name="customer_phone"]')!, { target: { value: "01700000000" } });
    fireEvent.change(container.querySelector('textarea[name="delivery_address"]')!, { target: { value: "Mohammadpur, Dhaka" } });
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
    fireEvent.change(container.querySelector('input[name="delivery_date"]')!, { target: { value: tomorrow } });

    await user.click(screen.getByRole("button", { name: /place order — ৳980/i }));

    await waitFor(() => {
      expect(OrderRepository.create).toHaveBeenCalledWith({
        customer_name: "Integration User",
        customer_phone: "01700000000",
        delivery_address: "Mohammadpur, Dhaka",
        delivery_date: tomorrow,
        special_notes: "",
        delivery_type: "standard",
        delivery_fee: 80,
        subtotal: 1000,
        discount_amount: 100,
        total_amount: 980,
        promo_code_id: "promo-1",
        user_id: "user-1",
      });
    });

    expect(OrderRepository.addItems).toHaveBeenCalledWith("order-1", [
      {
        cake_id: "cake-1",
        cake_size_id: "size-1",
        size_label: "2 lb",
        quantity: 2,
        unit_price: 500,
      },
    ]);
    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/checkout/success");
  });
});
