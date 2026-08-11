import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

import { supabase } from "@/lib/supabase";
import SignupPage from "@/app/signup/page";

describe("SignupPage - unit tests", () => {
  it("sends name metadata with email/password and renders Supabase errors", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" } as never,
    } as never);

    const { container } = render(<SignupPage />);
    const inputs = container.querySelectorAll("input");
    const fullName = inputs[0] as HTMLInputElement;
    const email = inputs[1] as HTMLInputElement;
    const password = inputs[2] as HTMLInputElement;

    await user.type(fullName, "Afsana Tester");
    await user.type(email, "afsana@example.com");
    await user.type(password, "secret12");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "afsana@example.com",
        password: "secret12",
        options: { data: { full_name: "Afsana Tester" } },
      });
    });
    expect(await screen.findByText("User already registered")).toBeInTheDocument();
  });

  it("enforces the current six-character HTML minimum password length", () => {
    const { container } = render(<SignupPage />);
    const password = container.querySelector('input[type="password"]') as HTMLInputElement;
    expect(password).toHaveAttribute("minLength", "6");
  });
});
