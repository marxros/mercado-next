import { apiGet } from "@/lib/fetch";

export async function getMyOrders() {
  return apiGet(`/orders/me`, { next: { revalidate: 60, tags: ["orders"] } });
}

export async function getOrder(orderId: string) {
  return apiGet(`/orders/${orderId}`, { next: { revalidate: 30, tags: ["orders", `order:${orderId}`] } });
}


