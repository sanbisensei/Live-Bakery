// "use client";

// import { useEffect, useState } from "react";
// import {
//   CakeRepository,
//   CakeImageRepository,
//   CakeSizeRepository,
// } from "@/lib/repositories/cakeRepository";

// type CakeImage = {
//   id: string;
//   url: string;
//   is_primary: boolean;
//   sort_order?: number;
// };

// type CakeSize = {
//   id: string;
//   label: string;
//   price_add: number;
// };

// type Cake = {
//   id: string;
//   name: string;
//   slug: string;
//   base_price: number;
//   category_id?: string | null;
//   description?: string;
//   discount_pct?: number;
//   is_available: boolean;
//   is_featured: boolean;
//   cake_images: CakeImage[];
//   cake_sizes: CakeSize[];
//   categories?: { name: string } | null;
// };

// type Category = {
//   id: string;
//   name: string;
// };

// const emptyForm = {
//   name: "",
//   slug: "",
//   base_price: "",
//   category_id: "",
//   description: "",
//   discount_pct: "",
//   is_available: true,
//   is_featured: false,
// };

// export default function AdminCakesPage() {
//   const [cakes, setCakes] = useState<Cake[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState(emptyForm);
//   const [saving, setSaving] = useState(false);

//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [newImageUrl, setNewImageUrl] = useState("");
//   const [newSizeLabel, setNewSizeLabel] = useState("");
//   const [newSizePrice, setNewSizePrice] = useState("");

//   useEffect(() => {
//     loadAll();
//   }, []);

//   async function loadAll() {
//     setLoading(true);
//     const [cakesRes, catsRes] = await Promise.all([
//       CakeRepository.getAllAdmin(),
//       CakeRepository.getCategories(),
//     ]);

//     if (cakesRes.error) {
//       setErrorMsg(cakesRes.error.message);
//     } else {
//       setCakes((cakesRes.data as Cake[]) ?? []);
//       setErrorMsg(null);
//     }

//     if (catsRes.data) setCategories(catsRes.data as Category[]);
//     setLoading(false);
//   }

//   function openCreateForm() {
//     setForm(emptyForm);
//     setEditingId(null);
//     setShowForm(true);
//   }

//   function openEditForm(cake: Cake) {
//     setForm({
//       name: cake.name,
//       slug: cake.slug,
//       base_price: String(cake.base_price ?? ""),
//       category_id: cake.category_id ?? "",
//       description: cake.description ?? "",
//       discount_pct: String(cake.discount_pct ?? ""),
//       is_available: cake.is_available,
//       is_featured: cake.is_featured,
//     });
//     setEditingId(cake.id);
//     setShowForm(true);
//   }

//   function slugify(text: string) {
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   }

//   async function handleSave() {
//     if (!form.name.trim() || !form.base_price) {
//       alert("Name and base price are required.");
//       return;
//     }

//     setSaving(true);

//     const payload = {
//       name: form.name.trim(),
//       slug: form.slug.trim() || slugify(form.name),
//       base_price: Number(form.base_price),
//       category_id: form.category_id || undefined,
//       description: form.description.trim() || undefined,
//       discount_pct: form.discount_pct ? Number(form.discount_pct) : 0,
//       is_available: form.is_available,
//       is_featured: form.is_featured,
//     };

//     if (editingId) {
//       const { error } = await CakeRepository.update(editingId, payload);
//       if (error) {
//         alert("Failed to update cake: " + error.message);
//       } else {
//         setShowForm(false);
//         await loadAll();
//       }
//     } else {
//       const { error } = await CakeRepository.create(payload);
//       if (error) {
//         alert("Failed to create cake: " + error.message);
//       } else {
//         setShowForm(false);
//         await loadAll();
//       }
//     }

//     setSaving(false);
//   }

//   async function handleDeleteCake(id: string, name: string) {
//     if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
//     const { error } = await CakeRepository.delete(id);
//     if (error) {
//       alert("Failed to delete cake: " + error.message);
//     } else {
//       await loadAll();
//     }
//   }

