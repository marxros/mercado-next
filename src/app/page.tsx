"use client";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBasket,
  Star,
  Clock,
  Truck,
  ArrowRight,
  Heart,
  ShoppingCart,
  Percent,
  MapPin,
  Users,
  Award,
} from "lucide-react";
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

type Offer = {
  id: number;
  title: string;
  originalPrice: number;
  offerPrice: number;
  discount: number;
  image: StaticImageData;
  rating: number;
  deliveryTime: string;
  producer: string;
  location: string;
};

type FeaturedProduct = {
  id: number;
  title: string;
  price: number;
  image: StaticImageData;
  rating: number;
  producer: string;
  location: string;
  category: string;
};

const categories = [
  { name: "Frutas", icon: "🍊", count: "80+ variedades" },
  { name: "Hortaliças", icon: "🥬", count: "60+ tipos" },
  { name: "Queijos", icon: "🧀", count: "25+ sabores" },
  { name: "Farinhas", icon: "🌾", count: "15+ tipos" },
  { name: "Artesanato", icon: "🏺", count: "120+ peças" },
  { name: "Temperos", icon: "🌶️", count: "40+ especiarias" },
  { name: "Doces", icon: "🍯", count: "30+ sabores" },
  { name: "Cereais", icon: "🌽", count: "20+ produtos" },
];

const todayOffers: Offer[] = [
  {
    id: 1,
    title: "Queijo Coalho Artesanal",
    originalPrice: 18.9,
    offerPrice: 14.9,
    discount: 20,
    image: queijoCoalho,
    rating: 4.9,
    deliveryTime: "2-4 horas",
    producer: "Fazenda São João",
    location: "Palmeira dos Índios, AL",
  },
  {
    id: 2,
    title: "Farinha de Mandioca Especial",
    originalPrice: 12.5,
    offerPrice: 9.9,
    discount: 25,
    image: farinhaMandioca,
    rating: 4.8,
    deliveryTime: "1-3 horas",
    producer: "Casa de Farinha do Zé",
    location: "Arapiraca, AL",
  },
  {
    id: 3,
    title: "Cesta de Frutas Regionais",
    originalPrice: 25.0,
    offerPrice: 19.9,
    discount: 20,
    image: frutasRegionais,
    rating: 4.7,
    deliveryTime: "2-4 horas",
    producer: "Sítio Fruticultura",
    location: "Major Isidoro, AL",
  },
  {
    id: 4,
    title: "Mel Silvestre Puro",
    originalPrice: 22.0,
    offerPrice: 17.9,
    discount: 18,
    image: melSilvestre,
    rating: 4.9,
    deliveryTime: "1-2 horas",
    producer: "Apiário Dona Maria",
    location: "Batalha, AL",
  },
  {
    id: 5,
    title: "Rapadura Artesanal",
    originalPrice: 8.5,
    offerPrice: 6.9,
    discount: 19,
    image: rapadura,
    rating: 4.6,
    deliveryTime: "1-3 horas",
    producer: "Engenho Tradição",
    location: "Craíbas, AL",
  },
  {
    id: 6,
    title: "Castanha de Caju Torrada",
    originalPrice: 15.9,
    offerPrice: 12.9,
    discount: 19,
    image: castanhaCaju,
    rating: 4.8,
    deliveryTime: "2-4 horas",
    producer: "Cooperativa Rural Unidos",
    location: "Piranhas, AL",
  },
];

