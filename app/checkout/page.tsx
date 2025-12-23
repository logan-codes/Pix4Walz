"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Lock } from "lucide-react";
import Image from "next/image";


export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    items,
    isCartLoading,
    checkout,
    checkoutLoading,
    refreshCart,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Fetch and autofill profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const params = new URLSearchParams({
          supabaseId: user.id,
        });
        if (user.email) {
          params.append("email", user.email);
        }

        const res = await fetch(`/api/profile?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFullName(data.profile.name ?? "");
            setPhone(data.profile.phone ?? "");
            setAddress(data.profile.address ?? "");
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.product?.salePrice ?? 0;
        return sum + price * item.quantity;
      }, 0),
    [items]
  );

  const handlePlaceOrder = async () => {
    await checkout(paymentReference);
    router.push("/profile");
  };

  if (isCartLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingCart size={40} className="mx-auto text-gray-300" />
        <h1 className="text-2xl font-semibold text-gray-900">Sign in to checkout</h1>
        <p className="text-gray-500">You need an account to place orders.</p>
        <Button onClick={() => router.push("/shop")} className="gap-2">
          Browse products
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingCart size={40} className="mx-auto text-gray-300" />
        <h1 className="text-2xl font-semibold text-gray-900">No items to checkout</h1>
        <p className="text-gray-500">Add products to your cart before finishing.</p>
        <Button onClick={() => router.push("/shop")} className="gap-2">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Checkout</h1>
        <p className="text-gray-500 mt-1">
          Review your order and provide delivery details.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pay via UPI</h2>
            <p className="text-sm text-gray-600">
              Scan the QR code below using any UPI app and send the total amount. After
              payment, share a screenshot on WhatsApp for order confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="p-4 border rounded-2xl bg-gray-50">
                <Image
                  src="/upi-qr.png"
                  alt="Google Pay UPI QR"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  UPI ID: <span className="font-semibold">your-upi-id@bank</span>
                </p>
                <p>
                  WhatsApp: <span className="font-semibold">+91 98765 43210</span>
                </p>
                <p className="text-xs text-gray-500">
                  Please include the order number or your name in the WhatsApp message for
                  faster verification.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Shipping address</h2>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City, ZIP, Country"
              className="min-h-[120px]"
            />
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Order notes</h2>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional instructions for delivery"
              className="min-h-[100px]"
            />
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Payment confirmation</h2>
            <p className="text-sm text-gray-600">
              After paying via UPI, paste the last digits of the transaction reference (or
              any identifier) so we can match it quickly.
            </p>
            <Input
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="e.g. UPI reference number"
            />
          </div>
        </section>

        <section className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.product?.name ?? "Product"} × {item.quantity}
                </span>
                <span>
                  ₹{((item.product?.salePrice ?? 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-semibold text-gray-900 mt-6">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <Button
            className="w-full mt-6 gap-2"
            onClick={handlePlaceOrder}
            disabled={checkoutLoading}
          >
            <Lock size={16} />
            {checkoutLoading ? "Placing order..." : "Place order"}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            By placing your order you agree to the store’s terms and refund policy.
          </p>
        </section>
      </div>
    </div>
  );
}

