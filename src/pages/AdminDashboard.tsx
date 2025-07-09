// 


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [awaitingAdminVendors, setAwaitingAdminVendors] = useState<any[]>([]);
  const [finalizingVendor, setFinalizingVendor] = useState<any | null>(null);
  const [finalUsername, setFinalUsername] = useState("");
  const [finalPassword, setFinalPassword] = useState("");
  const [finalizing, setFinalizing] = useState(false);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
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
        fetchAllData();
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVendors(),
        fetchOrders(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    const { data: pending } = await supabase
      .from("vendors")
      .select("*")
      .eq("status", "pending_approval");
    const { data: awaitingAdmin } = await supabase
      .from("vendors")
      .select("*")
      .eq("status", "awaiting_admin_approval");
    setPendingVendors(pending || []);
    setAwaitingAdminVendors(awaitingAdmin || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total_amount,
        status
      `)
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    } else {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, username, role, created_at")
      .order("created_at", { ascending: false });
      console.log("data:",data);

    if (!error) {
      setUsers(data || []);
    } else {
      console.error("Error fetching users:", error);
    }
  };

  const approvePendingVendor = async (vendor: any) => {
    setLoading(true);
    const randomPassword = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 1000);
    const token = Math.random().toString(36).substring(2) + Date.now();
    
    const { error } = await supabase
      .from("vendors")
      .update({
        status: "final_awaiting_approval",
        secure_token: token,
        username: vendor.email,
        password: randomPassword,
      })
      .eq("id", vendor.id);

    if (!error) {
      try {
        await fetch('http://localhost:4000/send-vendor-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: vendor.email,
            username: vendor.email,
            password: randomPassword,
            type: 'initial',
          }),
        });
        toast({
          title: "Success",
          description: `Credentials sent to ${vendor.email}`,
        });
        fetchVendors();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to send email",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const rejectPendingVendor = async (vendor: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("vendors")
      .update({ status: "rejected" })
      .eq("id", vendor.id);
    
    if (!error) {
      toast({
        title: "Success",
        description: "Vendor rejected",
      });
      fetchVendors();
    } else {
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleFinalApproval = async (vendor: any) => {
    setFinalizingVendor(vendor);
    setFinalUsername(vendor.username || "");
    setFinalPassword("");
  };

  const submitFinalApproval = async () => {
    if (!finalizingVendor) return;
    setFinalizing(true);
    
    const { error } = await supabase
      .from("vendors")
      .update({ status: "approved" })
      .eq("id", finalizingVendor.id);

    if (!error) {
      try {
        await fetch('http://localhost:4000/send-vendor-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: finalizingVendor.email,
            username: finalUsername,
            password: finalPassword,
            type: 'final',
          }),
        });
        toast({
          title: "Success",
          description: `Final approval sent to ${finalizingVendor.email}`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to send email",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
    
    setFinalizing(false);
    setFinalizingVendor(null);
    fetchVendors();
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    
    if (!error) {
      toast({
        title: "Success",
        description: "User role updated",
      });
      fetchUsers();
    } else {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.id.includes(searchTerm) ||
    order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Admin Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === "vendors" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("vendors")}
                >
                  Vendor Approvals
                </Button>
                <Button
                  variant={activeTab === "users" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("users")}
                >
                  User Management
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  Order Management
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>
                      Welcome to the admin panel. Manage your platform from here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{users.length}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Active Vendors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {awaitingAdminVendors.filter(v => v.status === 'approved').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{orders.length}</div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                            <TableCell>{order.profiles?.full_name || order.profiles?.email}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "vendors" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Vendor Approvals</CardTitle>
                    <CardDescription>
                      Review and approve new vendor applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingVendors.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No pending vendors
                      </div>
                    ) : (
                      pendingVendors.map(vendor => (
                        <Card key={vendor.id}>
                          <CardHeader>
                            <CardTitle>{vendor.company_name}</CardTitle>
                            <CardDescription>{vendor.name} • {vendor.email}</CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p><strong>Phone:</strong> {vendor.phone}</p>
                              <p><strong>GST:</strong> {vendor.gst_number}</p>
                              <p><strong>Business Address:</strong> {vendor.business_address}</p>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="destructive"
                                onClick={() => rejectPendingVendor(vendor)}
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => approvePendingVendor(vendor)}
                              >
                                Approve
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vendors Awaiting Final Approval</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {awaitingAdminVendors.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No vendors awaiting final approval
                      </div>
                    ) : (
                      awaitingAdminVendors.map(vendor => (
                        <Card key={vendor.id}>
                          <CardHeader>
                            <CardTitle>{vendor.company_name}</CardTitle>
                            <CardDescription>{vendor.name} • {vendor.email}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p><strong>Username:</strong> {vendor.username}</p>
                                <p><strong>Business Details:</strong> {vendor.business_details}</p>
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={() => handleFinalApproval(vendor)}>
                                  Final Approval
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      placeholder="Search users by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.full_name || "No name"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value) => updateUserRole(user.id, value)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    View and manage all customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <div className="mb-4">
                    <Input
                      placeholder="Search orders by ID, name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div> */}
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No orders found
                      </div>
                    ) : (
                      // filteredOrders.map(order => (
                        orders.map(order => (
                        <Card key={order.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                                <CardDescription>
                                  {order.profiles?.full_name || order.profiles?.email}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">
                                {order.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Order Details</h4>
                                <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                                <p>Total: ₹{order.total_amount.toFixed(2)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Items</h4>
                                <ul className="list-disc list-inside">
                                  {order.order_items?.map(item => (
                                    <li key={item.id}>
                                      {item.products?.name} × {item.quantity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex justify-end items-end">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Final Approval Modal */}
      {finalizingVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Final Vendor Approval</CardTitle>
              <CardDescription>
                Set credentials for {finalizingVendor.company_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={finalUsername}
                  onChange={(e) => setFinalUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={finalPassword}
                  onChange={(e) => setFinalPassword(e.target.value)}
                  placeholder="Leave blank to keep existing"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setFinalizingVendor(null)}
                  disabled={finalizing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitFinalApproval}
                  disabled={finalizing}
                >
                  {finalizing ? "Processing..." : "Approve Vendor"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  );
}