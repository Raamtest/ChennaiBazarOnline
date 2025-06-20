
import { useState } from "react";
import { Heart, ShoppingCart, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sampleProducts = [
  {
    id: 1,
    name: "Premium Cotton Sarees",
    price: 2999,
    originalPrice: 4999,
    vendor: "Kanchipuram Silks",
    rating: 4.8,
    reviews: 245,
    image: "🥻",
    discount: 40,
    location: "T. Nagar"
  },
  {
    id: 2,
    name: "Fresh Coconut Oil",
    price: 299,
    originalPrice: 399,
    vendor: "Chennai Naturals",
    rating: 4.9,
    reviews: 156,
    image: "🥥",
    discount: 25,
    location: "Mylapore"
  },
  {
    id: 3,
    name: "Smartphone Case",
    price: 599,
    originalPrice: 899,
    vendor: "Tech Chennai",
    rating: 4.5,
    reviews: 89,
    image: "📱",
    discount: 33,
    location: "Velachery"
  },
  {
    id: 4,
    name: "Filter Coffee Powder",
    price: 450,
    originalPrice: 550,
    vendor: "Madras Coffee Co.",
    rating: 4.7,
    reviews: 234,
    image: "☕",
    discount: 18,
    location: "Mylapore"
  },
  {
    id: 5,
    name: "Handloom Cotton Shirt",
    price: 1299,
    originalPrice: 1799,
    vendor: "Chennai Textiles",
    rating: 4.6,
    reviews: 67,
    image: "👔",
    discount: 28,
    location: "Anna Nagar"
  },
  {
    id: 6,
    name: "Organic Vegetables Box",
    price: 799,
    originalPrice: 999,
    vendor: "Farm Fresh Chennai",
    rating: 4.8,
    reviews: 178,
    image: "🥬",
    discount: 20,
    location: "OMR"
  }
];

const ProductGrid = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {sampleProducts.map((product) => (
        <Card key={product.id} className="card-hover overflow-hidden">
          <CardContent className="p-0">
            {/* Product Image */}
            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center">
              <div className="text-6xl mb-2">{product.image}</div>
              {product.discount > 0 && (
                <Badge className="absolute top-2 left-2 bg-destructive">
                  {product.discount}% OFF
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart 
                  className={`w-4 h-4 ${
                    wishlist.includes(product.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400'
                  }`} 
                />
              </Button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                by {product.vendor}
              </p>
              <p className="text-xs text-primary mb-2">📍 {product.location}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button 
                className="w-full btn-primary text-xs h-8"
                onClick={() => console.log(`Added ${product.name} to cart`)}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
