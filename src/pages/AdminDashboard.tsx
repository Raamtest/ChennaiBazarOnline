import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [awaitingVendors, setAwaitingVendors] = useState<any[]>([]);
  const [finalizingVendor, setFinalizingVendor] = useState<any | null>(null);
  const [finalUsername, setFinalUsername] = useState("");
  const [finalPassword, setFinalPassword] = useState("");
  const [finalizing, setFinalizing] = useState(false);
  const [secureLink, setSecureLink] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profileError || !profile || profile.role !== "admin") {
        navigate("/not-authorized");
      } else {
        setIsAdmin(true);
        fetchVendors();
      }
      setLoading(false);
    };
    checkAdmin();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchVendors = async () => {
    setLoading(true);
    const { data: pending, error: err1 } = await supabase
      .from("vendors")
      .select("*")
      .eq("status", "pending_approval");
    const { data: awaiting, error: err2 } = await supabase
      .from("vendors")
      .select("*")
      .eq("status", "awaiting_final_approval");
    setPendingVendors(pending || []);
    setAwaitingVendors(awaiting || []);
    setLoading(false);
  };

  // Approve pending vendor: generate secure link, update status
  const approvePendingVendor = async (vendor: any) => {
    setLoading(true);
    // Generate a secure token (simulate)
    const token = Math.random().toString(36).substring(2) + Date.now();
    const { error } = await supabase
      .from("vendors")
      .update({ status: "awaiting_final_approval", secure_token: token })
      .eq("id", vendor.id);
    if (!error) {
      setSecureLink(`${window.location.origin}/vendor/details?token=${token}`);
      setMessage(`Secure link generated for ${vendor.email}. Send this to the vendor.`);
      fetchVendors();
    }
    setLoading(false);
  };

  // Reject pending vendor
  const rejectPendingVendor = async (vendor: any) => {
    setLoading(true);
    await supabase.from("vendors").update({ status: "rejected" }).eq("id", vendor.id);
    fetchVendors();
    setLoading(false);
  };

  // Final approval: set username/password, update status to active
  const handleFinalApproval = async (vendor: any) => {
    setFinalizingVendor(vendor);
    setFinalUsername("");
    setFinalPassword("");
    setMessage("");
  };

  const submitFinalApproval = async () => {
    if (!finalizingVendor) return;
    setFinalizing(true);
    await supabase
      .from("vendors")
      .update({
        username: finalUsername,
        password: finalPassword,
        status: "active",
      })
      .eq("id", finalizingVendor.id);
    setMessage(`Credentials for ${finalizingVendor.email}: Username: ${finalUsername}, Password: ${finalPassword}`);
    setFinalizing(false);
    setFinalizingVendor(null);
    fetchVendors();
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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold gradient-text mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome, Admin! Here you can manage vendor approvals.</p>

        {message && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">{message}</div>}
        {secureLink && <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded break-all">Secure Link: <a href={secureLink} className="underline">{secureLink}</a></div>}

        <h2 className="text-xl font-bold mb-2">Pending Vendor Approvals</h2>
        {pendingVendors.length === 0 && <div className="mb-6">No pending vendors.</div>}
        {pendingVendors.map(vendor => (
          <div key={vendor.id} className="mb-4 p-4 border rounded bg-white flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div><b>Name:</b> {vendor.name}</div>
              <div><b>Email:</b> {vendor.email}</div>
              <div><b>Phone:</b> {vendor.phone}</div>
            </div>
            <div className="mt-2 md:mt-0 flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => approvePendingVendor(vendor)}>Approve</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => rejectPendingVendor(vendor)}>Reject</button>
            </div>
          </div>
        ))}

        <h2 className="text-xl font-bold mb-2 mt-8">Vendors Awaiting Final Approval</h2>
        {awaitingVendors.length === 0 && <div>No vendors awaiting final approval.</div>}
        {awaitingVendors.map(vendor => (
          <div key={vendor.id} className="mb-4 p-4 border rounded bg-white">
            <div><b>Name:</b> {vendor.name}</div>
            <div><b>Email:</b> {vendor.email}</div>
            <div><b>Company:</b> {vendor.company_name}</div>
            <div><b>GST:</b> {vendor.gst_number}</div>
            <div><b>Business Address:</b> {vendor.business_address}</div>
            <div className="mt-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleFinalApproval(vendor)}>Final Approve & Assign Credentials</button>
            </div>
          </div>
        ))}

        {/* Final approval modal/section */}
        {finalizingVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Assign Credentials to Vendor</h3>
              <div className="mb-2"><b>Name:</b> {finalizingVendor.name}</div>
              <div className="mb-2"><b>Email:</b> {finalizingVendor.email}</div>
              <input
                type="text"
                placeholder="Username"
                className="w-full mb-2 p-2 border rounded"
                value={finalUsername}
                onChange={e => setFinalUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={finalPassword}
                onChange={e => setFinalPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={submitFinalApproval} disabled={finalizing}>Approve & Send Credentials</button>
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setFinalizingVendor(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 