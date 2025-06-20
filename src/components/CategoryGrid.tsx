
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "📱",
    count: "1,200+ items",
    color: "bg-blue-50 hover:bg-blue-100",
    slug: "electronics"
  },
  {
    id: 2,
    name: "Fashion",
    image: "👕",
    count: "2,500+ items",
    color: "bg-pink-50 hover:bg-pink-100",
    slug: "fashion"
  },
  {
    id: 3,
    name: "Home & Garden",
    image: "🏠",
    count: "800+ items",
    color: "bg-green-50 hover:bg-green-100",
    slug: "home-garden"
  },
  {
    id: 4,
    name: "Books",
    image: "📚",
    count: "1,500+ items",
    color: "bg-orange-50 hover:bg-orange-100",
    slug: "books-stationery"
  },
  {
    id: 5,
    name: "Sports",
    image: "⚽",
    count: "600+ items",
    color: "bg-purple-50 hover:bg-purple-100",
    slug: "sports-fitness"
  },
  {
    id: 6,
    name: "Beauty",
    image: "💄",
    count: "900+ items",
    color: "bg-red-50 hover:bg-red-100",
    slug: "beauty-personal-care"
  },
  {
    id: 7,
    name: "Food & Grocery",
    image: "🛒",
    count: "3,000+ items",
    color: "bg-yellow-50 hover:bg-yellow-100",
    slug: "food-grocery"
  },
  {
    id: 8,
    name: "Automotive",
    image: "🚗",
    count: "400+ items",
    color: "bg-gray-50 hover:bg-gray-100",
    slug: "automotive"
  }
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/categories/${slug}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.id} 
          className={`card-hover cursor-pointer ${category.color} border-none`}
          onClick={() => handleCategoryClick(category.slug)}
        >
          <CardContent className="p-4 text-center">
            <div className="text-4xl mb-2">{category.image}</div>
            <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
            <p className="text-xs text-muted-foreground">{category.count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryGrid;
