"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    user,
    items,
    isCartLoading,
    pendingProductId,
    checkoutLoading,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.salePrice ?? 0;
    return sum + price * item.quantity;
  }, 0);

  if (isCartLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingCart size={40} className="mx-auto text-gray-300" />
        <h1 className="text-2xl font-semibold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500">
          Sign in to keep track of the products you plan to buy.
        </p>
        <Button onClick={() => router.push("/shop")} className="gap-2">
          Browse products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-500 text-sm mt-1">
          {items.length} item{items.length === 1 ? "" : "s"} in your cart
        </p>
      </header>

      {items.length === 0 ? (
        <div className="text-center bg-white border rounded-2xl p-10 space-y-4">
          <p className="text-gray-600">Your cart is empty right now.</p>
          <Button onClick={() => router.push("/shop")} className="gap-2">
            Continue shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 border rounded-2xl p-4 bg-white shadow-sm"
              >
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product?.name ?? "Product"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ₹{item.product?.salePrice?.toFixed(2) ?? "0.00"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeFromCart(item.productId)}
                      disabled={pendingProductId === item.productId}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={pendingProductId === item.productId}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={pendingProductId === item.productId}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-6">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900 mb-6">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              onClick={() => router.push("/checkout")}
              disabled={items.length === 0}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

