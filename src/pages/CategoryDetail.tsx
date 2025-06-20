
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CategoryDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  const subcategories: Record<string, Array<{ name: string; description: string; itemCount: string; image: string; slug: string }>> = {
    electronics: [
      { name: "Mobiles", description: "Smartphones, feature phones", itemCount: "200+ items", image: "📱", slug: "mobiles" },
      { name: "Laptops", description: "Gaming, business, ultrabooks", itemCount: "150+ items", image: "💻", slug: "laptops" },
      { name: "Accessories", description: "Cases, chargers, headphones", itemCount: "300+ items", image: "🎧", slug: "accessories" },
      { name: "Tablets", description: "iPad, Android tablets", itemCount: "80+ items", image: "📱", slug: "tablets" },
      { name: "Smart Watches", description: "Fitness trackers, smartwatches", itemCount: "120+ items", image: "⌚", slug: "smart-watches" },
    ],
    fashion: [
      { name: "Men's Clothing", description: "Shirts, pants, suits", itemCount: "400+ items", image: "👔", slug: "mens-clothing" },
      { name: "Women's Clothing", description: "Dresses, tops, sarees", itemCount: "600+ items", image: "👗", slug: "womens-clothing" },
      { name: "Shoes", description: "Sneakers, formal, sandals", itemCount: "250+ items", image: "👟", slug: "shoes" },
      { name: "Accessories", description: "Bags, belts, jewelry", itemCount: "300+ items", image: "👜", slug: "accessories" },
      { name: "Kids Wear", description: "Boys & girls clothing", itemCount: "200+ items", image: "👶", slug: "kids-wear" },
    ],
    "food-grocery": [
      { name: "Fresh Produce", description: "Vegetables, fruits", itemCount: "150+ items", image: "🥬", slug: "fresh-produce" },
      { name: "Spices", description: "Traditional Indian spices", itemCount: "80+ items", image: "🌶️", slug: "spices" },
      { name: "Snacks", description: "Chips, cookies, sweets", itemCount: "200+ items", image: "🍪", slug: "snacks" },
      { name: "Beverages", description: "Tea, coffee, juices", itemCount: "100+ items", image: "☕", slug: "beverages" },
      { name: "Dairy", description: "Milk, cheese, yogurt", itemCount: "60+ items", image: "🥛", slug: "dairy" },
    ],
    "home-garden": [
      { name: "Furniture", description: "Sofas, tables, beds", itemCount: "180+ items", image: "🪑", slug: "furniture" },
      { name: "Home Decor", description: "Paintings, vases, lights", itemCount: "220+ items", image: "🖼️", slug: "home-decor" },
      { name: "Plants", description: "Indoor, outdoor plants", itemCount: "120+ items", image: "🌱", slug: "plants" },
      { name: "Kitchen", description: "Utensils, appliances", itemCount: "150+ items", image: "🍳", slug: "kitchen" },
      { name: "Storage", description: "Boxes, organizers", itemCount: "80+ items", image: "📦", slug: "storage" },
    ],
  };

  const categoryKey = categoryName?.toLowerCase().replace(/\s+/g, '-') || '';
  const categorySubcategories = subcategories[categoryKey] || [];
  const displayName = categoryName?.replace(/-/g, ' ') || '';

  const handleSubcategoryClick = (subcategorySlug: string) => {
    // Navigate to subcategory products page
    window.location.href = `/categories/${categoryName}/subcategory/${subcategorySlug}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/categories">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-4 gradient-text capitalize">
              {displayName}
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore subcategories in {displayName}
            </p>
          </div>
          
          {categorySubcategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorySubcategories.map((subcategory, index) => (
                <Card 
                  key={index} 
                  className="card-hover cursor-pointer"
                  onClick={() => handleSubcategoryClick(subcategory.slug)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{subcategory.image}</div>
                    <h3 className="text-lg font-semibold mb-2">{subcategory.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{subcategory.description}</p>
                    <p className="text-xs text-primary font-medium">{subcategory.itemCount}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Subcategories for {displayName} are coming soon!
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CategoryDetail;
