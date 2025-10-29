"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star } from "lucide-react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

export type ProducerProduct = {
  id: string;
  name: string;
  price: number;
};

export type Producer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rating?: number;
  isActive: boolean;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  products: ProducerProduct[];
};

type ProducersMapProps = {
  producers: Producer[];
  selectedProducerId?: string;
  onProducerSelect?: (producer: Producer) => void;
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [-9.665833, -35.735279]; // Maceió, AL

// Configure default marker icons so they render properly in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LeafletIconDefault = (L.Icon.Default.prototype as any)._getIconUrl;
if (LeafletIconDefault) {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [map, center]);

  return null;
}

export function ProducersMap({ producers, selectedProducerId, onProducerSelect, className = "" }: ProducersMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(nextCenter);
      },
      () => {
        // fallback: keep default center
      },
    );
  }, []);

  const selectedProducer = useMemo(() => {
    if (!selectedProducerId) return null;
    return producers.find((producer) => producer.id === selectedProducerId) ?? null;
  }, [producers, selectedProducerId]);

  const activeProducers = useMemo(
    () =>
      producers.filter(
        (producer) =>
          producer.isActive &&
          Number.isFinite(producer.address.latitude) &&
          Number.isFinite(producer.address.longitude),
      ),
    [producers],
  );

  const mapCenter = useMemo<[number, number]>(() => {
    if (selectedProducer) {
      return [selectedProducer.address.latitude, selectedProducer.address.longitude];
    }
    if (userLocation) {
      return userLocation;
    }
    return DEFAULT_CENTER;
  }, [selectedProducer, userLocation]);

  const handleNavigate = (producer: Producer) => {
    const { latitude, longitude } = producer.address;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Produtores Próximos
        </CardTitle>
        <CardDescription>Explore produtores e visualize a localização em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 w-full">
          <MapContainer center={mapCenter} zoom={12} scrollWheelZoom className="h-full w-full rounded-b-lg">
            <MapCenter center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="text-center">
                    <h4 className="font-semibold">Você está aqui</h4>
                    <p className="text-xs text-muted-foreground">Localização aproximada</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {activeProducers.map((producer) => (
              <Marker
                key={producer.id}
                position={[producer.address.latitude, producer.address.longitude]}
                eventHandlers={{
                  click: () => {
                    onProducerSelect?.(producer);
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[220px] space-y-3">
                    <div>
                      <h4 className="text-base font-semibold">{producer.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {producer.address.neighborhood}, {producer.address.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {producer.rating && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {producer.rating.toFixed(1)}
                        </Badge>
                      )}
                      <Badge variant="outline">{producer.products.length} produtos</Badge>
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      {producer.products.slice(0, 2).map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <span>{product.name}</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => onProducerSelect?.(producer)}
                      >
                        Ver detalhes
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleNavigate(producer)}>
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
