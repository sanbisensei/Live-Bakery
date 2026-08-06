"use client";

import { useEffect, useState } from "react";
import { PromoRepository } from "@/lib/repositories/promoRepository";

type Promo = {
  id: string;
  code: string;
  discount_pct: number;
  max_uses?: number | null;
  used_count?: number | null;
  expires_at?: string | null;
  is_active: boolean;
  created_at: string;
};

const emptyForm = {
  code: "",
  discount_pct: "",
  max_uses: "",
  expires_at: "",
  is_active: true,
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPromos();
  }, []);

  async function loadPromos() {
    setLoading(true);
    const { data, error } = await PromoRepository.getAll();
    if (error) {
      setErrorMsg(error.message);
    } else {
      setPromos((data as Promo[]) ?? []);
      setErrorMsg(null);
    }
    setLoading(false);
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(promo: Promo) {
    setForm({
      code: promo.code,
      discount_pct: String(promo.discount_pct ?? ""),
      max_uses: promo.max_uses != null ? String(promo.max_uses) : "",
      expires_at: promo.expires_at ? promo.expires_at.slice(0, 10) : "",
      is_active: promo.is_active,
    });
    setEditingId(promo.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.code.trim() || !form.discount_pct) {
      alert("Code and discount % are required.");
      return;
    }

    setSaving(true);

    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_pct: Number(form.discount_pct),
      max_uses: form.max_uses ? Number(form.max_uses) : undefined,
      expires_at: form.expires_at
        ? new Date(form.expires_at).toISOString()
        : undefined,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await PromoRepository.update(editingId, {
        ...payload,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at
          ? new Date(form.expires_at).toISOString()
          : null,
      });
      if (error) {
        alert("Failed to update promo: " + error.message);
      } else {
        setShowForm(false);
        await loadPromos();
      }
    } else {
      const { error } = await PromoRepository.create(payload);
      if (error) {
        alert("Failed to create promo: " + error.message);
      } else {
        setShowForm(false);
        await loadPromos();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete promo code "${code}"? This can't be undone.`)) return;
    const { error } = await PromoRepository.delete(id);
    if (error) {
      alert("Failed to delete promo: " + error.message);
    } else {
      await loadPromos();
    }
  }

  async function handleToggleActive(promo: Promo) {
    const { error } = await PromoRepository.update(promo.id, {
      is_active: !promo.is_active,
    });
    if (error) {
      alert("Failed to update promo: " + error.message);
    } else {
      await loadPromos();
    }
  }

  function isExpired(promo: Promo) {
    return !!promo.expires_at && new Date(promo.expires_at) < new Date();
  }

  function isMaxedOut(promo: Promo) {
    return promo.max_uses != null && (promo.used_count ?? 0) >= promo.max_uses;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-cocoa mb-1">Promo codes</h1>
          <p className="font-body text-sm text-cocoa-soft">
            Create and manage discount codes for checkout
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2.5"
        >
          + New promo
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 font-body text-sm mb-4">
          Failed to load promo codes: {errorMsg}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-beige-border rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl text-cocoa mb-4">
            {editingId ? "Edit promo code" : "New promo code"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Code *
              </label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm uppercase"
                placeholder="WELCOME10"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Discount % *
              </label>
              <input
                type="number"
                value={form.discount_pct}
                onChange={(e) =>
                  setForm({ ...form, discount_pct: e.target.value })
                }
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="10"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Max uses (leave blank for unlimited)
              </label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="100"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Expires on (leave blank for no expiry)
              </label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) =>
                  setForm({ ...form, expires_at: e.target.value })
                }
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 font-body text-sm text-cocoa">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Active
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
                  : "Create promo"}
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
        <p className="font-body text-sm text-cocoa-soft">
          Loading promo codes...
        </p>
      ) : promos.length === 0 ? (
        <p className="font-body text-sm text-cocoa-soft">
          No promo codes yet — create your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {promos.map((promo) => {
            const expired = isExpired(promo);
            const maxedOut = isMaxedOut(promo);

            return (
              <div
                key={promo.id}
                className="bg-white border border-beige-border rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-lg text-cocoa font-mono">
                      {promo.code}
                    </p>
                    <span
                      className={`font-body text-[10px] font-semibold px-2 py-0.5 rounded-pill border ${
                        promo.is_active && !expired && !maxedOut
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {!promo.is_active
                        ? "Inactive"
                        : expired
                          ? "Expired"
                          : maxedOut
                            ? "Limit reached"
                            : "Active"}
                    </span>
                  </div>
                  <p className="font-body text-xs text-cocoa-soft">
                    {promo.discount_pct}% off
                    {promo.max_uses != null
                      ? ` · ${promo.used_count ?? 0}/${promo.max_uses} used`
                      : ` · ${promo.used_count ?? 0} used`}
                    {promo.expires_at
                      ? ` · expires ${new Date(
                          promo.expires_at,
                        ).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`
                      : ""}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(promo)}
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
                  >
                    {promo.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEditForm(promo)}
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id, promo.code)}
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