//   async function handleAddImage(cakeId: string) {
//     if (!newImageUrl.trim()) return;
//     const { error } = await CakeImageRepository.add({
//       cake_id: cakeId,
//       url: newImageUrl.trim(),
//     });
//     if (error) {
//       alert("Failed to add image: " + error.message);
//     } else {
//       setNewImageUrl("");
//       await loadAll();
//     }
//   }

//   async function handleDeleteImage(imageId: string) {
//     const { error } = await CakeImageRepository.delete(imageId);
//     if (error) {
//       alert("Failed to delete image: " + error.message);
//     } else {
//       await loadAll();
//     }
//   }

//   async function handleSetPrimary(cakeId: string, imageId: string) {
//     const { error } = await CakeImageRepository.setPrimary(cakeId, imageId);
//     if (error) {
//       alert("Failed to set primary image: " + error.message);
//     } else {
//       await loadAll();
//     }
//   }

//   async function handleAddSize(cakeId: string) {
//     if (!newSizeLabel.trim()) return;
//     const { error } = await CakeSizeRepository.add({
//       cake_id: cakeId,
//       label: newSizeLabel.trim(),
//       price_add: newSizePrice ? Number(newSizePrice) : 0,
//     });
//     if (error) {
//       alert("Failed to add size: " + error.message);
//     } else {
//       setNewSizeLabel("");
//       setNewSizePrice("");
//       await loadAll();
//     }
//   }

//   async function handleDeleteSize(sizeId: string) {
//     const { error } = await CakeSizeRepository.delete(sizeId);
//     if (error) {
//       alert("Failed to delete size: " + error.message);
//     } else {
//       await loadAll();
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="font-display text-3xl text-cocoa mb-1">Cakes</h1>
//           <p className="font-body text-sm text-cocoa-soft">
//             Manage your cake catalog, images, and sizes
//           </p>
//         </div>
//         <button
//           onClick={openCreateForm}
//           className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2.5"
//         >
//           + Add cake
//         </button>
//       </div>

//       {errorMsg && (
//         <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 font-body text-sm mb-4">
//           Failed to load cakes: {errorMsg}
//         </div>
//       )}

//       {/* Create / Edit form */}
//       {showForm && (
//         <div className="bg-white border border-beige-border rounded-2xl p-6 mb-6">
//           <h2 className="font-display text-xl text-cocoa mb-4">
//             {editingId ? "Edit cake" : "Add new cake"}
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="font-body text-xs text-cocoa-soft block mb-1">
//                 Name *
//               </label>
//               <input
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
//                 placeholder="Chocolate Truffle Cake"
//               />
//             </div>

//             <div>
//               <label className="font-body text-xs text-cocoa-soft block mb-1">
//                 Slug (auto-generated if blank)
//               </label>
//               <input
//                 value={form.slug}
//                 onChange={(e) => setForm({ ...form, slug: e.target.value })}
//                 className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
//                 placeholder="chocolate-truffle-cake"
//               />
//             </div>

//             <div>
//               <label className="font-body text-xs text-cocoa-soft block mb-1">
//                 Base price (৳) *
//               </label>
//               <input
//                 type="number"
//                 value={form.base_price}
//                 onChange={(e) =>
//                   setForm({ ...form, base_price: e.target.value })
//                 }
//                 className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
//                 placeholder="1200"
//               />
//             </div>

//             <div>
//               <label className="font-body text-xs text-cocoa-soft block mb-1">
//                 Discount %
//               </label>
//               <input
//                 type="number"
//                 value={form.discount_pct}
//                 onChange={(e) =>
//                   setForm({ ...form, discount_pct: e.target.value })
//                 }
//                 className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
//                 placeholder="0"
//               />
//             </div>

//             <div>
//               <label className="font-body text-xs text-cocoa-soft block mb-1">
//                 Category
//               </label>
//               <select
//                 value={form.category_id}
//                 onChange={(e) =>
//                   setForm({ ...form, category_id: e.target.value })
//                 }
//                 className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
//               >
//                 <option value="">No category</option>
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex items-center gap-6 pt-6">
//               <label className="flex items-center gap-2 font-body text-sm text-cocoa">
//                 <input
//                   type="checkbox"
//                   checked={form.is_available}
//                   onChange={(e) =>
//                     setForm({ ...form, is_available: e.target.checked })
//                   }
//                 />
//                 Available
//               </label>
//               <label className="flex items-center gap-2 font-body text-sm text-cocoa">
//                 <input
//                   type="checkbox"
//                   checked={form.is_featured}
//                   onChange={(e) =>
//                     setForm({ ...form, is_featured: e.target.checked })
//                   }
//                 />
//                 Featured
//               </label>
//             </div>

