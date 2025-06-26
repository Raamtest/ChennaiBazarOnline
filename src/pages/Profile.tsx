import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<any>(null);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    city: "Chennai",
    company_name: "",
    registration_number: "",
    pan_card: "",
    pan_type: "personal",
    gst_number: "",
    status: "",
  });
  const [gstImage, setGstImage] = useState<File | null>(null);
  const [panImage, setPanImage] = useState<File | null>(null);
  const [gstImageUrl, setGstImageUrl] = useState("");
  const [panImageUrl, setPanImageUrl] = useState("");

  useEffect(() => {
    const vendorSession = localStorage.getItem("vendor_session");
    if (!vendorSession) {
      navigate("/vendor/login");
      return;
    }
    try {
      const vendorData = JSON.parse(vendorSession);
      setVendor(vendorData);
      setProfile({
        username: vendorData.username || "",
        email: vendorData.email || "",
        phone: vendorData.phone || "",
        city: vendorData.city || "Chennai",
        company_name: vendorData.company_name || "",
        registration_number: vendorData.registration_number || "",
        pan_card: vendorData.pan_card || "",
        pan_type: vendorData.pan_type || "personal",
        gst_number: vendorData.gst_number || "",
        status: vendorData.status || "",
      });
      setGstImageUrl(vendorData.gst_image_url || "");
      setPanImageUrl(vendorData.pan_image_url || "");
    } catch (error) {
      console.error("Error parsing vendor session:", error);
      navigate("/vendor/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function logUser() {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Supabase Auth User:", user);
    }
    logUser();
  }, []);

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from("vendor-docs").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("vendor-docs").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    setLoading(true);
    try {
      let newStatus = vendor.status;
      if (
        profile.company_name &&
        profile.registration_number &&
        profile.pan_card &&
        profile.gst_number
      ) {
        newStatus = 'awaiting_admin_approval';
      }
      let gstUrl = gstImageUrl;
      let panUrl = panImageUrl;
      if (gstImage) {
        gstUrl = await uploadImage(gstImage, `gst/${vendor.id}-${Date.now()}-${gstImage.name}`);
        setGstImageUrl(gstUrl);
      }
      if (panImage) {
        panUrl = await uploadImage(panImage, `pan/${vendor.id}-${Date.now()}-${panImage.name}`);
        setPanImageUrl(panUrl);
      }
      const { error } = await supabase
        .from('vendors')
        .update({
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
          city: profile.city,
          company_name: profile.company_name,
          registration_number: profile.registration_number,
          pan_card: profile.pan_card,
          pan_type: profile.pan_type,
          gst_number: profile.gst_number,
          gst_image_url: gstUrl,
          pan_image_url: panUrl,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vendor.id);
      if (error) {
        console.error("Profile update error:", error);
        toast({
          title: "Update Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        const { data: updatedVendor } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', vendor.id)
          .single();
        if (updatedVendor) {
          localStorage.setItem('vendor_session', JSON.stringify(updatedVendor));
          setVendor(updatedVendor);
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendor_session");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/vendor/login");
  };

  if (!vendor) {
    return null;
  }

  // If status is final_awaiting_approval, require all 4 fields
  const requireBusinessFields = profile.status === 'final_awaiting_approval';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {vendor.name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <section className="py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      type="text"
                      value={profile.company_name}
                      onChange={e => setProfile({ ...profile, company_name: e.target.value })}
                      required={requireBusinessFields}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      type="text"
                      value={profile.registration_number}
                      onChange={e => setProfile({ ...profile, registration_number: e.target.value })}
                      required={requireBusinessFields}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan_card">PAN Card</Label>
                    <Input
                      id="pan_card"
                      type="text"
                      value={profile.pan_card}
                      onChange={e => setProfile({ ...profile, pan_card: e.target.value })}
                      required={requireBusinessFields}
                    />
                    <div>
                      <Label htmlFor="pan_type">PAN Type</Label>
                      <select
                        id="pan_type"
                        value={profile.pan_type}
                        onChange={e => setProfile({ ...profile, pan_type: e.target.value })}
                        required={requireBusinessFields}
                        className="w-full p-2 border rounded"
                      >
                        <option value="personal">Personal</option>
                        <option value="company">Company</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gst_number">GST Number</Label>
                    <Input
                      id="gst_number"
                      type="text"
                      value={profile.gst_number}
                      onChange={e => setProfile({ ...profile, gst_number: e.target.value })}
                      required={requireBusinessFields}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gst_image">GST Certificate (Image or PDF)</Label>
                    <Input id="gst_image" type="file" accept="image/*,application/pdf" onChange={e => setGstImage(e.target.files?.[0] || null)} />
                    {gstImageUrl && (gstImageUrl.endsWith('.pdf') ? (
                      <a href={gstImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">View GST Certificate (PDF)</a>
                    ) : (
                      <img src={gstImageUrl} alt="GST Certificate" className="w-32 h-32 object-cover mt-2" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan_image">PAN Card (Image or PDF)</Label>
                    <Input id="pan_image" type="file" accept="image/*,application/pdf" onChange={e => setPanImage(e.target.files?.[0] || null)} />
                    {panImageUrl && (panImageUrl.endsWith('.pdf') ? (
                      <a href={panImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">View PAN Card (PDF)</a>
                    ) : (
                      <img src={panImageUrl} alt="PAN Card" className="w-32 h-32 object-cover mt-2" />
                    ))}
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

