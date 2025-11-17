"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const {
    user,
    wishlistItems,
    isWishlistLoading,
    toggleWishlist,
    pendingProductId,
  } = useWishlist();

  if (isWishlistLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <Heart size={40} className="mx-auto text-gray-300" />
        <h1 className="text-2xl font-semibold text-gray-900">Sign in to save favorites</h1>
        <p className="text-gray-500">
          Create an account or log in to keep track of the products you love.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/")}>Go home</Button>
          <Button variant="outline" onClick={() => router.push("/shop")}>
            Browse shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-gray-900">My Wishlist</h1>
        <p className="text-gray-500 text-sm">
          {wishlistItems.length === 0
            ? "You have not saved any items yet."
            : `You have ${wishlistItems.length} item${
                wishlistItems.length === 1 ? "" : "s"
              } saved for later.`}
        </p>
      </header>

      {wishlistItems.length === 0 ? (
        <div className="text-center bg-white border rounded-2xl p-10 space-y-4">
          <p className="text-gray-600">
            Start adding products you like by tapping the heart icon in the shop.
          </p>
          <Button onClick={() => router.push("/shop")} className="gap-2">
            Browse products
            <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/shop/${item.productId}`)}
            >
              <div className="relative aspect-square bg-gray-50">
                {item.product?.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
                <button
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white"
                  onClick={async (event) => {
                    event.stopPropagation();
                    await toggleWishlist(item.productId);
                  }}
                  disabled={pendingProductId === item.productId}
                  aria-label="Remove from wishlist"
                >
                  <Heart className="text-red-500 fill-red-500" size={18} />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <p className="font-medium text-gray-900">{item.product?.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{item.product?.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{item.product?.originalPrice.toFixed(2)}
                  </span>
                </div>
                <Link
                  href={`/shop/${item.productId}`}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 gap-1"
                >
                  View details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

