import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

const baseCart = {
  items: [
    { cakeId: "c1", cakeName: "Chocolate Cake", sizeId: "s1", sizeLabel: "1 lb", quantity: 1, unitPrice: 1000, priceAdd: 0 },
  ],
  total: 1000,
  clearCart: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
};

function mockPromoResult(result: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ single });
  const select = vi.fn().mockReturnValue({ eq });
  vi.mocked(supabase.from).mockReturnValue({ select } as never);
  return { select, eq, single };
}

describe("CheckoutPage - negative tests", () => {
  beforeEach(() => {
    vi.mocked(useCart).mockReturnValue(baseCart as never);
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as never);
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "u1" } } },
      error: null,
    } as never);
  });

  it.each([
    ["invalid", { data: null, error: { message: "not found" } }, "Invalid promo code."],
    ["inactive", { data: { id: "p1", discount_pct: 10, is_active: false, expires_at: null, max_uses: 10, used_count: 0 }, error: null }, "This promo code is no longer active."],
    ["expired", { data: { id: "p1", discount_pct: 10, is_active: true, expires_at: "2000-01-01T00:00:00Z", max_uses: 10, used_count: 0 }, error: null }, "This promo code has expired."],
    ["maxed", { data: { id: "p1", discount_pct: 10, is_active: true, expires_at: null, max_uses: 2, used_count: 2 }, error: null }, "This promo code has reached its usage limit."],
  ])("handles %s promo codes", async (_name, result, message) => {
    const user = userEvent.setup();
    mockPromoResult(result);
    render(<CheckoutPage />);

    await user.type(screen.getByPlaceholderText(/WELCOME10/i), "badcode");
    await user.click(screen.getByRole("button", { name: /^apply$/i }));

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("stops when order creation fails", async () => {
    const user = userEvent.setup();
    vi.mocked(OrderRepository.create).mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    } as never);

    const { container } = render(<CheckoutPage />);
    const name = container.querySelector('input[name="customer_name"]') as HTMLInputElement;
    const phone = container.querySelector('input[name="customer_phone"]') as HTMLInputElement;
    const address = container.querySelector('textarea[name="delivery_address"]') as HTMLTextAreaElement;
    const date = container.querySelector('input[name="delivery_date"]') as HTMLInputElement;
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];

    await user.type(name, "Test Customer");
    await user.type(phone, "01700000000");
    await user.type(address, "Dhaka");
    fireEvent.change(date, { target: { value: tomorrow } });
    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText("Failed to place order. Please try again.")).toBeInTheDocument();
    expect(OrderRepository.addItems).not.toHaveBeenCalled();
  });

  it("reports item insertion failure and does not clear the cart", async () => {
    const user = userEvent.setup();
    vi.mocked(OrderRepository.create).mockResolvedValue({ data: { id: "o1" }, error: null } as never);
    vi.mocked(OrderRepository.addItems).mockResolvedValue({ error: { message: "item insert failed" } } as never);

    const { container } = render(<CheckoutPage />);
    fireEvent.change(container.querySelector('input[name="customer_name"]')!, { target: { value: "Test Customer" } });
    fireEvent.change(container.querySelector('input[name="customer_phone"]')!, { target: { value: "01700000000" } });
    fireEvent.change(container.querySelector('textarea[name="delivery_address"]')!, { target: { value: "Dhaka" } });
    fireEvent.change(container.querySelector('input[name="delivery_date"]')!, { target: { value: new Date(Date.now() + 86_400_000).toISOString().split("T")[0] } });

    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText("Order created but items failed. Contact us.")).toBeInTheDocument();
    expect(baseCart.clearCart).not.toHaveBeenCalled();
  });

  it("never creates an order for an empty cart", () => {
    vi.mocked(useCart).mockReturnValue({ ...baseCart, items: [], total: 0 } as never);
    const { container } = render(<CheckoutPage />);
    const form = container.querySelector("form") as HTMLFormElement;
    fireEvent.submit(form);
    expect(OrderRepository.create).not.toHaveBeenCalled();
  });
});
