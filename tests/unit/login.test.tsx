import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

import { supabase } from "@/lib/supabase";
import LoginPage from "@/app/login/page";

describe("LoginPage - unit tests", () => {
  it("submits email/password to Supabase and shows authentication errors", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" } as never,
    } as never);

    const { container } = render(<LoginPage />);
    const email = container.querySelector('input[type="email"]') as HTMLInputElement;
    const password = container.querySelector('input[type="password"]') as HTMLInputElement;

    await user.type(email, "customer@example.com");
    await user.type(password, "wrong-password");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "customer@example.com",
        password: "wrong-password",
      });
    });
    expect(await screen.findByText("Invalid login credentials")).toBeInTheDocument();
  });

  it("uses required email and password fields", () => {
    const { container } = render(<LoginPage />);
    const email = container.querySelector('input[type="email"]') as HTMLInputElement;
    const password = container.querySelector('input[type="password"]') as HTMLInputElement;

    expect(email).toBeRequired();
    expect(password).toBeRequired();
  });
});
