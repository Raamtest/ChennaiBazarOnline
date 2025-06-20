import { useState } from "react";
import { ShoppingCart, User, Heart, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handlePersonClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Get cart count
  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cart-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase
        .from('cart')
        .select('quantity')
        .eq('user_id', user.id);
      
      if (error) return 0;
      
      return data.reduce((sum, item) => sum + item.quantity, 0);
    },
    enabled: !!user,
  });

  // Get wishlist count
  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ['wishlist-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id);
      
      if (error) return 0;
      
      return data.length;
    },
    enabled: !!user,
  });

  const handleCartClick = () => {
    if (user) {
      navigate("/dashboard?tab=cart");
    } else {
      navigate("/cart");
    }
  };

  const handleWishlistClick = () => {
    if (user) {
      navigate("/dashboard?tab=wishlist");
    } else {
      navigate("/wishlist");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="py-2 text-center bg-primary text-primary-foreground text-sm">
          🎉 Free delivery for orders above ₹500 in Chennai! 🚚
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Chennai Bazaar</h1>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors font-medium">
              Products
            </Link>
            <Link to="/categories" className="text-foreground hover:text-primary transition-colors font-medium">
              Categories
            </Link>
            <Link to="/vendor/register" className="text-foreground hover:text-primary transition-colors font-medium">
              Become a Vendor
            </Link>
            <Link to="/offers" className="text-foreground hover:text-primary transition-colors font-medium">
              Offers
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search for mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist - Only show when logged in */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleWishlistClick}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Cart - Only show when logged in */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Person Icon - Only show when logged in */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePersonClick}
              >
                <User className="w-5 h-5" />
              </Button>
            )}

            {/* Logout Button - Only show when logged in */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}

            {/* Login Button - Only show when not logged in */}
            {!user && (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
