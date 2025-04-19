import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { Button } from './ui/button';
import Logo from '@/assets/logo.jpg';
import { Navigation } from '@/data/posters';
import { useCart } from '@/context/CartContext';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, } from "@/components/ui/navigation"


const Navbar = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cartItems, wishlistItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) { 
      setShow(false); 
    } else{ 
      setShow(true);  
    }
    setLastScrollY(window.scrollY); 
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
       window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header className={`bg-white fixed w-screen py-4 shadow-sm z-20 top-0 left-0 right-0 transition-transform duration-300 ${show ? 'translate-y-0' :'-translate-y-full'}`}>
      <div className="mx-5 md:px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 gap-1.5 text-2xl font-bold">
          <img src={Logo} alt="Logo" className="sm:w-10 sm:h-10 rounded-2xl   w-5 h-5" />
          Pix4Walz
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-2 justify-end">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavigationMenuItem>
                <Link to="/" className="text-sm font-medium hover:text-gray-300 transition-colors">
                  Home
                </Link>
              </NavigationMenuItem>
              {Navigation.slice(0, 4).map(collection => (
                <NavigationMenuItem key={collection.id}>
                  <Link 
                    key={collection.id}
                    to={`/${collection.name}`} 
                    className="text-sm font-medium hover:text-gray-300  transition-colors"
                  >
                    {collection.name}
                  </Link>
                </NavigationMenuItem>
              ))}
            </nav>
            <div className="text-gray-600 gap-1.5 flex items-center ">
              <Link to="/wishlist">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative bg-white text-black hover:bg-gray-100"
                >
                  <Heart size={20} className="text-black"/>
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/cart">
                <Button 
                variant="ghost" 
                className="relative items-center bg-white text-black hover:bg-gray-100"
                >
                  <ShoppingBag size={20} className="text-black"/>
                  {totalItems > 0 && (
                <span className="absolute -top-2 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
                </Button>
              </Link>
              <Link to="/order">
                <Button 
                variant="ghost" 
                className="flex items-center bg-white text-black hover:bg-gray-100"
                >
                  <User size={20} />
                </Button>
              </Link>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 mt-4 bg-background">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-primary/80 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {Navigation.map(collection => (
              <Link 
                key={collection.id}
                to={`/${collection.name}`} 
                className="text-sm font-medium hover:text-primary/80 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {collection.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
