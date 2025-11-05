'use client';
import React, { useState } from "react";
import { Menu, X, Search, Heart, ShoppingCart, User } from "lucide-react";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
  const iconLinks = [
    { icon: <User size={20} />, label: "Login" },
    { icon: <Heart size={20} />, label: "Favorites" },
    { icon: <ShoppingCart size={20} />, label: "Cart" },
  ];

  return (
    <nav className="w-screen bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-gray-800">
            Pix4Walz
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-primary hover:text-muted-foreground transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className=" sm:flex items-center space-x-4">
            {iconLinks.map(({ icon, label }) => (
              <button
                key={label}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label={label}
              >
                {icon}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col items-start px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-gray-700 font-medium hover:text-gray-900 w-full"
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