//             <div className="md:col-span-2">
//               <label className="font-body text-xs text-cocoa-soft block mb-1">
//                 Description
//               </label>
//               <textarea
//                 value={form.description}
//                 onChange={(e) =>
//                   setForm({ ...form, description: e.target.value })
//                 }
//                 rows={3}
//                 className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
//                 placeholder="Rich chocolate layers with truffle ganache..."
//               />
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2 disabled:opacity-40"
//             >
//               {saving
//                 ? "Saving..."
//                 : editingId
//                   ? "Save changes"
//                   : "Create cake"}
//             </button>
//             <button
//               onClick={() => setShowForm(false)}
//               disabled={saving}
//               className="font-body text-sm font-semibold border-2 border-beige-border text-cocoa rounded-pill px-5 py-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <p className="font-body text-sm text-cocoa-soft">Loading cakes...</p>
//       ) : cakes.length === 0 ? (
//         <p className="font-body text-sm text-cocoa-soft">
//           No cakes yet — add your first one above.
//         </p>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {cakes.map((cake) => (
//             <div
//               key={cake.id}
//               className="bg-white border border-beige-border rounded-2xl p-5"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-4">
//                   <div className="w-16 h-16 bg-beige rounded-xl overflow-hidden flex items-center justify-center shrink-0">
//                     {cake.cake_images?.[0]?.url ? (
//                       <img
//                         src={
//                           cake.cake_images.find((i) => i.is_primary)?.url ??
//                           cake.cake_images[0].url
//                         }
//                         alt={cake.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="font-body text-[10px] text-cocoa-soft">
//                         no photo
//                       </span>
//                     )}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <p className="font-display text-lg text-cocoa">
//                         {cake.name}
//                       </p>
//                       {!cake.is_available && (
//                         <span className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-red-100 text-red-700 border border-red-300">
//                           Unavailable
//                         </span>
//                       )}
//                       {cake.is_featured && (
//                         <span className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-yellow-100 text-yellow-700 border border-yellow-300">
//                           Featured
//                         </span>
//                       )}
//                     </div>
//                     <p className="font-body text-xs text-cocoa-soft">
//                       ৳{cake.base_price}
//                       {cake.discount_pct ? ` · ${cake.discount_pct}% off` : ""}
//                       {cake.categories?.name
//                         ? ` · ${cake.categories.name}`
//                         : ""}
//                     </p>
//                     <p className="font-body text-xs text-cocoa-soft">
//                       {cake.cake_images?.length ?? 0} image
//                       {cake.cake_images?.length !== 1 ? "s" : ""} ·{" "}
//                       {cake.cake_sizes?.length ?? 0} size
//                       {cake.cake_sizes?.length !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-2 shrink-0">
//                   <button
//                     onClick={() =>
//                       setExpandedId(expandedId === cake.id ? null : cake.id)
//                     }
//                     className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
//                   >
//                     {expandedId === cake.id ? "Close" : "Images & sizes"}
//                   </button>
//                   <button
//                     onClick={() => openEditForm(cake)}
//                     className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteCake(cake.id, cake.name)}
//                     className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill bg-red-600 text-white"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>

