"use client";

import { Fragment, useState, useEffect, MouseEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

interface ProductsSectionProps {
  page?: string;
  category?: string | null;
}

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  onSale?: boolean;
  outOfStock?: boolean;
}

export default function ProductsSection({
  page = "Store",
  category,
}: ProductsSectionProps) {
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const PAGE_SIZE = 9;
  const {
    user: wishlistUser,
    wishlistIds,
    pendingProductId,
    toggleWishlist,
  } = useWishlist();
  const {
    user: cartUser,
    addToCart,
    pendingProductId: pendingCartProductId,
  } = useCart();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.trim().length > 0) {
        try {
          const res = await fetch(
            `/api/products?q=${encodeURIComponent(inputValue)}&limit=5&page=1&sort=name`
          );
          const data = await res.json();
          if (Array.isArray(data?.items)) {
            setSuggestions(data.items);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (e) {
          console.error(e);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setInputValue(name);
    setSearchQuery(name);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          sort: sortBy,
          page: currentPage.toString(),
          limit: PAGE_SIZE.toString(),
        });

        if (category) {
          params.set("category", category);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (Array.isArray(data?.items)) {
          setProducts(data.items);
          const incomingTotal =
            typeof data.totalPages === "number" && data.totalPages > 0
              ? data.totalPages
              : 1;
          setTotalPages(incomingTotal);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        toast("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, sortBy, currentPage, category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const handleWishlistToggle = async (
    e: MouseEvent<HTMLButtonElement>,
    productId: number
  ) => {
    e.stopPropagation();
    if (!wishlistUser) {
      toast("Please log in to use wishlist");
      return;
    }
    try {
      await toggleWishlist(productId);
    } catch {
      /* errors handled in hook */
    }
  };

  const handleAddToCart = async (
    e: MouseEvent<HTMLButtonElement>,
    productId: number
  ) => {
    e.stopPropagation();
    if (!cartUser) {
      toast("Please log in to add items to your cart");
      return;
    }
    try {
      await addToCart(productId, 1);
    } catch {
      /* handled */
    }
  };

  const visiblePageNumbers = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);

    return Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  })();

  return (
    <div className="bg-card rounded-lg border border-border">
      

      {/* Header */}
      <div className="sticky top-16 z-10 bg-card/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {page}
            </h1>
            {category && (
              <p className="mt-1 text-sm text-muted-foreground">
                Showing results for{" "}
                <span className="font-semibold text-foreground">{category}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-auto max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full placeholder:text-muted-foreground"
              />
              {isFocused && showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                      onMouseDown={() => handleSuggestionClick(suggestion.name)}
                    >
                      {suggestion.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-foreground bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                onClick={() => {
                  router.push(`/shop/${p.id}`);
                }}
                className="group relative border border-border/50 rounded-2xl p-3 bg-card/30 backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-primary/50 transition-colors duration-300"
              >
                <div className="relative rounded-xl overflow-hidden aspect-square mb-4 bg-muted/20">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {p.onSale && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded shadow-md">
                      SALE!
                    </div>
                  )}
                  {p.outOfStock && (
                    <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded shadow-md">
                      OUT OF STOCK
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full hover:bg-secondary transition-colors shadow-sm border border-border/50"
                    aria-label="Toggle wishlist"
                    aria-pressed={wishlistIds.has(p.id)}
                    onClick={(e) => handleWishlistToggle(e, p.id)}
                    disabled={pendingProductId === p.id}
                  >
                    <Heart
                      size={18}
                      className={
                        wishlistIds.has(p.id)
                          ? "text-red-500 fill-red-500"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                </div>
                <div>
                  <h3 className="text-foreground font-medium text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    {p.onSale ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground line-through text-sm">
                          ₹{p.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-primary font-bold text-xl">
                          ₹{p.salePrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-primary font-bold text-xl">
                        ₹{p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-primary/20 disabled:opacity-60"
                      onClick={(e) => handleAddToCart(e, p.id)}
                      disabled={pendingCartProductId === p.id || p.outOfStock}
                    >
                      {p.outOfStock ? "Out of stock" : "Add to cart"}
                    </button>
                    <button
                      type="button"
                      className="p-2.5 rounded-lg border border-border hover:bg-secondary transition disabled:opacity-60 text-foreground"
                      onClick={(e) => handleAddToCart(e, p.id)}
                      aria-label="Quick add to cart"
                      disabled={pendingCartProductId === p.id || p.outOfStock}
                    >
                      <ShoppingCart
                        size={20}
                        className={
                          p.outOfStock ? "text-muted-foreground" : "text-foreground"
                        }
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }
                />
              </PaginationItem>
              {visiblePageNumbers.map((pageNumber, index) => {
                const previous = visiblePageNumbers[index - 1];
                const needsEllipsis =
                  previous !== undefined && pageNumber - previous > 1;

                return (
                  <Fragment key={pageNumber}>
                    {needsEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  </Fragment>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
