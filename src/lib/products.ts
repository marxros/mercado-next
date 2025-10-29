import { apiGet } from "@/lib/fetch";

export async function getProduct(slug: string) {
  return apiGet(`/products/${slug}`, { next: { revalidate: 300, tags: ["products", `product:${slug}`] } });
}

export async function getFeaturedProducts() {
  return apiGet(`/products/featured`, { next: { revalidate: 120, tags: ["products"] } });
}


