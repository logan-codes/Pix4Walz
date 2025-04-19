
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PosterCard1 from "@/components/PosterCard1";
import { ArrowLeft } from "lucide-react";

const Wishlist = () => {
  const { wishlistItems } = useCart();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-20">
      <Link to="/" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft size={16} className="mr-1" /> Back to posters
      </Link>

      <div className="flex  items-start flex-col mb-8">
        <h1 className="text-3xl font-bold">Liked Posters</h1>
        <p className="text-gray-500 mt-2">
          {wishlistItems.length === 0 
            ? "You haven't liked any posters yet."
            : `You have ${wishlistItems.length} liked ${wishlistItems.length === 1 ? 'poster' : 'posters'}.`
          }
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistItems.map((poster) => (
            <PosterCard1 key={poster.id} poster={poster} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Start exploring our collection and like your favorite posters!</p>
          <Button asChild className="bg-white text-black hover:bg-black hover:text-white">
            <Link to="/">Browse Posters</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;