
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SubcategoryProducts = () => {
  const { categoryName, subcategoryName } = useParams<{ categoryName: string; subcategoryName: string }>();
  const navigate = useNavigate();

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['subcategory-products', categoryName, subcategoryName],
    queryFn: async () => {
      if (!categoryName || !subcategoryName) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName.toLowerCase())
        .eq('subcategory', subcategoryName.toLowerCase().replace(/\s+/g, '-'))
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const displayCategoryName = categoryName?.replace(/-/g, ' ') || '';
  const displaySubcategoryName = subcategoryName?.replace(/-/g, ' ') || '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to={`/categories/${categoryName}`}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {displayCategoryName}
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-4 gradient-text capitalize">
              {displaySubcategoryName}
            </h1>
            <p className="text-xl text-muted-foreground">
              Browse {displaySubcategoryName} in {displayCategoryName}
            </p>
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
              <p className="text-muted-foreground text-lg mb-4">
                No {displaySubcategoryName} products found.
              </p>
              <Button onClick={() => navigate('/products')}>
                Browse All Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => refetch()}
                  onAddToWishlist={() => refetch()}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SubcategoryProducts;
