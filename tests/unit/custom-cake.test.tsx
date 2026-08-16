import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CustomCakePage from "@/app/custom-cake/page";

describe("CustomCakePage - unit tests", () => {
  it("renders the custom cake hero and ordering steps", () => {
    render(<CustomCakePage />);

    expect(
      screen.getByText(/tell us the occasion/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Share your idea"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/we quote & confirm/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/pick up or delivery/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ready to talk cake/i),
    ).toBeInTheDocument();
  });

  it("renders the duplicated custom cake gallery images", () => {
    const { container } = render(<CustomCakePage />);

    const images = container.querySelectorAll("img");

    expect(images.length).toBe(20);
  });

  it("creates WhatsApp links with secure external-link attributes", () => {
    render(<CustomCakePage />);

    const links = screen.getAllByRole("link", {
      name: /chat with us on whatsapp/i,
    });

    expect(links).toHaveLength(2);

    links.forEach((link) => {
      expect(link.getAttribute("href")).toContain(
        "https://wa.me/",
      );

      expect(link.getAttribute("href")).toContain(
        "text=",
      );

      expect(link).toHaveAttribute(
        "target",
        "_blank",
      );

      expect(link).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
    });
  });
});