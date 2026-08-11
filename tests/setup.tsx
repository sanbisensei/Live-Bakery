import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Most tests do not need Next.js navigation internals. This lightweight Link mock
// keeps component tests focused on Live Bakery behavior.
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
