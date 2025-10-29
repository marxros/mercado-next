"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  Search,
  RefreshCw,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/shared/providers/AuthProvider";
import { useCart } from "@/shared/providers/CartProvider";

const statusOptions = [
  { value: "todos", label: "Todos os pedidos" },
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PREPARING", label: "Preparando" },
  { value: "IN_TRANSIT", label: "Em trânsito" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
];

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderStatus = (typeof statusOptions)[number]["value"]; // includes "todos"

type Order = {
  id: string;
  status: Exclude<OrderStatus, "todos">;
  createdAt: string;
  deliveryTime: string;
  deliveryAddress: string;
  paymentMethod: string;
  total: number;
  trackingCode?: string;
  items: OrderItem[];
};

const ordersMock: Order[] = [
  {
    id: "PED-1024",
    status: "IN_TRANSIT",
    createdAt: "2024-03-16T14:30:00-03:00",
    deliveryTime: "Previsto para 17/03 às 18h",
    deliveryAddress: "Rua do Sol, 123 - Centro, Maceió - AL",
    paymentMethod: "PIX",
    total: 87.4,
    trackingCode: "RT123456789BR",
    items: [
      { productId: "queijo-coalho", name: "Queijo coalho artesanal", quantity: 2, price: 14.9 },
      { productId: "mel-silvestre", name: "Mel silvestre puro", quantity: 1, price: 22 },
      { productId: "castanha-caju", name: "Castanha de caju torrada", quantity: 1, price: 12.9 },
    ],
  },
  {
    id: "PED-1018",
    status: "DELIVERED",
    createdAt: "2024-03-08T10:15:00-03:00",
    deliveryTime: "Entregue em 08/03 às 15h",
    deliveryAddress: "Av. dos Ipês, 456 - Farol, Maceió - AL",
    paymentMethod: "Cartão de crédito",
    total: 54.7,
    trackingCode: "RT987654321BR",
    items: [
      { productId: "farinha-mandioca", name: "Farinha de mandioca especial", quantity: 2, price: 9.9 },
      { productId: "tapioca-fresca", name: "Tapioca fresca", quantity: 3, price: 4.9 },
      { productId: "polpa-frutas", name: "Polpa de frutas congelada", quantity: 2, price: 8.9 },
    ],
  },
  {
    id: "PED-1002",
    status: "PENDING",
    createdAt: "2024-03-02T09:50:00-03:00",
    deliveryTime: "Aguardando confirmação do produtor",
    deliveryAddress: "Rua das Flores, 78 - Trapiche, Maceió - AL",
    paymentMethod: "Boleto",
    total: 32.3,
    items: [
      { productId: "rapadura-artesanal", name: "Rapadura artesanal", quantity: 3, price: 6.9 },
      { productId: "doce-leite", name: "Doce de leite cremoso", quantity: 1, price: 12.9 },
    ],
  },
];

const statusStyles: Record<Exclude<OrderStatus, "todos">, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function getStatusLabel(status: Exclude<OrderStatus, "todos">) {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "CONFIRMED":
      return "Confirmado";
    case "PREPARING":
      return "Preparando";
    case "IN_TRANSIT":
      return "Em trânsito";
    case "DELIVERED":
      return "Entregue";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
}

function getStatusIcon(status: Exclude<OrderStatus, "todos">) {
  switch (status) {
    case "PENDING":
      return Clock;
    case "CONFIRMED":
      return CheckCircle;
    case "PREPARING":
      return Package;
    case "IN_TRANSIT":
      return Truck;
    case "DELIVERED":
      return CheckCircle;
    case "CANCELLED":
      return AlertCircle;
    default:
      return Clock;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("todos");
  const [refreshing, setRefreshing] = useState(false);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return ordersMock.filter((order) => {
      const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
      if (!normalizedSearch) return matchesStatus;
      const tokens = [
        order.id,
        order.status,
        order.deliveryAddress,
        ...order.items.map((item) => item.name),
      ]
        .join(" ")
        .toLowerCase();
      return matchesStatus && tokens.includes(normalizedSearch);
    });
  }, [searchTerm, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Pedidos atualizados");
    }, 900);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({ productId: item.productId, name: item.name, price: item.price }, item.quantity);
    });
    toast.success("Itens adicionados ao carrinho!");
    router.push("/carrinho");
  };

  const handleViewDetails = (order: Order) => {
    router.push(`/rastrear/${order.id}`);
  };

  const handleTrack = (order: Order) => {
    if (order.trackingCode) {
      window.open(`https://rastreamentos.correios.com.br/app/index.php?objeto=${order.trackingCode}`, "_blank");
    } else {
      toast.info("Esse pedido ainda não possui código de rastreio");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen pb-12">
        <section className="container mx-auto flex min-h-[60vh] items-center justify-center px-6 py-12">
          <Card className="w-full max-w-md border border-border/60 bg-card/90 text-center">
            <CardContent className="space-y-4 p-8">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">Acesso restrito</h2>
              <p className="text-sm text-muted-foreground">
                Faça login para visualizar e acompanhar seus pedidos recentes.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => router.push("/login")}>Fazer login</Button>
                <Button variant="ghost" onClick={() => router.push("/")}>Voltar para a home</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-12">
      <section className="container mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Início
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Meus pedidos</h1>
                <p className="text-sm text-muted-foreground">Acompanhe o status e histórico de compras</p>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, status ou item..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OrderStatus)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-5">
          {filteredOrders.length === 0 ? (
            <Card className="border-dashed border-border/60 bg-card/90">
              <CardContent className="flex flex-col items-center justify-center space-y-3 p-10 text-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">Nenhum pedido encontrado</h3>
                <p className="max-w-lg text-sm text-muted-foreground">
                  Não encontramos pedidos com os filtros selecionados. Tente alterar a busca ou explore novos produtos.
                </p>
                <Button onClick={() => router.push("/produtos")}>Ver produtos</Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="border border-border/70 bg-card/90">
                  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <StatusIcon className="h-5 w-5" />
                        Pedido {order.id}
                      </CardTitle>
                      <CardDescription>
                        Criado em {formatDate(order.createdAt)} • {order.deliveryTime}
                      </CardDescription>
                    </div>
                    <Badge className={statusStyles[order.status]}>{getStatusLabel(order.status)}</Badge>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <MapPin className="h-4 w-4" />
                          Endereço de entrega
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <CreditCard className="h-4 w-4" />
                          Pagamento
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{order.paymentMethod}</p>
                        <p className="text-sm font-semibold text-foreground">Total: {formatCurrency(order.total)}</p>
                        {order.trackingCode && (
                          <p className="text-xs text-muted-foreground">Código de rastreio: {order.trackingCode}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-foreground">Itens do pedido</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Quantidade: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-primary">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-muted-foreground">
                        Número de itens: {order.items.reduce((total, item) => total + item.quantity, 0)}
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button variant="outline" onClick={() => handleTrack(order)}>
                          Rastrear pedido
                        </Button>
                        <Button variant="outline" onClick={() => handleViewDetails(order)}>
                          Ver detalhes
                        </Button>
                        <Button onClick={() => handleReorder(order)}>Comprar novamente</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
