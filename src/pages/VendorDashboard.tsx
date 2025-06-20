
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VendorDashboard = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const vendorSession = localStorage.getItem("vendor_session");
    if (!vendorSession) {
      navigate("/vendor/login");
      return;
    }

    try {
      const vendorData = JSON.parse(vendorSession);
      setVendor(vendorData);
    } catch (error) {
      console.error("Error parsing vendor session:", error);
      navigate("/vendor/login");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vendor_session");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/vendor/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p>Please login to access the vendor dashboard.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {vendor.name}!</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {vendor.name}</p>
                  <p><strong>Email:</strong> {vendor.email}</p>
                  <p><strong>Phone:</strong> {vendor.phone}</p>
                  <p><strong>Company:</strong> {vendor.company_name}</p>
                  <p><strong>Username:</strong> {vendor.username}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Address:</strong> {vendor.business_address}</p>
                  {vendor.gst_number && (
                    <p><strong>GST Number:</strong> {vendor.gst_number}</p>
                  )}
                  <p><strong>Status:</strong> {vendor.status}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Add Products
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Orders
                  </Button>
                  <Button className="w-full" variant="outline">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VendorDashboard;
