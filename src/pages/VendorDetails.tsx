
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VendorDetails = () => {
  const [searchParams] = useSearchParams();
  const [vendor, setVendor] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    gst_number: "",
    business_address: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Access",
        description: "No valid token provided.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchVendorDetails();
  }, [token]);

  const fetchVendorDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("secure_token", token)
        .eq("status", "approved_for_details")
        .single();

      if (error || !data) {
        throw new Error("Invalid or expired token");
      }

      setVendor(data);
      setFormData({
        company_name: data.company_name || "",
        gst_number: data.gst_number || "",
        business_address: data.business_address || "",
        username: data.username || "",
        password: "",
      });
    } catch (error: any) {
      console.error("Error fetching vendor:", error);
      toast({
        title: "Access Denied",
        description: "Invalid or expired token.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("vendors")
        .update({
          ...formData,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("secure_token", token);

      if (error) {
        throw error;
      }

      toast({
        title: "Details Submitted",
        description: "Your business details have been submitted successfully. You can now login to your vendor account.",
      });

      navigate("/vendor/login");
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (fetchLoading) {
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
            <p>Invalid or expired token.</p>
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl gradient-text text-center">
                Complete Your Vendor Profile
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Welcome {vendor.name}! Please complete your business details.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <Label htmlFor="gst_number">GST Number (Optional)</Label>
                  <Input
                    id="gst_number"
                    name="gst_number"
                    type="text"
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="Enter your GST number"
                  />
                </div>

                <div>
                  <Label htmlFor="business_address">Business Address</Label>
                  <Textarea
                    id="business_address"
                    name="business_address"
                    value={formData.business_address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your complete business address"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Choose a unique username"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a secure password"
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Complete Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VendorDetails;