//               {expandedId === cake.id && (
//                 <div className="mt-5 pt-5 border-t border-beige-border grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Images */}
//                   <div>
//                     <p className="font-body text-xs font-semibold text-cocoa mb-2">
//                       Images
//                     </p>
//                     <div className="flex flex-col gap-2 mb-3">
//                       {cake.cake_images?.map((img) => (
//                         <div
//                           key={img.id}
//                           className="flex items-center gap-2 bg-beige rounded-lg p-2"
//                         >
//                           <img
//                             src={img.url}
//                             alt=""
//                             className="w-10 h-10 object-cover rounded"
//                           />
//                           <span className="font-body text-xs text-cocoa truncate flex-1">
//                             {img.url}
//                           </span>
//                           {img.is_primary ? (
//                             <span className="font-body text-[10px] font-semibold text-pistachio">
//                               Primary
//                             </span>
//                           ) : (
//                             <button
//                               onClick={() => handleSetPrimary(cake.id, img.id)}
//                               className="font-body text-[10px] text-cocoa-soft underline"
//                             >
//                               Set primary
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDeleteImage(img.id)}
//                             className="font-body text-[10px] text-red-600"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                       {(!cake.cake_images || cake.cake_images.length === 0) && (
//                         <p className="font-body text-xs text-cocoa-soft italic">
//                           No images yet
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex gap-2">
//                       <input
//                         value={newImageUrl}
//                         onChange={(e) => setNewImageUrl(e.target.value)}
//                         placeholder="Image URL"
//                         className="flex-1 border border-beige-border rounded-lg px-3 py-2 font-body text-xs"
//                       />
//                       <button
//                         onClick={() => handleAddImage(cake.id)}
//                         className="font-body text-xs font-semibold bg-cocoa text-cream rounded-lg px-3 py-2"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>

//                   {/* Sizes */}
//                   <div>
//                     <p className="font-body text-xs font-semibold text-cocoa mb-2">
//                       Sizes
//                     </p>
//                     <div className="flex flex-col gap-2 mb-3">
//                       {cake.cake_sizes?.map((size) => (
//                         <div
//                           key={size.id}
//                           className="flex items-center gap-2 bg-beige rounded-lg p-2"
//                         >
//                           <span className="font-body text-xs text-cocoa flex-1">
//                             {size.label}
//                           </span>
//                           <span className="font-body text-xs text-cocoa-soft">
//                             +৳{size.price_add ?? 0}
//                           </span>
//                           <button
//                             onClick={() => handleDeleteSize(size.id)}
//                             className="font-body text-[10px] text-red-600"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                       {(!cake.cake_sizes || cake.cake_sizes.length === 0) && (
//                         <p className="font-body text-xs text-cocoa-soft italic">
//                           No sizes yet
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex gap-2">
//                       <input
//                         value={newSizeLabel}
//                         onChange={(e) => setNewSizeLabel(e.target.value)}
//                         placeholder="Label (e.g. Small)"
//                         className="flex-1 border border-beige-border rounded-lg px-3 py-2 font-body text-xs"
//                       />
//                       <input
//                         value={newSizePrice}
//                         onChange={(e) => setNewSizePrice(e.target.value)}
//                         placeholder="+ price"
//                         type="number"
//                         className="w-24 border border-beige-border rounded-lg px-3 py-2 font-body text-xs"
//                       />
//                       <button
//                         onClick={() => handleAddSize(cake.id)}
//                         className="font-body text-xs font-semibold bg-cocoa text-cream rounded-lg px-3 py-2"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import {
  CakeRepository,
  CakeImageRepository,
  CakeSizeRepository,
} from "@/lib/repositories/cakeRepository";
import ImageUpload from "@/components/ui/ImageUpload";

type CakeImage = {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order?: number;
};

type CakeSize = {
  id: string;
  label: string;
  price_add: number;
};

type Cake = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  category_id?: string | null;
  description?: string;
  discount_pct?: number;
  is_available: boolean;
  is_featured: boolean;
  cake_images: CakeImage[];
  cake_sizes: CakeSize[];
  categories?: { name: string } | null;
};

type Category = {
  id: string;
  name: string;
};

const emptyForm = {
  name: "",
  slug: "",
  base_price: "",
  category_id: "",
  description: "",
  discount_pct: "",
  is_available: true,
  is_featured: false,
};

