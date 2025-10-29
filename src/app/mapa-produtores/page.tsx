"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Search,
  ArrowLeft,
  Package,
  Star,
  Navigation,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ProducersMap = dynamic(() => import("@/components-client/ProducersMap").then((mod) => mod.ProducersMap), {
  ssr: false,
});

import type { Producer } from "@/components-client/ProducersMap";

const producersCatalog: Producer[] = [
  {
    id: "fazenda-sao-joao",
    name: "Fazenda São João",
    email: "contato@fazendajohn.com",
    phone: "(82) 99876-1234",
    rating: 4.9,
    isActive: true,
    address: {
      street: "Estrada do Sertão",
      number: "120",
      neighborhood: "Zona Rural",
      city: "Palmeira dos Índios",
      state: "AL",
      zipCode: "57600-000",
      latitude: -9.410327,
      longitude: -36.632251,
    },
    products: [
      { id: "queijo-coalho", name: "Queijo coalho artesanal", price: 18.9 },
      { id: "manteiga-garrafa", name: "Manteiga de garrafa", price: 22.5 },
    ],
  },
  {
    id: "casa-da-farinha",
    name: "Casa de Farinha do Zé",
    email: "contato@casadafarinha.com",
    phone: "(82) 99712-3344",
    rating: 4.7,
    isActive: true,
    address: {
      street: "Rua das Farinhas",
      number: "45",
      neighborhood: "Centro",
      city: "Arapiraca",
      state: "AL",
      zipCode: "57300-050",
      latitude: -9.754255,
      longitude: -36.661498,
    },
    products: [
      { id: "farinha-mandioca", name: "Farinha de mandioca especial", price: 9.9 },
      { id: "tapioca", name: "Tapioca fresca", price: 4.9 },
    ],
  },
  {
    id: "sitio-fruticultura",
    name: "Sítio Fruticultura",
    email: "contato@sitiofruticultura.com",
    phone: "(82) 99654-8877",
    rating: 4.8,
    isActive: true,
    address: {
      street: "Sítio Lagoa",
      number: "s/n",
      neighborhood: "Zona Rural",
      city: "Major Isidoro",
      state: "AL",
      zipCode: "57580-000",
      latitude: -9.529981,
      longitude: -36.992081,
    },
    products: [
      { id: "cesta-frutas", name: "Cesta de frutas regionais", price: 25 },
      { id: "polpa-frutas", name: "Polpas congeladas", price: 8.9 },
    ],
  },
  {
    id: "cooperativa-artesanato",
    name: "Cooperativa das Bordadeiras",
    email: "bordado@cooperativa.com",
    phone: "(82) 99555-1122",
    rating: 4.9,
    isActive: true,
    address: {
      street: "Rua das Artes",
      number: "210",
      neighborhood: "Ateliê",
      city: "Pão de Açúcar",
      state: "AL",
      zipCode: "57400-000",
      latitude: -9.740568,
      longitude: -37.438728,
    },
    products: [
      { id: "bordado-ponto-cruz", name: "Bordado ponto cruz", price: 45 },
      { id: "renda-filha", name: "Renda filé", price: 65 },
    ],
  },
  {
    id: "apiario-dona-maria",
    name: "Apiário Dona Maria",
    email: "apiario@donamaria.com",
    phone: "(82) 99911-0001",
    rating: 4.95,
    isActive: true,
    address: {
      street: "Estrada do Mel",
      number: "320",
      neighborhood: "Sítio Pajeú",
      city: "Batalha",
      state: "AL",
      zipCode: "57420-000",
      latitude: -9.672834,
      longitude: -37.130068,
    },
    products: [
      { id: "mel-silvestre", name: "Mel silvestre puro", price: 22 },
      { id: "pole-eucalipto", name: "Pólen de eucalipto", price: 17 },
    ],
  },
];

export default function ProducersMapPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>();

  const filteredProducers = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    return producersCatalog.filter((producer) => {
      const matchesCity = !selectedCity || producer.address.city === selectedCity;
      const matchesSearch =
        !lowerSearch ||
        [
          producer.name,
          producer.address.city,
          producer.address.neighborhood,
          producer.address.street,
        ]
          .join(" ")
          .toLowerCase()
          .includes(lowerSearch);
      return matchesCity && matchesSearch;
    });
  }, [searchTerm, selectedCity]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    producersCatalog.forEach((producer) => set.add(producer.address.city));
    return Array.from(set).sort();
  }, []);

  const selectedProducer = useMemo(
    () => filteredProducers.find((producer) => producer.id === selectedProducerId),
    [filteredProducers, selectedProducerId],
  );

  const handleSelectProducer = (producer: Producer) => {
    setSelectedProducerId(producer.id);
    toast.success(`Produtor ${producer.name} selecionado`);
  };

  const handleViewProducts = (producer: Producer) => {
    void producer;
    router.push("/produtos");
  };

  const handleNavigate = (producer: Producer) => {
    const { latitude, longitude } = producer.address;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

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
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mapa de Produtores</h1>
                <p className="text-sm text-muted-foreground">Encontre produtores locais e planeje suas compras</p>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={() => setSelectedProducerId(undefined)}>
            Limpar seleção
          </Button>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5" />
                  Buscar Produtores
                </CardTitle>
                <CardDescription>Filtre por cidade ou por nome do produtor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Buscar por nome ou localização..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedCity}
                    onChange={(event) => setSelectedCity(event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Todas as cidades</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-muted-foreground">
                  {filteredProducers.length} produtor{filteredProducers.length === 1 ? "" : "es"} disponível
                  {filteredProducers.length === 1 ? "" : "s"}
                </p>
              </CardContent>
            </Card>

            <Card className="max-h-[28rem] overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Lista de Produtores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 overflow-y-auto pr-2">
                {filteredProducers.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/60 bg-card/80 p-6 text-center text-sm text-muted-foreground">
                    Nenhum produtor encontrado. Ajuste os filtros para tentar novamente.
                  </div>
                ) : (
                  filteredProducers.map((producer) => {
                    const isActive = selectedProducerId === producer.id;
                    return (
                      <button
                        key={producer.id}
                        type="button"
                        onClick={() => handleSelectProducer(producer)}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                          isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-foreground">{producer.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {producer.address.neighborhood}, {producer.address.city}
                            </p>
                          </div>
                          {producer.rating && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {producer.rating.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{producer.products.length} produtos</Badge>
                          {producer.phone && <span>{producer.phone}</span>}
                        </div>
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <ProducersMap
              producers={filteredProducers}
              selectedProducerId={selectedProducerId}
              onProducerSelect={handleSelectProducer}
            />

            {selectedProducer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">{selectedProducer.name}</CardTitle>
                  <CardDescription>
                    {selectedProducer.address.city} • {selectedProducer.address.neighborhood}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline">{selectedProducer.phone}</Badge>
                    <Badge variant="outline">{selectedProducer.email}</Badge>
                    {selectedProducer.rating && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {selectedProducer.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Produtos em destaque</h3>
                    <div className="space-y-2">
                      {selectedProducer.products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between text-sm">
                          <span>{product.name}</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="flex-1" onClick={() => handleViewProducts(selectedProducer)}>
                      Ver produtos
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleNavigate(selectedProducer)}>
                      <Navigation className="mr-2 h-4 w-4" />
                      Rotas no Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-border/70 bg-card/80">
                <CardContent className="flex h-full flex-col items-center justify-center space-y-3 py-10 text-center">
                  <MapPin className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Selecione um produtor no mapa</h3>
                    <p className="text-sm text-muted-foreground">
                      Clique em um marcador ou escolha na lista para ver os detalhes completos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
