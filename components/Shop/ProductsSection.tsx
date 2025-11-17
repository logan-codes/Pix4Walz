"use client";

import { useState, useEffect, Fragment } from "react";
import { Heart, Search } from "lucide-react";
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

export default function ProductsSection({ page = "Store", category }: ProductsSectionProps) {
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const PAGE_SIZE = 9;

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
    <div className="bg-white rounded-lg">
      {/* Breadcrumb */}
      <div className="sticky top-16 z-10 bg-white px-4 sm:px-6 lg:px-8 py-4 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="sticky top-28 z-10 bg-white px-4 sm:px-6 lg:px-8 py-8 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">{page}</h1>
            {category && (
              <p className="mt-1 text-sm text-gray-500">
                Showing results for <span className="font-semibold">{category}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-none text-sm text-gray-700 bg-white cursor-pointer focus:outline-none"
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
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} onClick= {()=>{router.push(`/shop/${p.id}`)}}className="group relative">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square mb-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.onSale && (
                    <div className="absolute top-4 left-4 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded">
                      SALE!
                    </div>
                  )}
                  {p.outOfStock && (
                    <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded">
                      OUT OF STOCK
                    </div>
                  )}
                  <button className="absolute bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-gray-900 text-base mb-2 group-hover:text-gray-600">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      ₹{p.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-900 font-semibold text-lg">
                      ₹{p.salePrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
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
                  className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
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
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
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
