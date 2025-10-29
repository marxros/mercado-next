"use client";

import { useState } from "react";
import { useCart } from "@/shared/providers/CartProvider";

type Props = {
  product: { id: string; name: string; price: number };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const onAdd = async () => {
    try {
      setIsAdding(true);
      addItem({ productId: product.id, name: product.name, price: product.price }, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button onClick={onAdd} disabled={isAdding}>
      {isAdding ? "Adicionando..." : "Adicionar ao carrinho"}
    </button>
  );
}


