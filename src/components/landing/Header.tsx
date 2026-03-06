import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LedgerStash</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="nav-link text-sm font-medium">
            Features
          </a>
          <a href="#pricing" className="nav-link text-sm font-medium">
            Pricing
          </a>
          <a href="#how-it-works" className="nav-link text-sm font-medium">
            How It Works
          </a>
          <a href="#comparison" className="nav-link text-sm font-medium">
            Compare
          </a>
          <Link to="/contact" className="nav-link text-sm font-medium">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Button variant="hero" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/signup">Start Free Trial</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="nav-link text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="nav-link text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#how-it-works" className="nav-link text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#comparison" className="nav-link text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Compare</a>
              <Link to="/contact" className="nav-link text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <Button variant="hero" className="w-full justify-center" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-center" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="hero" className="w-full justify-center" asChild>
                    <Link to="/signup">Start Free Trial</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
