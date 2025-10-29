import { RequireAuth } from "@/components-client/RequireAuth";

export default function DeliveriesPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "DELIVERER"]}>
      <div>Entregas</div>
    </RequireAuth>
  );
}


