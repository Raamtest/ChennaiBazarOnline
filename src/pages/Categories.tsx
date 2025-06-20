
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Mobiles, laptops, accessories",
      itemCount: "500+ items",
      image: "📱",
      slug: "electronics",
    },
    {
      id: 2,
      name: "Fashion",
      description: "Clothing, shoes, accessories",
      itemCount: "1200+ items",
      image: "👗",
      slug: "fashion",
    },
    {
      id: 3,
      name: "Food & Grocery",
      description: "Fresh produce, spices, snacks",
      itemCount: "800+ items",
      image: "🥬",
      slug: "food-grocery",
    },
    {
      id: 4,
      name: "Home & Garden",
      description: "Furniture, decor, plants",
      itemCount: "600+ items",
      image: "🏠",
      slug: "home-garden",
    },
    {
      id: 5,
      name: "Beauty & Personal Care",
      description: "Cosmetics, skincare, wellness",
      itemCount: "400+ items",
      image: "💄",
      slug: "beauty-personal-care",
    },
    {
      id: 6,
      name: "Books & Stationery",
      description: "Books, office supplies, art",
      itemCount: "300+ items",
      image: "📚",
      slug: "books-stationery",
    },
    {
      id: 7,
      name: "Sports & Fitness",
      description: "Equipment, apparel, supplements",
      itemCount: "250+ items",
      image: "⚽",
      slug: "sports-fitness",
    },
    {
      id: 8,
      name: "Arts & Crafts",
      description: "Handmade items, craft supplies",
      itemCount: "200+ items",
      image: "🎨",
      slug: "arts-crafts",
    },
  ];

  const handleCategoryClick = (slug: string) => {
    navigate(`/categories/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Shop by Categories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover products from Chennai's trusted local vendors across various categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="card-hover cursor-pointer"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.image}</div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                  <p className="text-xs text-primary font-medium">{category.itemCount}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Can't find what you're looking for? Contact us and we'll help you find the right vendor!
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Categories;
