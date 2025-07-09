
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  subcategory: string;
  stock_quantity: number | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

const ProductCard = ({ product, onAddToCart, onAddToWishlist }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();
        console.log("WishListData:",data);
      
      if (!error && data) {
        setIsInWishlist(true);
      }
    };

    checkWishlistStatus();
  }, [user, product.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: existing, error: fetchError } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      // update quantity
      const { error: updateError } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);

      if (updateError) throw updateError;
    } else {
      // const { error } = await supabase.from('cart').upsert({
      //   user_id: user.id,
      //   product_id: product.id,
      //   quantity: 1,
      // }, {
      //   onConflict: 'user_id,product_id'
      // });

      // if (error) throw error;
      const { error: insertError } = await supabase
        .from("cart")
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        });

      if (insertError) throw insertError;
    }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
      
      onAddToCart?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;
        setIsInWishlist(false);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        const { error } = await supabase.from('wishlist').insert({
          user_id: user.id,
          product_id: product.id,
        });

        if (error) throw error;
        setIsInWishlist(true);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
      
      onAddToWishlist?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-hover overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            disabled={loading}
            className="shrink-0"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          <Badge variant="secondary" className="uppercase text-xs">
            {product.subcategory}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {product.stock_quantity && product.stock_quantity > 0 
              ? `${product.stock_quantity} in stock` 
              : 'Out of stock'
            }
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={loading || !product.stock_quantity || product.stock_quantity === 0}
            size="sm"
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
