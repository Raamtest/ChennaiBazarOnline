
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [useShipping, setUseShipping] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    dno: "",
    street: "",
    city: "Chennai",
  });

  const [billingAddress, setBillingAddress] = useState({
    dno: "",
    street: "",
    city: "Chennai",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    method: "cod",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    if (!user) return;

    const { data: cart, error } = await supabase
      .from("cart")
      .select(`
        *,
        products (*)
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
      return;
    }

    setCartItems(cart || []);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const total = calculateTotal();
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
          shipping_address: shippingAddress,
          billing_address: useShipping ? shippingAddress : billingAddress,
          payment_details: paymentDetails,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearCartError } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);

      if (clearCartError) throw clearCartError;

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      });

      navigate("/dashboard?tab=orders");
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shipping-dno">Door Number</Label>
                    <Input
                      id="shipping-dno"
                      value={shippingAddress.dno}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, dno: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-street">Street</Label>
                    <Input
                      id="shipping-street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-city">City</Label>
                    <Input
                      id="shipping-city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="use-shipping"
                      checked={useShipping}
                      onCheckedChange={(checked) => setUseShipping(checked === true)}
                    />
                    <Label htmlFor="use-shipping">Same as shipping address</Label>
                  </div>
                  
                  {!useShipping && (
                    <>
                      <div>
                        <Label htmlFor="billing-dno">Door Number</Label>
                        <Input
                          id="billing-dno"
                          value={billingAddress.dno}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, dno: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-street">Street</Label>
                        <Input
                          id="billing-street"
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, street: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-city">City</Label>
                        <Input
                          id="billing-city"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentDetails.method === "cod"}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, method: e.target.value }))}
                    />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentDetails.method === "card"}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, method: e.target.value }))}
                    />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>

                  {paymentDetails.method === "card" && (
                    <>
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.products.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          ₹{(item.products.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePlaceOrder} 
                      className="w-full" 
                      disabled={loading || cartItems.length === 0}
                    >
                      {loading ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Checkout;
