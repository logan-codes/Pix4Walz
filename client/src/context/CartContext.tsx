import { createContext, useContext, useState, ReactNode } from "react";

export interface Poster {
  id: string;
  title: string;
  category: string;
  image: string;
  size?: string;
  os?: number;
}

export interface CartItem extends Poster {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (poster: Poster) => void;
  removeFromCart: (posterId: string) => void;
  updateQuantity: (posterId: string, quantity: number) => void;
  clearCart: () => void;
  wishlistItems: Poster[];
  addToWishlist: (poster: Poster) => void;
  removeFromWishlist: (posterId: string) => void;
  isInWishlist: (posterId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Poster[]>([]);

  const addToCart = (poster: Poster) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => 
        item.id === poster.id && item.size === poster.size);
      
      if (existingItem) {
        // Increase quantity if item exists
        return prevItems.map(item => 
          (item.id === poster.id && item.size === poster.size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new item with quantity 1
      return [...prevItems, { ...poster, quantity: 1 }];
    });
  };

  const removeFromCart = (posterId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== posterId));
  };

  const updateQuantity = (posterId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(posterId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === posterId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const addToWishlist = (poster: Poster) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.id === poster.id);
      if (exists) return prevItems;
      return [...prevItems, poster];
    });
  };
  
  const removeFromWishlist = (posterId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== posterId));
  };
  
  const isInWishlist = (posterId: string) => {
    return wishlistItems.some(item => item.id === posterId);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};