import { RequireAuth } from "@/components-client/RequireAuth";

export default function DashboardPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "PRODUCER", "DELIVERER"]}>
      <div>Dashboard</div>
    </RequireAuth>
  );
}


