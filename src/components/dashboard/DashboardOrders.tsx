
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    console.log("Fetching orders for user:", user.id);
    
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (name, image_url)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      console.log("Fetched orders:", data);
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId: string) => {
    console.log("Cancelling order:", orderId);
    
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .select();

    if (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    } else {
      console.log("Order cancelled successfully:", data);
      
      // Update the local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "cancelled" }
            : order
        )
      );
      
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "ready for delivery":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterOrdersByStatus = (status: string[]) => {
    return orders.filter(order => {
      const orderStatus = order.status.toLowerCase();
      return status.includes(orderStatus);
    });
  };

  const pendingOrders = filterOrdersByStatus(["pending", "accepted", "ready for delivery"]);
  const cancelledOrders = filterOrdersByStatus(["cancelled"]);
  const completedOrders = filterOrdersByStatus(["delivered"]);

  const renderOrderCard = (order: any, showCancelButton = false) => (
    <Card key={order.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            {showCancelButton && order.status !== "delivered" && order.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelOrder(order.id)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">Items:</p>
          {order.order_items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <img
                src={item.products?.image_url || "/placeholder.svg"}
                alt={item.products?.name}
                className="w-8 h-8 object-cover rounded"
              />
              <span>{item.products?.name} x {item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-lg">₹{order.total_amount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Orders ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled Orders ({cancelledOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No pending orders.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pendingOrders.map((order) => renderOrderCard(order, true))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6">
          {cancelledOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No cancelled orders.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {cancelledOrders.map((order) => renderOrderCard(order, false))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No completed orders.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {completedOrders.map((order) => renderOrderCard(order, false))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOrders;
