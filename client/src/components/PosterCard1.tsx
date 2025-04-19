import { Link } from 'react-router-dom';
import { Poster } from '../context/CartContext.tsx';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface PosterCardProps {
  poster: Poster;
}

const PosterCard = ({ poster }: PosterCardProps) => {
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(poster);
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(poster.id)) {
      removeFromWishlist(poster.id);
    } else {
      addToWishlist(poster);
    }
  };

  return (
    <Link to={`/poster/${poster.id}`} className="group block">
      <div className="space-y-3">
        <div className="aspect-[3/4] bg-card rounded-md overflow-hidden relative">
          <img 
            src={poster.image} 
            alt={poster.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          />
          <div className="absolute top-0 left-0 w-full h-full hidden group-hover:flex transition-opacity duration-300 bg-black/40 items-center justify-center">
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white text-black"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={16} />
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white text-black"
                onClick={handleWishlistToggle}
              >
                <Heart 
                  size={16}  
                  fill={isInWishlist(poster.id) ? "red" : "none"} 
                  color={isInWishlist(poster.id) ? "none" : "black"}
                />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium truncate">{poster.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default PosterCard;
