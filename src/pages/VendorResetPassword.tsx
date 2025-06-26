import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VendorResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const vendorSession = localStorage.getItem("vendor_session");
  const vendor = vendorSession ? JSON.parse(vendorSession) : null;

  if (!vendor || vendor.status !== "final_awaiting_approval") {
    navigate("/vendor/login");
    return null;
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ password, updated_at: new Date().toISOString() })
        .eq("id", vendor.id);
      if (error) throw error;
      // Update local session (status remains the same)
      const { data: updatedVendor } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendor.id)
        .single();
      if (updatedVendor) {
        localStorage.setItem("vendor_session", JSON.stringify(updatedVendor));
      }
      toast({
        title: "Password Reset Successful",
        description: "You can now use your new password.",
      });
      navigate("/vendor/dashboard");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl gradient-text text-center">
                Set Your New Password
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Please set a new password to continue.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter your new password"
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Setting..." : "Set Password & Continue"}
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

export default VendorResetPassword; 