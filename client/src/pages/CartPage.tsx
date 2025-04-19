import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  
  const subtotal = cartItems.reduce((total, item) => total + (item.quantity ), 0);
  
  if (cartItems.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-20 h-screen">
        <Link to="/" className="flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back to posters
        </Link>
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <ShoppingBag size={40} className="text-gray-500 mb-4" />
          <h1 className="text-2xl font-medium mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some movie posters to get started!</p>
          <Link to="/">
            <Button
            className="bg-white text-black hover:bg-black hover:text-white"
            >Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container min-h-screen max-w-7xl mx-auto px-4 py-20">
      <div className="flex items-center align-middle mb-8 flex-col sm:flex-row">
        <Link to="/" className="flex items-center text-sm mb-8 hover:underline1">
          <ArrowLeft size={16} className="mr-1" /> Back to posters
        </Link>
        <h1 className="flex text-2xl font-medium mb-8   mx-auto ">Shopping Cart</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ul className="space-y-6">
            {cartItems.map((item) => (
              <li key={`${item.id}`} className="flex gap-4 p-4 border rounded-lg">
                <div className="w-24 h-32 bg-muted flex-shrink-0 overflow-hidden rounded">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      {item.size && <p className="flex text-sm text-muted-foreground">{item.size}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white text-black hover:bg-black hover:text-white"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white text-black hover:bg-black hover:text-white"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                      <span className="sr-only">Increase</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto text-xs hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <Button className="w-full bg-white text-black hover:bg-black hover:text-white">Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;