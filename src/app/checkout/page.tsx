"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart, cartUtils } from "@/shared/providers/CartProvider";

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().min(4),
});

export default function CheckoutPage() {
  const { totalPrice, items, clearCart } = useCart();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log(data); // TODO: server action/payment flow
    clearCart();
    alert("Pedido realizado!");
  };

  const finalTotal = cartUtils.calculateFinalTotal(totalPrice);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Checkout</h1>
      <div>
        <input placeholder="Nome" {...register("name")} />
        {errors.name && <span>Nome inválido</span>}
      </div>
      <div>
        <input placeholder="Endereço" {...register("address")} />
        {errors.address && <span>Endereço inválido</span>}
      </div>
      <div>
        <input placeholder="Cidade" {...register("city")} />
        {errors.city && <span>Cidade inválida</span>}
      </div>
      <div>
        <input placeholder="CEP" {...register("zip")} />
        {errors.zip && <span>CEP inválido</span>}
      </div>
      <p>Itens: {items.length} | Total: {cartUtils.formatPrice(finalTotal)}</p>
      <button type="submit">Finalizar</button>
    </form>
  );
}


