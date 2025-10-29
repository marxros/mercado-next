import { RequireAuth } from "@/components-client/RequireAuth";

export default function AdminProductsPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "PRODUCER"]}>
      <div>Admin - Produtos</div>
    </RequireAuth>
  );
}


