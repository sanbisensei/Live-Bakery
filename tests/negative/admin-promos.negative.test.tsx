import React from "react";
import { render, screen } from "@testing-library/react";
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

describe("AdminPromosPage - negative tests", () => {
  it("rejects a create attempt when code and discount are missing", async () => {
    const user = userEvent.setup();
    vi.mocked(PromoRepository.getAll).mockResolvedValue({ data: [], error: null } as never);
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

    render(<AdminPromosPage />);
    await screen.findByText(/no promo codes yet/i);
    await user.click(screen.getByRole("button", { name: /new promo/i }));
    await user.click(screen.getByRole("button", { name: /create promo/i }));

    expect(alertSpy).toHaveBeenCalledWith("Code and discount % are required.");
    expect(PromoRepository.create).not.toHaveBeenCalled();
  });

  it("does not delete when the administrator cancels the confirmation", async () => {
    const user = userEvent.setup();
    vi.mocked(PromoRepository.getAll).mockResolvedValue({
      data: [
        {
          id: "p1",
          code: "WELCOME10",
          discount_pct: 10,
          max_uses: 100,
          used_count: 1,
          expires_at: null,
          is_active: true,
          created_at: "2026-08-01T00:00:00Z",
        },
      ],
      error: null,
    } as never);
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<AdminPromosPage />);
    await screen.findByText("WELCOME10");
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(PromoRepository.delete).not.toHaveBeenCalled();
  });

  it("shows a load failure from the repository", async () => {
    vi.mocked(PromoRepository.getAll).mockResolvedValue({
      data: null,
      error: { message: "network down" },
    } as never);

    render(<AdminPromosPage />);
    expect(await screen.findByText(/failed to load promo codes: network down/i)).toBeInTheDocument();
  });

  it.todo("reject discount percentages below 0 or above 100 (production validation is currently missing)");
  it.todo("reject negative max_uses values (production validation is currently missing)");
});
