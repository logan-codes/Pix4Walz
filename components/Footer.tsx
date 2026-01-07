import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-card/30 backdrop-blur-md text-foreground px-6 md:px-12 py-10 border-t border-border/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 - About */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Our Store</h3>
          <p className="text-muted-foreground text-sm">
            Pix4Walz is your go-to online store for all things posters. We offer a wide variety of high-quality posters to suit every taste and style.
          </p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="p-2 border border-border rounded-full hover:border-foreground transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 border border-border rounded-full hover:border-foreground transition-colors">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Column 2 - Quick links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Quick links</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="/profile" className="hover:text-foreground transition-colors">My account</a></li>
            <li><a href="/cart" className="hover:text-foreground transition-colors">Shopping Cart</a></li>
            <li><a href="/wishlist" className="hover:text-foreground transition-colors">Wishlist</a></li>
          </ul>
        </div>

        {/* Column 3 - Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Information</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Privacy policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Return & Refund Policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Terms & conditions</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-border pt-4 text-muted-foreground text-sm text-center">
        © 2025 All rights reserved by Pix4walz.
      </div>
    </footer>
  );
};

export default Footer;
