import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("@/lib/repositories/blogRepository", () => ({
  BlogRepository: {
    getAllAdmin: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/components/ui/ImageUpload", () => ({
  default: () => (
    <div data-testid="image-upload">
      Image upload
    </div>
  ),
}));

import { BlogRepository } from "@/lib/repositories/blogRepository";
import { supabase } from "@/lib/supabase";
import AdminBlogPage from "@/app/admin/blog/page";

const draftPost = {
  id: "post-1",
  title: "Chocolate Cake Tips",
  slug: "chocolate-cake-tips",
  content: "Some useful baking tips.",
  cover_image: "",
  tag: "Tips",
  is_published: false,
  published_at: null,
  created_at: "2026-08-17T00:00:00Z",
  profiles: {
    full_name: "Afsana",
  },
};

describe("AdminBlogPage - unit tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(
      BlogRepository.getAllAdmin,
    ).mockResolvedValue({
      data: [],
      error: null,
    } as never);

    vi.mocked(
      BlogRepository.create,
    ).mockResolvedValue({
      error: null,
    } as never);

    vi.mocked(
      BlogRepository.update,
    ).mockResolvedValue({
      error: null,
    } as never);

    vi.mocked(
      BlogRepository.delete,
    ).mockResolvedValue({
      error: null,
    } as never);

    vi.mocked(
      supabase.auth.getSession,
    ).mockResolvedValue({
      data: {
        session: {
          user: {
            id: "user-1",
          },
        },
      },
      error: null,
    } as never);
  });

  it("renders blog posts with status, tag, and author", async () => {
    vi.mocked(
      BlogRepository.getAllAdmin,
    ).mockResolvedValue({
      data: [
        draftPost,
        {
          ...draftPost,
          id: "post-2",
          title: "Vanilla Sponge Recipe",
          is_published: true,
          tag: "Recipe",
          profiles: null,
        },
      ],
      error: null,
    } as never);

    render(<AdminBlogPage />);

    expect(
      await screen.findByText("Chocolate Cake Tips"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Draft"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Published"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/By Afsana/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/No author set/i),
    ).toBeInTheDocument();
  });

  it("shows empty state when no blog posts exist", async () => {
    render(<AdminBlogPage />);

    expect(
      await screen.findByText(/no posts yet/i),
    ).toBeInTheDocument();
  });

  it("creates a blog post and automatically generates its slug", async () => {
    const user = userEvent.setup();

    render(<AdminBlogPage />);

    await user.click(
      screen.getByRole("button", {
        name: /new post/i,
      }),
    );

    await user.type(
      screen.getByPlaceholderText(
        /5 tips for baking the perfect sponge cake/i,
      ),
      "Chocolate Cake Tips",
    );

    await user.click(
      screen.getByRole("button", {
        name: /^create post$/i,
      }),
    );

    expect(
      BlogRepository.create,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Chocolate Cake Tips",
        slug: "chocolate-cake-tips",
        is_published: false,
        author_id: "user-1",
      }),
    );
  });

  it("rejects blog creation when title is missing", async () => {
    const user = userEvent.setup();

    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(<AdminBlogPage />);

    await user.click(
      screen.getByRole("button", {
        name: /new post/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /^create post$/i,
      }),
    );

    expect(alertSpy).toHaveBeenCalledWith(
      "Title is required.",
    );

    expect(
      BlogRepository.create,
    ).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("publishes a draft blog post", async () => {
    const user = userEvent.setup();

    vi.mocked(
      BlogRepository.getAllAdmin,
    ).mockResolvedValue({
      data: [draftPost],
      error: null,
    } as never);

    render(<AdminBlogPage />);

    await screen.findByText("Chocolate Cake Tips");

    await user.click(
      screen.getByRole("button", {
        name: /^publish$/i,
      }),
    );

    expect(
      BlogRepository.update,
    ).toHaveBeenCalledWith(
      "post-1",
      expect.objectContaining({
        is_published: true,
        published_at: expect.any(String),
      }),
    );
  });
});