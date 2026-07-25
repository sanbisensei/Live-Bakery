"use client";

import { useState } from "react";

type Size = {
  id: string;
  label: string;
  price_add: number;
};

type Props = {
  sizes: Size[];
  onSelect: (size: Size) => void;
};

export default function SizeSelector({ sizes, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState(sizes[0]?.id);

  function handleSelect(size: Size) {
    setSelectedId(size.id);
    onSelect(size);
  }

  return (
    <div>
      <p className="font-body text-xs text-cocoa-soft mb-2">Select size</p>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => handleSelect(size)}
            className={`font-body text-sm px-4 py-2 rounded-pill border-2 transition-colors
              ${
                selectedId === size.id
                  ? "bg-cocoa text-cream border-cocoa"
                  : "bg-cream text-cocoa border-cocoa"
              }`}
          >
            {size.label}
            {size.price_add > 0 && (
              <span className="ml-1 text-xs">+৳{size.price_add}</span>
            )}
          </button>
        ))}
      </div>
      <p className="font-body text-xs text-cocoa-soft mt-2">
        Price adjusts based on selected size
      </p>
    </div>
  );
}
