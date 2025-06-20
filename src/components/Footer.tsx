
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/categories/${slug}`);
  };

  return (
    <footer className="bg-muted/50 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CB</span>
              </div>
              <span className="font-bold text-lg gradient-text">Chennai Bazaar</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted local marketplace connecting Chennai's best vendors with customers. 
              Supporting local businesses, one order at a time.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Chennai
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Become a Vendor</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => handleCategoryClick("electronics")} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Electronics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("fashion")} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Fashion
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("food-grocery")} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Food & Grocery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("home-garden")} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Home & Garden
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("beauty-personal-care")} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Beauty
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 support@chennaibazaar.com</p>
              <p>📞 +91 44 1234 5678</p>
              <p>📍 T. Nagar, Chennai - 600017</p>
              <p>🕒 Mon - Sun: 8:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Chennai Bazaar Online. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
