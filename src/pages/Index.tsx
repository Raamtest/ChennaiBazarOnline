
import { useState } from "react";
import { Search, ShoppingCart, User, Heart, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Chennai Bazaar Online
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your local marketplace for everything Chennai. From Marina Beach to T. Nagar, 
            we deliver the best products right to your doorstep.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for products in Chennai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button className="btn-primary h-12 px-8">
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <h3 className="text-3xl font-bold text-primary">1000+</h3>
                <p className="text-muted-foreground">Local Vendors</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <h3 className="text-3xl font-bold text-primary">50,000+</h3>
                <p className="text-muted-foreground">Products Available</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <h3 className="text-3xl font-bold text-primary">24/7</h3>
                <p className="text-muted-foreground">Chennai Delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Badge variant="secondary" className="text-sm">
              Chennai Exclusive
            </Badge>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Chennai Bazaar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Local Products</h3>
                <p className="text-sm text-muted-foreground">
                  Authentic Chennai products from trusted local vendors
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowDown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Same-day delivery across all Chennai zones
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Support Local</h3>
                <p className="text-sm text-muted-foreground">
                  Supporting Chennai's local business ecosystem
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  Hand-picked products with quality guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