export default function AdminCakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newSizePrice, setNewSizePrice] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [cakesRes, catsRes] = await Promise.all([
      CakeRepository.getAllAdmin(),
      CakeRepository.getCategories(),
    ]);

    if (cakesRes.error) {
      setErrorMsg(cakesRes.error.message);
    } else {
      setCakes((cakesRes.data as Cake[]) ?? []);
      setErrorMsg(null);
    }

    if (catsRes.data) setCategories(catsRes.data as Category[]);
    setLoading(false);
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(cake: Cake) {
    setForm({
      name: cake.name,
      slug: cake.slug,
      base_price: String(cake.base_price ?? ""),
      category_id: cake.category_id ?? "",
      description: cake.description ?? "",
      discount_pct: String(cake.discount_pct ?? ""),
      is_available: cake.is_available,
      is_featured: cake.is_featured,
    });
    setEditingId(cake.id);
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
    if (!form.name.trim() || !form.base_price) {
      alert("Name and base price are required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      base_price: Number(form.base_price),
      category_id: form.category_id || undefined,
      description: form.description.trim() || undefined,
      discount_pct: form.discount_pct ? Number(form.discount_pct) : 0,
      is_available: form.is_available,
      is_featured: form.is_featured,
    };

    if (editingId) {
      const { error } = await CakeRepository.update(editingId, payload);
      if (error) {
        alert("Failed to update cake: " + error.message);
      } else {
        setShowForm(false);
        await loadAll();
      }
    } else {
      const { error } = await CakeRepository.create(payload);
      if (error) {
        alert("Failed to create cake: " + error.message);
      } else {
        setShowForm(false);
        await loadAll();
      }
    }

    setSaving(false);
  }

  async function handleDeleteCake(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    const { error } = await CakeRepository.delete(id);
    if (error) {
      alert("Failed to delete cake: " + error.message);
    } else {
      await loadAll();
    }
  }

  async function handleAddImage(cakeId: string, url: string) {
    const { error } = await CakeImageRepository.add({
      cake_id: cakeId,
      url,
    });
    if (error) {
      alert("Failed to add image: " + error.message);
    } else {
      await loadAll();
    }
  }

  async function handleDeleteImage(imageId: string) {
    const { error } = await CakeImageRepository.delete(imageId);
    if (error) {
      alert("Failed to delete image: " + error.message);
    } else {
      await loadAll();
    }
  }

  async function handleSetPrimary(cakeId: string, imageId: string) {
    const { error } = await CakeImageRepository.setPrimary(cakeId, imageId);
    if (error) {
      alert("Failed to set primary image: " + error.message);
    } else {
      await loadAll();
    }
  }

  async function handleAddSize(cakeId: string) {
    if (!newSizeLabel.trim()) return;
    const { error } = await CakeSizeRepository.add({
      cake_id: cakeId,
      label: newSizeLabel.trim(),
      price_add: newSizePrice ? Number(newSizePrice) : 0,
    });
    if (error) {
      alert("Failed to add size: " + error.message);
    } else {
      setNewSizeLabel("");
      setNewSizePrice("");
      await loadAll();
    }
  }

  async function handleDeleteSize(sizeId: string) {
    const { error } = await CakeSizeRepository.delete(sizeId);
    if (error) {
      alert("Failed to delete size: " + error.message);
    } else {
      await loadAll();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-cocoa mb-1">Cakes</h1>
          <p className="font-body text-sm text-cocoa-soft">
            Manage your cake catalog, images, and sizes
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="font-body text-sm font-semibold bg-cocoa text-cream rounded-pill px-5 py-2.5"
        >
          + Add cake
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 font-body text-sm mb-4">
          Failed to load cakes: {errorMsg}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="bg-white border border-beige-border rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl text-cocoa mb-4">
            {editingId ? "Edit cake" : "Add new cake"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="Chocolate Truffle Cake"
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
                placeholder="chocolate-truffle-cake"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Base price (৳) *
              </label>
              <input
                type="number"
                value={form.base_price}
                onChange={(e) =>
                  setForm({ ...form, base_price: e.target.value })
                }
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="1200"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Discount %
              </label>
              <input
                type="number"
                value={form.discount_pct}
                onChange={(e) =>
                  setForm({ ...form, discount_pct: e.target.value })
                }
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 font-body text-sm text-cocoa">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) =>
                    setForm({ ...form, is_available: e.target.checked })
                  }
                />
                Available
              </label>
              <label className="flex items-center gap-2 font-body text-sm text-cocoa">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm({ ...form, is_featured: e.target.checked })
                  }
                />
                Featured
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="font-body text-xs text-cocoa-soft block mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full border border-beige-border rounded-lg px-3 py-2 font-body text-sm"
                placeholder="Rich chocolate layers with truffle ganache..."
              />
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
                  : "Create cake"}
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
        <p className="font-body text-sm text-cocoa-soft">Loading cakes...</p>
      ) : cakes.length === 0 ? (
        <p className="font-body text-sm text-cocoa-soft">
          No cakes yet — add your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {cakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-white border border-beige-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-beige rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    {cake.cake_images?.[0]?.url ? (
                      <img
                        src={
                          cake.cake_images.find((i) => i.is_primary)?.url ??
                          cake.cake_images[0].url
                        }
                        alt={cake.name}
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
                        {cake.name}
                      </p>
                      {!cake.is_available && (
                        <span className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-red-100 text-red-700 border border-red-300">
                          Unavailable
                        </span>
                      )}
                      {cake.is_featured && (
                        <span className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-yellow-100 text-yellow-700 border border-yellow-300">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-cocoa-soft">
                      ৳{cake.base_price}
                      {cake.discount_pct ? ` · ${cake.discount_pct}% off` : ""}
                      {cake.categories?.name
                        ? ` · ${cake.categories.name}`
                        : ""}
                    </p>
                    <p className="font-body text-xs text-cocoa-soft">
                      {cake.cake_images?.length ?? 0} image
                      {cake.cake_images?.length !== 1 ? "s" : ""} ·{" "}
                      {cake.cake_sizes?.length ?? 0} size
                      {cake.cake_sizes?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === cake.id ? null : cake.id)
                    }
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
                  >
                    {expandedId === cake.id ? "Close" : "Images & sizes"}
                  </button>
                  <button
                    onClick={() => openEditForm(cake)}
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill border-2 border-beige-border text-cocoa"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCake(cake.id, cake.name)}
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-pill bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === cake.id && (
                <div className="mt-5 pt-5 border-t border-beige-border grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Images */}
                  <div>
                    <p className="font-body text-xs font-semibold text-cocoa mb-2">
                      Images
                    </p>
                    <div className="flex flex-col gap-2 mb-3">
                      {cake.cake_images?.map((img) => (
                        <div
                          key={img.id}
                          className="flex items-center gap-2 bg-beige rounded-lg p-2"
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="font-body text-xs text-cocoa truncate flex-1">
                            {img.url}
                          </span>
                          {img.is_primary ? (
                            <span className="font-body text-[10px] font-semibold text-pistachio">
                              Primary
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimary(cake.id, img.id)}
                              className="font-body text-[10px] text-cocoa-soft underline"
                            >
                              Set primary
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="font-body text-[10px] text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {(!cake.cake_images || cake.cake_images.length === 0) && (
                        <p className="font-body text-xs text-cocoa-soft italic">
                          No images yet
                        </p>
                      )}
                    </div>
                    <ImageUpload
                      folder="cakes"
                      onUploaded={(url) => handleAddImage(cake.id, url)}
                      label="image"
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <p className="font-body text-xs font-semibold text-cocoa mb-2">
                      Sizes
                    </p>
                    <div className="flex flex-col gap-2 mb-3">
                      {cake.cake_sizes?.map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center gap-2 bg-beige rounded-lg p-2"
                        >
                          <span className="font-body text-xs text-cocoa flex-1">
                            {size.label}
                          </span>
                          <span className="font-body text-xs text-cocoa-soft">
                            +৳{size.price_add ?? 0}
                          </span>
                          <button
                            onClick={() => handleDeleteSize(size.id)}
                            className="font-body text-[10px] text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {(!cake.cake_sizes || cake.cake_sizes.length === 0) && (
                        <p className="font-body text-xs text-cocoa-soft italic">
                          No sizes yet
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newSizeLabel}
                        onChange={(e) => setNewSizeLabel(e.target.value)}
                        placeholder="Label (e.g. Small)"
                        className="flex-1 border border-beige-border rounded-lg px-3 py-2 font-body text-xs"
                      />
                      <input
                        value={newSizePrice}
                        onChange={(e) => setNewSizePrice(e.target.value)}
                        placeholder="+ price"
                        type="number"
                        className="w-24 border border-beige-border rounded-lg px-3 py-2 font-body text-xs"
                      />
                      <button
                        onClick={() => handleAddSize(cake.id)}
                        className="font-body text-xs font-semibold bg-cocoa text-cream rounded-lg px-3 py-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
