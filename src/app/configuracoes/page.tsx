import { RequireAuth } from "@/components-client/RequireAuth";

export default function ConfigPage() {
  return (
    <RequireAuth>
      <div>Configurações</div>
    </RequireAuth>
  );
}


