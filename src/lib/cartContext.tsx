"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type CartItem = {
  cakeId: string;
  cakeName: string;
  slug: string;
  sizeId?: string;
  sizeLabel?: string;
  priceAdd?: number;
  unitPrice: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cakeId: string, sizeId?: string) => void;
  updateQuantity: (
    cakeId: string,
    sizeId: string | undefined,
    quantity: number,
  ) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

// Lazy initializer — reads localStorage once on first render, no useEffect needed
function getInitialItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("bakery_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialItems);

  // Only saves to localStorage — never sets state, no cascade
  useEffect(() => {
    localStorage.setItem("bakery_cart", JSON.stringify(items));
  }, [items]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.cakeId === newItem.cakeId && i.sizeId === newItem.sizeId,
      );
      if (existing) {
        return prev.map((i) =>
          i.cakeId === newItem.cakeId && i.sizeId === newItem.sizeId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i,
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(cakeId: string, sizeId?: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.cakeId === cakeId && i.sizeId === sizeId)),
    );
  }

  function updateQuantity(
    cakeId: string,
    sizeId: string | undefined,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeItem(cakeId, sizeId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.cakeId === cakeId && i.sizeId === sizeId ? { ...i, quantity } : i,
      ),
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem("bakery_cart");
  }

  const total = items.reduce(
    (sum, i) => sum + (i.unitPrice + (i.priceAdd ?? 0)) * i.quantity,
    0,
  );

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
