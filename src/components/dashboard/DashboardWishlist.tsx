
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    const { data: wishlist, error } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching wishlist:", error);
      setLoading(false);
      return;
    }

    const productIds = wishlist.map(item => item.product_id);
    if (productIds.length === 0) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, name, price, image_url")
      .in("id", productIds);

    if (productError) {
      console.error("Error fetching products:", productError);
      setLoading(false);
      return;
    }

    setWishlistItems(products);
    setLoading(false);
  };

  const handleRemove = async (productId) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .match({ user_id: user.id, product_id: productId });

    if (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    } else {
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast({
        title: "Item Removed",
        description: "Item has been removed from your wishlist",
      });
    }
  };

  const handleMoveToCart = async (productId) => {
    // Add to cart
    const { error: insertError } = await supabase
      .from("cart")
      .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);

    if (insertError) {
      console.error("Error adding to cart:", insertError);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return;
    }

    // Remove from wishlist
    await handleRemove(productId);
    toast({
      title: "Success",
      description: "Item moved to cart successfully",
    });
  };

  if (loading) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <div>
      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No items in your wishlist.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-500 mb-4">₹{product.price}</p>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveToCart(product.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Move to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWishlist;
