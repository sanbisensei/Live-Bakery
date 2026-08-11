import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/cakeRepository", () => ({
  CakeRepository: { getAll: vi.fn() },
}));

vi.mock("@/components/ui/CakeCard", () => ({
  default: (props: {
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl?: string;
  }) => (
    <div data-testid="cake-card">
      <span>{props.name}</span>
      <span data-testid="price">{props.price}</span>
      <span data-testid="original-price">{props.originalPrice ?? "none"}</span>
      <span data-testid="image-url">{props.imageUrl ?? "none"}</span>
    </div>
  ),
}));

import { CakeRepository } from "@/lib/repositories/cakeRepository";
import CakesPage from "@/app/cakes/page";

describe("CakesPage - unit tests", () => {
  it("calculates discounted price and forwards the primary image to CakeCard", async () => {
    vi.mocked(CakeRepository.getAll).mockResolvedValue({
      data: [
        {
          id: "cake-1",
          slug: "chocolate-dream",
          name: "Chocolate Dream",
          base_price: 1000,
          discount_pct: 10,
          cake_images: [{ url: "https://example.test/cake.jpg" }],
        },
      ],
      error: null,
    } as never);

    render(await CakesPage());

    expect(screen.getByText("Chocolate Dream")).toBeInTheDocument();
    expect(screen.getByTestId("price")).toHaveTextContent("900");
    expect(screen.getByTestId("original-price")).toHaveTextContent("1000");
    expect(screen.getByTestId("image-url")).toHaveTextContent("cake.jpg");
  });

  it("renders a safe error state when cake loading fails", async () => {
    vi.mocked(CakeRepository.getAll).mockResolvedValue({
      data: null,
      error: { message: "database unavailable" },
    } as never);

    render(await CakesPage());
    expect(screen.getByText(/failed to load cakes/i)).toBeInTheDocument();
  });
});
