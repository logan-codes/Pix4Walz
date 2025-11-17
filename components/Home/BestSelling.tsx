"use client";
import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";

interface BestSellingProduct {
  id: number;
  title: string;
  subtitle: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  sale?: boolean;
  outOfStock?: boolean;
}

const BestSellingSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const visibleCount = 5;
  const router = useRouter();
  const { user, wishlistIds, toggleWishlist, pendingProductId } = useWishlist();

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIndex((prev) =>
      Math.min(prev + 1, bestSellingProducts.length - visibleCount)
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const cardWidth = 256 + 24; // w-64 (256px) + gap-6 (24px)

  useEffect(() => {
    const fetchBestSelling = async () => {
      setLoading(true);
      try {
        const response = await fetch("api/best-selling");
        const data = await response.json();
        if (Array.isArray(data)) {
          setBestSellingProducts(data);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (error) {
        toast("Error loading best-selling products");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  return (
    <section className="py-12 px-6 relative">
      <h2 className="text-3xl font-bold text-center mb-8">Best Selling</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="overflow-hidden w-full">
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${startIndex * cardWidth}px)`,
            }}
          >
            {isLoading
              ? Array.from({ length: visibleCount }).map((_, index) => (
                  <div
                    key={index}
                    className="relative w-64 shrink-0 border rounded-lg overflow-hidden shadow animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-5 bg-gray-300 rounded w-40"></div>
                      <div className="flex gap-2">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="ml-auto h-8 w-8 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="mt-4 w-full h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              : bestSellingProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/shop/${product.id}`)}
                    className="relative w-64 shrink-0 border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  >
                    {product.sale && !product.outOfStock && (
                      <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs px-2 py-1 rounded z-10">
                        SALE!
                      </span>
                    )}
                    {product.outOfStock && (
                      <span className="absolute top-12 left-0 right-0 bg-black bg-opacity-60 text-white text-sm text-center py-1 z-10">
                        OUT OF STOCK
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <div className="text-gray-500 text-xs">{product.subtitle}</div>
                      <h3 className="font-bold text-lg">{product.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="line-through text-gray-400">
                          ₹{product.originalPrice}
                        </span>
                        <span className="font-semibold text-orange-500">
                          ₹{product.discountedPrice}
                        </span>
                        <button
                          className="ml-auto p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!user) {
                              toast("Please log in to use wishlist");
                              return;
                            }
                            try {
                              await toggleWishlist(product.id);
                            } catch {
                              /* handled in hook */
                            }
                          }}
                          aria-pressed={wishlistIds.has(product.id)}
                          aria-label="Toggle wishlist"
                          disabled={pendingProductId === product.id}
                        >
                          <Heart
                            size={18}
                            className={
                              wishlistIds.has(product.id)
                                ? "text-red-500 fill-red-500"
                                : "text-gray-700"
                            }
                          />
                        </button>
                      </div>
                      {!product.outOfStock && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            router.push(`/shop/${product.id}`);
                          }}
                          className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex >= bestSellingProducts.length - visibleCount}
          className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default BestSellingSection;
