"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";

interface BestSellingProduct {
  id: number;
  name: string;
  subtitle: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  onSale?: boolean;
  outOfStock?: boolean;
}

const BestSellingSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const router = useRouter();
  const { user, wishlistIds, toggleWishlist, pendingProductId } = useWishlist();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setVisibleCount(5); // 2xl
      else if (width >= 1280) setVisibleCount(4); // xl
      else if (width >= 1024) setVisibleCount(3); // lg
      else if (width >= 768) setVisibleCount(2); // md
      else setVisibleCount(1); // sm
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clamp startIndex when visibleCount changes
  useEffect(() => {
    if (bestSellingProducts.length > 0) {
      setStartIndex((prev) => Math.min(prev, Math.max(0, bestSellingProducts.length - visibleCount)));
    }
  }, [visibleCount, bestSellingProducts.length]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIndex((prev) =>
      Math.min(prev + 1, bestSellingProducts.length - visibleCount)
    );
    setTimeout(() => setIsAnimating(false), 700);
  };

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
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground tracking-tight">Best Selling</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition disabled:opacity-50 disabled:cursor-not-allowed border border-border"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="overflow-hidden w-full -mx-3">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${startIndex * (100 / visibleCount)}%)`,
            }}
          >
            {isLoading
              ? Array.from({ length: visibleCount }).map((_, index) => (
                  <div
                    key={index}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div className="relative border border-border/50 rounded-lg overflow-hidden shadow-lg animate-pulse bg-card/30 backdrop-blur-sm">
                      <div className="w-full h-48 bg-muted/50"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-3 bg-muted/50 rounded w-20"></div>
                        <div className="h-5 bg-muted/50 rounded w-40"></div>
                        <div className="flex gap-2">
                          <div className="h-4 bg-muted/50 rounded w-16"></div>
                          <div className="h-4 bg-muted/50 rounded w-16"></div>
                          <div className="ml-auto h-8 w-8 bg-muted/50 rounded-full"></div>
                        </div>
                        <div className="mt-4 w-full h-10 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              : bestSellingProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    onClick={() => router.push(`/shop/${product.id}`)}
                    className="relative w-full border border-border/50 rounded-2xl overflow-hidden shadow-lg bg-card/40 backdrop-blur-md hover:shadow-2xl hover:border-primary/50 transition-colors duration-300 cursor-pointer group"
                  >
                    {product.onSale && !product.outOfStock && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded z-10 shadow-md">
                        SALE!
                      </span>
                    )}
                    {product.outOfStock && (
                      <span className="absolute top-12 left-0 right-0 bg-black/80 backdrop-blur-sm text-white text-sm text-center py-1 z-10">
                        OUT OF STOCK
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4">
                      <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{product.subtitle}</div>
                      <h3 className="font-bold text-lg text-foreground line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        {product.onSale ? (
                          <div className="flex items-baseline gap-2">
                            <span className="line-through text-muted-foreground text-sm">
                              ₹{product.originalPrice}
                            </span>
                            <span className="font-bold text-primary text-lg">
                              ₹{product.salePrice}
                            </span>
                          </div>): (
                            <span className="font-bold text-primary text-lg">
                              ₹{product.originalPrice}
                            </span>
                          )
                        }
                        <button
                          className="ml-auto p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition shadow-sm"
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
                                : "text-muted-foreground"
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
                          className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition shadow-lg hover:shadow-primary/20"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </motion.div>
                  </div>
                ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex >= bestSellingProducts.length - visibleCount}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition disabled:opacity-50 disabled:cursor-not-allowed border border-border shadow-md"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default BestSellingSection;
