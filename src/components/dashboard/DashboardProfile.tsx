
// import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";

// const DashboardProfile = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     //mobile: "",
//     phone: "",
//     dno: "",
//     street: "",
//     city: "Chennai",
//   });

//   useEffect(() => {
//     if (user) {
//       fetchProfile();
//     }
//   }, [user]);

//   const fetchProfile = async () => {
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", user.id)
//       .single();

//     if (error && error.code !== "PGRST116") {
//       console.error("Error fetching profile:", error);
//       return;
//     }

//     if (data) {
//       setProfile({
//         username: data.username || "",
//         email: data.email || user.email || "",
//         //mobile: data.mobile || "",
//         phone: data.phone || "",
//         dno: data.dno || "",
//         street: data.street || "",
//         city: data.city || "Chennai",
//       });
//     } else {
//       setProfile(prev => ({ ...prev, email: user.email || "" }));
//     }
//   };

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setLoading(true);
//     const { error } = await supabase
//       .from("profiles")
//       .upsert({
//         id: user.id,
//         ...profile,
//       });

//     if (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update profile",
//         variant: "destructive",
//       });
//     } else {
//       toast({
//         title: "Success",
//         description: "Profile updated successfully",
//       });
//     }
//     setLoading(false);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Profile</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleUpdateProfile} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 value={profile.username}
//                 onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
//                 required
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={profile.email}
//                 onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
//                 required
//               />
//             </div>
            
//             {/* <div>
//               <Label htmlFor="mobile">Mobile Number</Label>
//               <Input
//                 id="mobile"
//                 value={profile.mobile}
//                 onChange={(e) => setProfile(prev => ({ ...prev, mobile: e.target.value }))}
//               />
//             </div>
//              */}
//             <div>
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 value={profile.phone}
//                 onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="dno">Door No</Label>
//               <Input
//                 id="dno"
//                 value={profile.dno}
//                 onChange={(e) => setProfile(prev => ({ ...prev, dno: e.target.value }))}
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="street">Street Address</Label>
//               <Input
//                 id="street"
//                 value={profile.street}
//                 onChange={(e) => setProfile(prev => ({ ...prev, street: e.target.value }))}
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="city">City</Label>
//               <Input
//                 id="city"
//                 value={profile.city}
//                 onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
//               />
//             </div>
//           </div>
          
//           <Button type="submit" disabled={loading}>
//             {loading ? "Updating..." : "Update Profile"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default DashboardProfile;


import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    doorno: "",
    streetaddress: "",
    city: "Chennai",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setProfile({
        username: data.username || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        doorno: data.doorno || "",
        streetaddress: data.streetaddress || "",
        city: data.city || "Chennai",
      });
    } else {
      setProfile(prev => ({ ...prev, email: user.email || "" }));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="doorno">Door No</Label>
              <Input
                id="doorno"
                value={profile.doorno}
                onChange={(e) => setProfile(prev => ({ ...prev, doorno: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="streetaddress">Street Address</Label>
              <Input
                id="streetaddress"
                value={profile.streetaddress}
                onChange={(e) => setProfile(prev => ({ ...prev, streetaddress: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardProfile;