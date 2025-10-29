"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/shared/providers/CartProvider";
import { useAuth } from "@/shared/providers/AuthProvider";

import queijoCoalho from "@/assets/queijo-coalho.jpg";
import farinhaMandioca from "@/assets/farinha-mandioca.jpg";
import frutasRegionais from "@/assets/frutas-regionais.jpg";
import melSilvestre from "@/assets/mel-silvestre.jpg";
import rapadura from "@/assets/rapadura.jpg";
import castanhaCaju from "@/assets/castanha-caju.jpg";
import ceramicaArtesanal from "@/assets/ceramica-artesanal.jpg";
import polpaFrutas from "@/assets/polpa-frutas.jpg";
import cuscuzMilho from "@/assets/cuscuz-milho.jpg";
import bordadoPontoCruz from "@/assets/bordado-ponto-cruz.jpg";
import tapiocaFresca from "@/assets/tapioca-fresca.jpg";
import doceLeite from "@/assets/doce-leite.jpg";

const categories = [
  { value: "todos", label: "Todas" },
  { value: "frutas", label: "Frutas" },
  { value: "hortalicas", label: "Hortaliças" },
  { value: "queijos", label: "Queijos" },
  { value: "farinhas", label: "Farinhas" },
  { value: "artesanato", label: "Artesanato" },
  { value: "temperos", label: "Temperos" },
  { value: "doces", label: "Doces" },
  { value: "cereais", label: "Cereais" },
];

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  rating: number;
  deliveryTime: string;
  producer: string;
  location: string;
  category: string;
  image: StaticImageData;
};

