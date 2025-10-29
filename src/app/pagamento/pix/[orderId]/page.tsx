type Params = { params: { orderId: string } };

export default function PaymentPixPage({ params }: Params) {
  return <div>Pagamento PIX #{params.orderId}</div>;
}


