import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/promoRepository", () => ({
  PromoRepository: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { PromoRepository } from "@/lib/repositories/promoRepository";
import AdminPromosPage from "@/app/admin/promos/page";

describe("Admin promo management - application integration", () => {
  it("creates a normalized promo and reloads the list", async () => {
    const user = userEvent.setup();
    vi.mocked(PromoRepository.getAll).mockResolvedValue({ data: [], error: null } as never);
    vi.mocked(PromoRepository.create).mockResolvedValue({ error: null } as never);

    render(<AdminPromosPage />);
    await screen.findByText(/no promo codes yet/i);
    await user.click(screen.getByRole("button", { name: /new promo/i }));
    await user.type(screen.getByPlaceholderText("WELCOME10"), "summer15");
    await user.type(screen.getByPlaceholderText("10"), "15");
    await user.type(screen.getByPlaceholderText("100"), "20");
    await user.click(screen.getByRole("button", { name: /create promo/i }));

    await waitFor(() => {
      expect(PromoRepository.create).toHaveBeenCalledWith({
        code: "SUMMER15",
        discount_pct: 15,
        max_uses: 20,
        expires_at: undefined,
        is_active: true,
      });
    });
    expect(PromoRepository.getAll).toHaveBeenCalledTimes(2);
  });
});
