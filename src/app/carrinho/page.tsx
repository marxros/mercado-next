"use client";

import { useCart, cartUtils } from "@/shared/providers/CartProvider";
import Link from "next/link";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const finalTotal = cartUtils.calculateFinalTotal(totalPrice);
  return (
    <main>
      <h1>Carrinho ({totalItems})</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio. <Link href="/produtos">Ver produtos</Link></p>
      ) : (
        <>
          <ul>
            {items.map(item => (
              <li key={item.productId}>
                <strong>{item.name}</strong>
                <div>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.productId)}>Remover</button>
              </li>
            ))}
          </ul>
          <p>Total: {cartUtils.formatPrice(totalPrice)} | Final: {cartUtils.formatPrice(finalTotal)}</p>
          <button onClick={clearCart}>Limpar</button>
          <Link href="/checkout">Ir para checkout</Link>
        </>
      )}
    </main>
  );
}


