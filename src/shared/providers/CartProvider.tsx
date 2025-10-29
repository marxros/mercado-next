"use client";

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = { productId: string; name: string; price: number; stock?: number; quantity: number };

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mercado_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.productId === item.productId);
      if (found) {
        return prev.map(p => (p.productId === item.productId ? { ...p, quantity: p.quantity + quantity } : p));
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.productId !== productId));

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems(prev => prev.map(i => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);
  const isInCart = (productId: string) => items.some(i => i.productId === productId);
  const getItemQuantity = (productId: string) => items.find(i => i.productId === productId)?.quantity ?? 0;

  const value = useMemo<CartContextType>(() => ({
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [items, totalItems, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const cartUtils = {
  calculateShipping: (totalPrice: number): number => (totalPrice >= 50 ? 0 : 10),
  calculateFinalTotal: (totalPrice: number): number => totalPrice + cartUtils.calculateShipping(totalPrice),
  formatPrice: (price: number): string => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price),
};


