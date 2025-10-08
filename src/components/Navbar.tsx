import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/klarvia-logo.png";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import ProfileMenu from "@/components/ProfileMenu";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Check URL parameters to auto-open login modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showLogin') === 'true') {
      setIsLoginOpen(true);
    }
  }, [location]);

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-smooth">
              <img src={logo} alt="Klarvia" className="h-10 w-auto" />
              <span className="text-xl font-semibold">klarvia</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/klarvia" 
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  isActive('/klarvia') ? 'text-primary' : 'text-foreground'
                }`}
              >
                Klarvia
              </Link>
              {import.meta.env.DEV && (
                <Link 
                  to="/inspect-db" 
                  className={`text-sm font-medium transition-smooth hover:text-primary ${
                    isActive('/inspect-db') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Inspect DB
                </Link>
              )}
              
              {user ? (
                <ProfileMenu />
              ) : (
                <div className="flex gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="transition-smooth"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
                    onClick={() => setIsSignupOpen(true)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/klarvia" 
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  isActive('/klarvia') ? 'text-primary' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Klarvia
              </Link>
              {!user && (
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setIsSignupOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Navbar;
