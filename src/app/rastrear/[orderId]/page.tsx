type Params = { params: { orderId: string } };

export default function OrderTrackingPage({ params }: Params) {
  return <div>Rastrear pedido #{params.orderId}</div>;
}