const productsCatalog: Product[] = [
  {
    id: "queijo-coalho",
    name: "Queijo Coalho Artesanal",
    description: "Queijo coalho fresco produzido artesanalmente na Fazenda São João.",
    price: 14.9,
    originalPrice: 18.9,
    discount: 20,
    stock: 18,
    rating: 4.9,
    deliveryTime: "2-4 horas",
    producer: "Fazenda São João",
    location: "Palmeira dos Índios, AL",
    category: "queijos",
    image: queijoCoalho,
  },
  {
    id: "farinha-mandioca",
    name: "Farinha de Mandioca Especial",
    description: "Farinha crocante e dourada, perfeita para acompanhamentos.",
    price: 9.9,
    originalPrice: 12.5,
    discount: 25,
    stock: 34,
    rating: 4.8,
    deliveryTime: "1-3 horas",
    producer: "Casa de Farinha do Zé",
    location: "Arapiraca, AL",
    category: "farinhas",
    image: farinhaMandioca,
  },
  {
    id: "frutas-regionais",
    name: "Cesta de Frutas Regionais",
    description: "Seleção de frutas frescas colhidas no sítio Fruticultura.",
    price: 19.9,
    originalPrice: 25,
    discount: 20,
    stock: 22,
    rating: 4.7,
    deliveryTime: "2-4 horas",
    producer: "Sítio Fruticultura",
    location: "Major Isidoro, AL",
    category: "frutas",
    image: frutasRegionais,
  },
  {
    id: "mel-silvestre",
    name: "Mel Silvestre Puro",
    description: "Mel silvestre filtrado e engarrafado artesanalmente.",
    price: 17.9,
    originalPrice: 22,
    discount: 18,
    stock: 15,
    rating: 4.9,
    deliveryTime: "1-2 horas",
    producer: "Apiário Dona Maria",
    location: "Batalha, AL",
    category: "doces",
    image: melSilvestre,
  },
  {
    id: "rapadura-artesanal",
    name: "Rapadura Artesanal",
    description: "Rapadura tradicional feita com cana fresca e sem aditivos.",
    price: 6.9,
    originalPrice: 8.5,
    discount: 19,
    stock: 28,
    rating: 4.6,
    deliveryTime: "1-3 horas",
    producer: "Engenho Tradição",
    location: "Craíbas, AL",
    category: "doces",
    image: rapadura,
  },
  {
    id: "castanha-caju",
    name: "Castanha de Caju Torrada",
    description: "Castanha premium torrada lentamente com pitadas de sal marinho.",
    price: 12.9,
    originalPrice: 15.9,
    discount: 19,
    stock: 30,
    rating: 4.8,
    deliveryTime: "2-4 horas",
    producer: "Cooperativa Rural Unidos",
    location: "Piranhas, AL",
    category: "cereais",
    image: castanhaCaju,
  },
  {
    id: "ceramica-artesanal",
    name: "Cerâmica Artesanal Alagoana",
    description: "Peça decorativa feita à mão com acabamento em esmalte fosco.",
    price: 35.9,
    stock: 12,
    rating: 4.9,
    deliveryTime: "3-5 dias",
    producer: "Mestre Ceramista João",
    location: "Penedo, AL",
    category: "artesanato",
    image: ceramicaArtesanal,
  },
  {
    id: "polpa-frutas",
    name: "Polpa de Frutas Congelada",
    description: "Polpas congeladas prontas para sucos e sobremesas.",
    price: 8.9,
    stock: 40,
    rating: 4.7,
    deliveryTime: "1-2 horas",
    producer: "Polpas do Sertão",
    location: "Santana do Ipanema, AL",
    category: "frutas",
    image: polpaFrutas,
  },
  {
    id: "cuscuz-milho",
    name: "Cuscuz de Milho Tradicional",
    description: "Cuscuz de milho amarelo moído na hora, sabor da infância.",
    price: 6.5,
    stock: 26,
    rating: 4.8,
    deliveryTime: "1-2 horas",
    producer: "Vovó Alzira",
    location: "São José da Tapera, AL",
    category: "cereais",
    image: cuscuzMilho,
  },
  {
    id: "bordado-ponto-cruz",
    name: "Bordado em Ponto Cruz",
    description: "Arte em tecido com temas regionais, perfeito para presentes.",
    price: 45,
    stock: 10,
    rating: 4.9,
    deliveryTime: "5-7 dias",
    producer: "Cooperativa das Bordadeiras",
    location: "Pão de Açúcar, AL",
    category: "artesanato",
    image: bordadoPontoCruz,
  },
  {
    id: "tapioca-fresca",
    name: "Tapioca Fresca",
    description: "Tapioca hidratada diariamente, pronta para ir à chapa.",
    price: 4.9,
    stock: 36,
    rating: 4.6,
    deliveryTime: "1-2 horas",
    producer: "Casa da Tapioca",
    location: "Girau do Ponciano, AL",
    category: "farinhas",
    image: tapiocaFresca,
  },
  {
    id: "doce-leite",
    name: "Doce de Leite Cremoso",
    description: "Doce de leite artesanal, textura cremosa e sabor marcante.",
    price: 12.9,
    stock: 24,
    rating: 4.8,
    deliveryTime: "1-3 horas",
    producer: "Doces da Fazenda",
    location: "Olho d'Água do Casado, AL",
    category: "doces",
    image: doceLeite,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function ProductsListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryFromParams = useMemo(() => {
    const param = searchParams.get("categoria");
    if (!param) return "todos";
    const normalized = param.toLowerCase();
    const exists = categories.find((category) => category.value === normalized);
    return exists ? exists.value : "todos";
  }, [searchParams]);

  const [categoryFilter, setCategoryFilter] = useState<string>(categoryFromParams);

  useEffect(() => {
    setCategoryFilter(categoryFromParams);
  }, [categoryFromParams]);

  const filteredProducts = useMemo(() => {
    return productsCatalog.filter((product) => {
      const matchesCategory = categoryFilter === "todos" || product.category === categoryFilter;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!normalizedSearch) return matchesCategory;
      return (
        matchesCategory &&
        [product.name, product.producer, product.location]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [categoryFilter, searchTerm]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ productId: product.id, name: product.name, price: product.price }, 1);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleFavoriteClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Faça login para favoritar produtos");
      router.push("/login");
      return;
    }
    toast.success(`${product.name} adicionado aos favoritos`);
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/produto/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30 pb-12">
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
                <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
                <p className="text-sm text-muted-foreground">{filteredProducts.length} resultados disponíveis</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative" onClick={() => router.push("/carrinho")}
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              aria-label="Visualizar em grade"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              aria-label="Visualizar em lista"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form className="relative flex-1 md:max-w-md" onSubmit={(event) => event.preventDefault()}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por produto ou produtor..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </form>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/80 p-12 text-center">
            <Package className="mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Nenhum produto encontrado</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ajuste os filtros ou tente uma nova busca para encontrar o produto ideal para você.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                onClick={() => handleViewDetails(product)}
              >
                <CardContent className="p-0">
                  <div className="relative h-52 w-full overflow-hidden border-b border-border/60">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                    {product.discount && (
                      <Badge className="absolute left-3 top-3 border-none bg-primary text-primary-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-3 top-3 bg-white/80 transition-colors hover:bg-white hover:text-red-500"
                      onClick={(event) => handleFavoriteClick(product, event)}
                      aria-label="Favoritar produto"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{product.location}</span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {product.rating.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{product.deliveryTime}</span>
                      <span>{product.stock} em estoque</span>
                    </div>

                    <div className="flex items-center justify-end">
                      <Button size="sm" className="transition-all group-hover:gap-2" onClick={(event) => handleAddToCart(product, event)}>
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden group-hover:inline">Adicionar</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                onClick={() => handleViewDetails(product)}
              >
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border/60 md:h-32 md:w-40">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                    {product.discount && (
                      <Badge className="absolute left-3 top-3 border-none bg-primary text-primary-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.producer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {product.rating.toFixed(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{product.deliveryTime}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{product.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {product.location}
                      </span>
                      <span>{product.stock} unidades</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all hover:border-primary hover:text-primary"
                          onClick={(event) => handleFavoriteClick(product, event)}
                        >
                          <Heart className="h-4 w-4" />
                          <span className="hidden sm:inline">Favoritar</span>
                        </Button>
                        <Button size="sm" className="transition-all hover:gap-2" onClick={(event) => handleAddToCart(product, event)}>
                          <ShoppingCart className="h-4 w-4" />
                          <span className="hidden sm:inline">Adicionar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
