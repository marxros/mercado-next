"use client";

import { useRouter } from "next/navigation";
import { ShoppingBasket, MapPin, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/shared/providers/AuthProvider";
import { useCart } from "@/shared/providers/CartProvider";

export default function Header() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  const goTo = (path: string) => router.push(path);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
            <ShoppingBasket className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mercadô</h1>
            <p className="text-xs text-muted-foreground">Feira do Sertão</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => goTo("/mapa-produtores")}>
            <MapPin className="mr-2 h-4 w-4" />
            Mapa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo("/carrinho")}
            className="relative flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => goTo("/dashboard")}>
                Dashboard
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => goTo("/login")}>
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
