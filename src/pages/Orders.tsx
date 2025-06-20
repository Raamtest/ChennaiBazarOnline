
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock orders data - in a real app, this would come from your database
  const [orders] = useState([
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: "₹1,299",
      items: ["Samsung Galaxy A54", "Phone Case"],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Shipped",
      total: "₹899",
      items: ["Cotton T-Shirt", "Jeans"],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "Processing",
      total: "₹2,499",
      items: ["Laptop Stand", "Wireless Mouse"],
    },
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 gradient-text">My Orders</h1>
          
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Items:</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.total}</p>
                      </div>
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

export default Orders;