const featuredProducts: FeaturedProduct[] = [
  {
    id: 7,
    title: "Cerâmica Artesanal Alagoana",
    price: 35.9,
    image: ceramicaArtesanal,
    rating: 4.9,
    producer: "Mestre Ceramista João",
    location: "Penedo, AL",
    category: "Artesanato",
  },
  {
    id: 8,
    title: "Polpa de Frutas Congelada",
    price: 8.9,
    image: polpaFrutas,
    rating: 4.7,
    producer: "Polpas do Sertão",
    location: "Santana do Ipanema, AL",
    category: "Frutas",
  },
  {
    id: 9,
    title: "Cuscuz de Milho Tradicional",
    price: 6.5,
    image: cuscuzMilho,
    rating: 4.8,
    producer: "Vovó Alzira",
    location: "São José da Tapera, AL",
    category: "Cereais",
  },
  {
    id: 10,
    title: "Bordado em Ponto Cruz",
    price: 45.0,
    image: bordadoPontoCruz,
    rating: 4.9,
    producer: "Cooperativa das Bordadeiras",
    location: "Pão de Açúcar, AL",
    category: "Artesanato",
  },
  {
    id: 11,
    title: "Tapioca Fresca",
    price: 4.9,
    image: tapiocaFresca,
    rating: 4.6,
    producer: "Casa da Tapioca",
    location: "Girau do Ponciano, AL",
    category: "Farinhas",
  },
  {
    id: 12,
    title: "Doce de Leite Cremoso",
    price: 12.9,
    image: doceLeite,
    rating: 4.8,
    producer: "Doces da Fazenda",
    location: "Olho d'Água do Casado, AL",
    category: "Doces",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  const handleAddToCart = (
    product: { id: number; title: string; offerPrice?: number; price?: number },
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const resolvedPrice = product.offerPrice ?? product.price;

    if (!resolvedPrice) return;

    addItem({ productId: String(product.id), name: product.title, price: resolvedPrice }, 1);
    toast.success(`${product.title} adicionado ao carrinho`);
  };

  const handleFavoriteClick = (product: { title: string }, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Faça login para favoritar produtos");
      router.push("/login");
      return;
    }

    toast.success(`${product.title} adicionado aos favoritos`);
  };

  const handleProductClick = (id: number) => {
    router.push(`/produto/${id}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/produtos?categoria=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  const handleExploreProducts = () => {
    router.push("/produtos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30 pb-12">
      <section className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
            Produtos frescos
            <span className="block" style={{ color: "#F97316" }}>
              direto do sertão!
            </span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Frutas, hortaliças, queijos artesanais e muito mais. Direto do produtor para sua mesa, com a qualidade e
            sabor únicos da nossa terra.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Sertão e Agreste de AL</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Entrega no mesmo dia</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Frete grátis acima de R$ 50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>+200 produtores parceiros</span>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Percent className="h-6 w-6" style={{ color: "#F97316" }} />
              <h3 className="text-2xl font-bold text-foreground">Ofertas</h3>
            </div>
            <Badge
              variant="secondary"
              className="border"
              style={{
                color: "#F97316",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                borderColor: "rgba(249, 115, 22, 0.2)",
              }}
            >
              Fresquinho da roça
            </Badge>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {todayOffers.map((offer) => (
                <div key={offer.id} className="w-80 flex-none">
                  <Card
                    className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => handleProductClick(offer.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="relative h-48 overflow-hidden border border-amber-200/50 bg-gradient-to-br from-amber-100/80 to-orange-100/80">
                          <Image
                            src={offer.image}
                            alt={offer.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 320px, 320px"
                          />
                        </div>
                        <Badge className="absolute right-3 top-3 border-none bg-green-600 text-white">
                          -{offer.discount}%
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute left-3 top-3 bg-white/80 transition-colors hover:bg-white hover:text-red-500"
                          onClick={(e) => handleFavoriteClick(offer, e)}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="text-sm font-medium">{offer.rating}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{offer.deliveryTime}</span>
                        </div>

                        <h4 className="mb-1 font-bold text-foreground">{offer.title}</h4>
                        <p className="mb-1 text-sm text-muted-foreground">{offer.producer}</p>
                        <div className="mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{offer.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold" style={{ color: "#F97316" }}>
                              R$ {offer.offerPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">R$ {offer.originalPrice.toFixed(2)}</span>
                          </div>
                          <Button size="sm" className="group-hover:gap-2 transition-all" onClick={(e) => handleAddToCart(offer, e)}>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="hidden group-hover:inline">Adicionar</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Nossos Produtos</h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="group cursor-pointer border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-3xl transition-transform group-hover:scale-110">{category.icon}</div>
                  <h4 className="mb-1 text-sm font-semibold text-foreground">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6" style={{ color: "#F97316" }} />
              <h3 className="text-2xl font-bold text-foreground">Produtos em Destaque</h3>
            </div>
            <Badge className="border-amber-200 bg-amber-100 text-amber-800">
              Qualidade premium
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="relative h-40 overflow-hidden border border-amber-200/50 bg-gradient-to-br from-amber-100/80 to-orange-100/80">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 320px, 400px"
                      />
                    </div>
                    <Badge className="absolute right-3 top-3 border-none bg-blue-600 text-white">{product.category}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-3 top-3 bg-white/80 transition-colors hover:bg-white hover:text-red-500"
                      onClick={(e) => handleFavoriteClick(product, e)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <h4 className="mb-1 font-bold text-foreground">{product.title}</h4>
                    <p className="mb-1 text-sm text-muted-foreground">{product.producer}</p>
                    <div className="mb-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: "#F97316" }}>
                        R$ {product.price.toFixed(2)}
                      </span>
                      <Button size="sm" className="group-hover:gap-2 transition-all" onClick={(e) => handleAddToCart(product, e)}>
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden group-hover:inline">Adicionar</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-100/50 via-orange-50/50 to-amber-100/50 p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-foreground">Pronto para conhecer nossos produtos?</h3>
          <p className="mb-6 text-muted-foreground">Cadastre-se agora e receba 10% de desconto na primeira compra!</p>
          <Button size="lg" className="transition-all hover:gap-3" onClick={handleExploreProducts}>
            Explorar produtos
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="mt-12 border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
              <ShoppingBasket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Mercadô</h3>
              <p className="text-xs text-muted-foreground">Feira do Sertão</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Mercadô. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
