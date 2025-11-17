"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    image: string;
    salePrice: number;
    originalPrice: number;
    category: string[];
    outOfStock?: boolean;
}

export default function ProductPage() {
    const router = useRouter();
    const  pathname  = usePathname();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product>();
    const { user: wishlistUser, wishlistIds, toggleWishlist, pendingProductId } = useWishlist();
    const { user: cartUser, addToCart, pendingProductId: pendingCartProductId } = useCart();

    useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ extract numeric ID from /product/[id]
        const id = pathname.split("/").pop();

        if (!id) {
          console.error("No product ID found in URL");
          router.push("/shop");
          return;
        }

        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch product");
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        router.push("/shop");
      }
    };

    fetchProduct();
  }, [pathname, router]);

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
            <AspectRatio ratio={1}>
            <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
            />
            </AspectRatio>
        </div>

        {/* Product Details */}
        <div>
            <h1 className="text-3xl font-semibold mb-3">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-orange-500">
                ₹{product.salePrice.toLocaleString()}
            </span>
            <span className="line-through text-gray-400">
                ₹{product.originalPrice.toLocaleString()}
            </span>
            </div>

            {/* Wishlist */}
            <button
              type="button"
              className="flex items-center gap-2 text-gray-600 mb-5 hover:text-red-500 transition"
              onClick={async () => {
                if (!product) return;
                if (!wishlistUser) {
                  toast("Please log in to save items");
                  return;
                }
                try {
                  await toggleWishlist(product.id);
                } catch {
                  /* handled */
                }
              }}
              disabled={pendingProductId === product.id}
            >
              <Heart
                size={20}
                className={wishlistIds.has(product.id) ? "text-red-500 fill-red-500" : ""}
              />
              <span>
                {wishlistIds.has(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              </span>
            </button>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
            <button
                className="border px-3 py-1 rounded"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
                -
            </button>
            <span className="text-lg">{quantity}</span>
            <button
                className="border px-3 py-1 rounded"
                onClick={() => setQuantity(quantity + 1)}
            >
                +
            </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
            <button
              type="button"
              disabled={product.outOfStock || pendingCartProductId === product.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${
                product.outOfStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              onClick={async () => {
                if (!product || product.outOfStock) return;
                if (!cartUser) {
                  toast("Please log in to add items to cart");
                  return;
                }
                try {
                  await addToCart(product.id, quantity);
                } catch {
                  /* handled */
                }
              }}
            >
                <ShoppingCart size={20} />
                <span>
                  {product.outOfStock
                    ? "Out of Stock"
                    : pendingCartProductId === product.id
                      ? "Adding..."
                      : "Add To Cart"}
                </span>
            </button>
            </div>


            {/* Categories */}
            {/* <div className="text-sm text-gray-600">
            <strong>Categories:</strong>{" "}
            {product.category.map((c, i) => (
                <span key={i}>
                {c}
                {i < product.category.length - 1 && ", "}
                </span>
            ))}
            </div> */}

            {/* WhatsApp link */}
            <a
            href={`https://wa.me/?text=I want to buy ${encodeURIComponent(
                product.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-green-600 font-medium hover:underline"
            >
            <FaWhatsapp />
            </a>

            {/* Reviews Section */}
            <div className="mt-10 border-t pt-5">
            <h3 className="text-lg font-medium mb-2">Reviews (0)</h3>
            <p className="text-gray-500">No reviews yet.</p>
            </div>
        </div>
        </div>
    );
    }
