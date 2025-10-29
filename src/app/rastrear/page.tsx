"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderTrackingIndexPage() {
  const [id, setId] = useState("");
  const router = useRouter();
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (id) router.push(`/rastrear/${id}`); }}>
      <h1>Rastrear pedido</h1>
      <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Código do pedido" />
      <button type="submit">Rastrear</button>
    </form>
  );
}


