
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { User, Package, ShoppingCart, Heart, Settings, LayoutDashboard } from "lucide-react";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import DashboardOrders from "@/components/dashboard/DashboardOrders";
import DashboardCart from "@/components/dashboard/DashboardCart";
import DashboardWishlist from "@/components/dashboard/DashboardWishlist";
import DashboardSettings from "@/components/dashboard/DashboardSettings";
import DashboardHome from "@/components/dashboard/DashboardHome";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Wait for auth loading to complete before checking user
    if (loading) return;
    
    if (!user) {
      navigate("/login");
      return;
    }

    // Check for tab parameter in URL
    const tabParam = searchParams.get("tab");
    if (tabParam && ["dashboard", "profile", "orders", "cart", "wishlist", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [user, loading, navigate, searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Show loading state while auth is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render anything if user is not authenticated
  if (!user) return null;

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <DashboardProfile />;
      case "orders":
        return <DashboardOrders />;
      case "cart":
        return <DashboardCart />;
      case "wishlist":
        return <DashboardWishlist />;
      case "settings":
        return <DashboardSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 min-h-screen bg-card border-r">
          <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold gradient-text">Welcome back, {user.email}!</h2>
              <p className="text-muted-foreground">Manage your account and orders</p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange(item.id)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
