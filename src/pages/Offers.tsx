
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "Chennai Special - Free Delivery",
      description: "Free delivery for orders above ₹500 across Chennai",
      discount: "FREE DELIVERY",
      validUntil: "Dec 31, 2024",
      isActive: true,
    },
    {
      id: 2,
      title: "T. Nagar Vendors Special",
      description: "Extra 15% off on fashion and accessories from T. Nagar vendors",
      discount: "15% OFF",
      validUntil: "Dec 25, 2024",
      isActive: true,
    },
    {
      id: 3,
      title: "New Customer Welcome",
      description: "₹100 off on your first order",
      discount: "₹100 OFF",
      validUntil: "Dec 31, 2024",
      isActive: true,
    },
    {
      id: 4,
      title: "Weekend Special",
      description: "Buy 2 Get 1 Free on selected home decor items",
      discount: "BUY 2 GET 1",
      validUntil: "Every Weekend",
      isActive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Special Offers
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exclusive deals and discounts from Chennai's finest vendors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {offers.map((offer) => (
              <Card key={offer.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={offer.isActive ? "default" : "secondary"}>
                      {offer.discount}
                    </Badge>
                    {offer.isActive && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Valid until:</span>
                    <span className="font-medium">{offer.validUntil}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              More exciting offers coming soon! Stay tuned for updates.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Offers;
