import { RequireAuth } from "@/components-client/RequireAuth";

export default function OrdersPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "PRODUCER"]}>
      <div>Pedidos</div>
    </RequireAuth>
  );
}


