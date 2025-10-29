import { getOrder } from "@/lib/orders";
type Params = { params: { orderId: string } };

export default async function OrderDetailPage({ params }: Params) {
  const order = await getOrder(params.orderId);
  return (
    <main>
      <h1>Pedido #{order.id}</h1>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </main>
  );
}


