"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/shared/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CartButton() {
  const { totalItems } = useCart();
  return (
    <Button variant="default" size="sm" asChild className="relative">
      <Link href="/carrinho" aria-label="Carrinho">
        <ShoppingCart className="w-4 h-4" />
        <span className="hidden sm:inline ml-2">Carrinho</span>
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground border-2 border-background">
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
}


