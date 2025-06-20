
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Trash2, ShoppingCart } from "lucide-react";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .match({ user_id: user.id, product_id: productId });

    if (error) {
      console.error("Error removing item:", error);
    } else {
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const handleMoveToCart = async (productId) => {
    // Add to cart
    const { error: insertError } = await supabase
      .from("cart")
      .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);

    if (insertError) {
      console.error("Error adding to cart:", insertError);
      return;
    }

    // Remove from wishlist
    await handleRemove(productId);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        {loading ? (
          <p>Loading...</p>
        ) : wishlistItems.length === 0 ? (
          <p>No items in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 shadow">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-500 mb-4">₹{product.price}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemove(product.id)}
                    title="Remove"
                  >
                    <Trash2 size={20} />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => handleMoveToCart(product.id)}
                    title="Move to Cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
