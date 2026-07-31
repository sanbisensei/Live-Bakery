// "use client";

// import { useCart } from "@/lib/cartContext";

// type Props = {
//   cake: {
//     id: string;
//     name: string;
//     slug: string;
//     base_price: number;
//     discount_pct: number;
//   };
//   selectedSizeId?: string;
//   selectedSizeLabel?: string;
//   selectedPriceAdd?: number;
// };

// export default function AddToOrderButton({
//   cake,
//   selectedSizeId,
//   selectedSizeLabel,
//   selectedPriceAdd,
// }: Props) {
//   const { addItem } = useCart();

//   const finalPrice =
//     cake.discount_pct > 0
//       ? Math.round(cake.base_price * (1 - cake.discount_pct / 100))
//       : cake.base_price;

//   function handleAdd() {
//     addItem({
//       cakeId: cake.id,
//       cakeName: cake.name,
//       slug: cake.slug,
//       sizeId: selectedSizeId,
//       sizeLabel: selectedSizeLabel,
//       priceAdd: selectedPriceAdd ?? 0,
//       unitPrice: finalPrice,
//       quantity: 1,
//     });
//     alert(`${cake.name} added to your order!`);
//   }

//   return (
//     <button
//       onClick={handleAdd}
//       className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill py-3 px-6 w-full md:w-fit"
//     >
//       Add to order
//     </button>
//   );
// }
"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import Toast from "@/components/ui/Toast";

type Props = {
  cake: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    discount_pct: number;
  };
  selectedSizeId?: string;
  selectedSizeLabel?: string;
  selectedPriceAdd?: number;
  // added new
  className?: string;
};

export default function AddToOrderButton({
  cake,
  selectedSizeId,
  selectedSizeLabel,
  selectedPriceAdd,
  // added new
  className = "",
}: Props) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);

  // Use the selected size's price if available, otherwise fall back to base_price
  const basePriceForSize = selectedPriceAdd ?? cake.base_price;

  const finalPrice =
    cake.discount_pct > 0
      ? Math.round(basePriceForSize * (1 - cake.discount_pct / 100))
      : basePriceForSize;

  function handleAdd() {
    addItem({
      cakeId: cake.id,
      cakeName: cake.name,
      slug: cake.slug,
      sizeId: selectedSizeId,
      sizeLabel: selectedSizeLabel,
      priceAdd: 0,
      unitPrice: finalPrice,
      quantity: 1,
    });
    setShowToast(true);
  }

  return (
    <>
      <button
        onClick={handleAdd}
        className={`font-display text-xl bg-orange text-cocoa rounded-pill
inline-flex items-center justify-center h-10 px-6 w-full
transition-colors duration-200 hover:bg-orange-dark ${className}`}
      >
        Add to order
      </button>

      <Toast
        show={showToast}
        onDone={() => setShowToast(false)}
        message={`${cake.name} added to your order`}
        subtext={
          selectedSizeLabel
            ? `${selectedSizeLabel} · ৳${finalPrice}`
            : undefined
        }
      />
    </>
  );
}
