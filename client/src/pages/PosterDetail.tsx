
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, Minus, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { POSTERS, SIZE_OPTIONS } from '@/data/posters';

const PosterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  
  const [poster, setPoster] = useState(POSTERS[0]); 
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  
  useEffect(() => {
    // Find poster details
    const foundPoster = POSTERS.find(p => p.id === id);
    if (foundPoster) {
      setPoster(foundPoster);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleAddToCart = () => {
    // Add poster with selected size info
    const posterWithSize = {
      ...poster,
      price: selectedSize.price,
      size: selectedSize.label
    };
    
    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(posterWithSize);
    }
  };
  
  const handleWishlistToggle = () => {
    if (isInWishlist(poster.id)) {
      removeFromWishlist(poster.id);
    } else {
      addToWishlist(poster);
    }
  };
  
  const adjustQuantity = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-20">
      {/* Back button */}
      <Link to="/" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft size={16} className="mr-1" /> Back to posters
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Poster Image */}
        <div className="bg-accent/20 rounded-lg overflow-hidden">
          <img 
            src={poster.image} 
            alt={poster.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Poster Details */}
        <div className="space-y-6">
          <div>
            <h1 className="flex text-3xl font-bold">{poster.title}</h1>
            <div className="mt-4">
              <p className="flex text-2xl font-bold">
              {"₹"+(selectedSize.price)}
              </p>
              <p className="flex text-sm text-green-600 mt-1">In Stock</p>
            </div>
          </div>
          
          {/* Size Selection */}
          <div>
            <h3 className="flex text-sm font-medium mb-3">Size</h3>
            <div className="grid grid-cols-2 gap-3">
              {SIZE_OPTIONS.map(size => (
                <Button
                  key={size.label}
                  type="button"
                  variant={selectedSize.label === size.label ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="justify-start bg-white text-black hover:bg-black hover:text-white"
                >
                  <span>{size.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div>
            <h3 className="flex text-sm font-medium mb-3 ">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => adjustQuantity(-1)}
                className="bg-white text-black hover:bg-black hover:text-white"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => adjustQuantity(1)}
                className="bg-white text-black hover:bg-black hover:text-white"
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart / Wishlist */}
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black hover:bg-black hover:text-white"
              size="lg"
            >
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleWishlistToggle}
              className={`h-11 w-11 hover:bg-red-50 hover:text-red-500 ${isInWishlist(poster.id) ? 'bg-red-100 text-red-600 border-red-200' : ''}`}
            >
              <Heart 
                size={20} 
                fill={isInWishlist(poster.id) ? "currentColor" : "none"} 
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterDetail;