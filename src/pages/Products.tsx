// 


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ["wishlistCount", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 3000,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", searchTerm, selectedCategory, selectedSubcategory],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);
      if (selectedCategory !== "all")
        query = query.eq("category", selectedCategory);
      if (selectedSubcategory !== "all")
        query = query.eq("subcategory", selectedSubcategory);
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category");
      if (error) throw error;
      return [...new Set(data?.map((item) => item.category) || [])];
    },
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: async () => {
      let query = supabase.from("products").select("subcategory");
      if (selectedCategory !== "all")
        query = query.eq("category", selectedCategory);
      const { data, error } = await query;
      if (error) throw error;
      return [...new Set(data?.map((item) => item.subcategory) || [])];
    },
  });

  const addToCartMutation = useMutation<void, Error, string>({
    mutationFn: async (productId) => {
      if (!user) throw new Error("Please login to add items to cart");

      const { data: existing, error: fetchError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart").insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast({ title: "Added", description: "Product added to cart" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToWishlist = useMutation<void, Error, string>({
    mutationFn: async (productId) => {
      if (!user) throw new Error("Please login to add items to wishlist");

      const { data: existing, error: fetchError } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existing) {
        const { error } = await supabase.from("wishlist").insert({
          user_id: user.id,
          product_id: productId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistCount", user?.id] });
      toast({ title: "Added to Wishlist" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="absolute top-4 right-4">
        <div className="relative">
          <Heart className="w-6 h-6" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
              {wishlistCount}
            </span>
          )}
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">All Products</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing products from Chennai's trusted local vendors
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Subcategories</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedSubcategory("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t"
                  />
                  <CardContent className="space-y-2 p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-muted-foreground">{product.subcategory}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <p className="text-sm">Stock: {product.stock_quantity}</p>
                    <p className="text-xl font-bold text-primary">
                      ₹{product.price}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: "Login Required",
                              description: "Please login to add items to cart",
                              variant: "destructive",
                            });
                          } else {
                            addToCartMutation.mutate(product.id);
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: "Login Required",
                              description:
                                "Please login to add items to wishlist",
                              variant: "destructive",
                            });
                          } else {
                            addToWishlist.mutate(product.id);
                          }
                        }}
                      >
                        Wishlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Products;
