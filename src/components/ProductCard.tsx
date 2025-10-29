import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, MapPin, Package } from "lucide-react";
import { Product } from "@/api/endpoints";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  showAddToCart?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  showAddToCart = true,
  className = "",
}) => {
  const { addItem, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error("Produto fora de estoque");
      return;
    }

    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.stock <= 0) return { text: "Fora de estoque", variant: "destructive" as const };
    if (product.stock <= 5) return { text: "Últimas unidades", variant: "secondary" as const };
    return { text: "Em estoque", variant: "default" as const };
  };

  const stockStatus = getStockStatus();
  const cartQuantity = getItemQuantity(product.id);
  const isInCartState = isInCart(product.id);

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${className}`}
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
          {product.producer ? (
            <div className="flex h-full items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <Package className="h-16 w-16 text-primary" />
            </div>
          )}
          
          {/* Stock Badge */}
          <Badge 
            variant={stockStatus.variant}
            className="absolute top-2 right-2"
          >
            {stockStatus.text}
          </Badge>
          
          {/* Cart Quantity Badge */}
          {isInCartState && (
            <Badge 
              variant="default"
              className="absolute top-2 left-2 bg-primary text-primary-foreground"
            >
              {cartQuantity}x
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Producer Info */}
          {product.producer && (
            <div className="mb-2 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {product.producer.name}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && (
                <span className="text-xs text-muted-foreground">
                  {product.stock} unidades
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            {showAddToCart && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">
                  {product.stock <= 0 ? "Indisponível" : "Adicionar"}
                </span>
              </Button>
            )}
          </div>

          {/* Rating (placeholder for future implementation) */}
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs text-muted-foreground">
              4.5 (12 avaliações)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Grid component for displaying multiple products
interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  showAddToCart?: boolean;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
  showAddToCart = true,
  className = "",
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou volte mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onProductClick}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
};

