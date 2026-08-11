import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/reviewRepository", () => ({
  ReviewRepository: { getAll: vi.fn() },
}));

import { ReviewRepository } from "@/lib/repositories/reviewRepository";
import ReviewsPage from "@/app/reviews/page";

describe("ReviewsPage - unit tests", () => {
  it("renders reviewer, rating, message, and cake link", async () => {
    vi.mocked(ReviewRepository.getAll).mockResolvedValue({
      data: [
        {
          id: "r1",
          rating: 4,
          message: "Fresh and delicious",
          created_at: "2026-08-11T00:00:00Z",
          profiles: { full_name: "Nadia" },
          cakes: { name: "Vanilla Cloud", slug: "vanilla-cloud" },
        },
      ],
      error: null,
    } as never);

    render(<ReviewsPage />);

    expect(await screen.findByText("Nadia")).toBeInTheDocument();
    expect(screen.getByText("★★★★☆")).toBeInTheDocument();
    expect(screen.getByText("Fresh and delicious")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /on vanilla cloud/i })).toHaveAttribute(
      "href",
      "/cakes/vanilla-cloud",
    );
  });

  it("renders repository errors instead of silently failing", async () => {
    vi.mocked(ReviewRepository.getAll).mockResolvedValue({
      data: null,
      error: { message: "reviews unavailable" },
    } as never);

    render(<ReviewsPage />);
    expect(await screen.findByText(/failed to load reviews: reviews unavailable/i)).toBeInTheDocument();
  });
});
