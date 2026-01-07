'use client';
import React, { useEffect, useState } from "react";
import { Menu, X, Heart, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import LoginPopover from "./LoginPopover";
import SignupPopover from "./SignupPopover";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    unsubscribe = data.subscription.unsubscribe;
    fetchSession();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
  {
    id:1,
    name: "Home",
    href: "/"
  },
  {
    id:2,
    name: "Shop",
    href: "/shop"
  },
  {
    id:3,
    name: "Contact Us",
    href: "/contact"
  }
];
  return (
    <nav className="w-screen bg-background/80 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Logo */}
          <div className="shrink-0 text-2xl font-bold text-foreground">
            Pix4Walz
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {authLoading ? (
              <div className="w-24 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <button
                  className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition"
                  aria-label="Profile"
                  onClick={() => router.push("/profile")}
                >
                  <UserIcon size={20} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition"
                  aria-label="Favorites"
                  onClick={() => router.push("/wishlist")}
                >
                  <Heart size={20} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition"
                  aria-label="Cart"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingCart size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition text-destructive"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <LoginPopover open={showLogin} onOpen={()=> setShowLogin(true)} onClose={()=> setShowLogin(false)} />
                <SignupPopover />
              </>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/100 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col items-start px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-foreground/80 font-medium hover:text-primary hover:bg-accent/50 w-full p-2 rounded-md transition-all"
              >
                {link.name}
              </a>
            ))}
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
