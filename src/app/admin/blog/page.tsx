"use client";

import { useEffect, useState } from "react";
import { BlogRepository } from "@/lib/repositories/blogRepository";
import { supabase } from "@/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  cover_image?: string;
  tag?: string;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
};

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  cover_image: "",
  tag: "",
  is_published: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await BlogRepository.getAllAdmin();
    if (error) {
      setErrorMsg(error.message);
    } else {
      setPosts((data as BlogPost[]) ?? []);
      setErrorMsg(null);
    }
    setLoading(false);
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content ?? "",
      cover_image: post.cover_image ?? "",
      tag: post.tag ?? "",
      is_published: post.is_published,
    });
    setEditingId(post.id);
    setShowForm(true);
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    setSaving(true);

    const wasPublished = form.is_published;

    if (editingId) {
      const { error } = await BlogRepository.update(editingId, {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        content: form.content.trim() || undefined,
        cover_image: form.cover_image.trim() || undefined,
        tag: form.tag.trim() || undefined,
        is_published: wasPublished,
        published_at: wasPublished ? new Date().toISOString() : null,
      });
      if (error) {
        alert("Failed to update post: " + error.message);
      } else {
        setShowForm(false);
        await loadPosts();
      }
    } else {
      const { data: sessionData } = await supabase.auth.getSession();
      const authorId = sessionData.session?.user?.id;

      const { error } = await BlogRepository.create({
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        content: form.content.trim() || undefined,
        cover_image: form.cover_image.trim() || undefined,
        tag: form.tag.trim() || undefined,
        is_published: wasPublished,
        published_at: wasPublished ? new Date().toISOString() : undefined,
        author_id: authorId,
      });
      if (error) {
        alert("Failed to create post: " + error.message);
      } else {
        setShowForm(false);
        await loadPosts();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    const { error } = await BlogRepository.delete(id);
    if (error) {
      alert("Failed to delete post: " + error.message);
    } else {
      await loadPosts();
    }
  }

  async function handleTogglePublish(post: BlogPost) {
    const nextPublished = !post.is_published;
    const { error } = await BlogRepository.update(post.id, {
      is_published: nextPublished,
      published_at: nextPublished ? new Date().toISOString() : null,
    });
    if (error) {
      alert("Failed to update post: " + error.message);
    } else {
      await loadPosts();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-cocoa mb-1">Blog</h1>
          <p className="font-body text-sm text-cocoa-soft">
            Write and manage recipe posts and updates
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2.5"
        >
          + New post
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 font-body text-sm mb-4">
          Failed to load posts: {errorMsg}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-beige-border rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl text-cocoa mb-4">
            {editingId ? "Edit post" : "New post"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="5 Tips for Baking the Perfect Sponge Cake"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Slug (auto-generated if blank)
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="5-tips-perfect-sponge-cake"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Tag
              </label>
              <input
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="Baking Tips"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Cover image URL
              </label>
              <input
                value={form.cover_image}
                onChange={(e) =>
                  setForm({ ...form, cover_image: e.target.value })
                }
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="Write the post content here..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 font-body text-sm text-cocoa">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    setForm({ ...form, is_published: e.target.checked })
                  }
                />
                Publish immediately
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2 disabled:opacity-40"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create post"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              disabled={saving}
              className="font-body text-sm font-semibold border-2 border-beige-border text-cocoa rounded-pill px-5 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="font-body text-sm text-cocoa-soft">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="font-body text-sm text-cocoa-soft">
          No posts yet — write your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-beige-border rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-beige rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-body text-[10px] text-cocoa-soft">
                      no photo
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-lg text-cocoa">
                      {post.title}
                    </p>
                    <span
                      className={`font-body text-[10px] font-semibold px-2 py-0.5 rounded-pill border ${
                        post.is_published
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="font-body text-xs text-cocoa-soft">
                    {post.tag ? `${post.tag} · ` : ""}
                    {post.profiles?.full_name
                      ? `By ${post.profiles.full_name}`
                      : "No author set"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublish(post)}
                  className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
                >
                  {post.is_published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => openEditForm(post)}
                  className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
