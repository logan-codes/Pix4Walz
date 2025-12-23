"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

export interface CartItemWithProduct {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    image: string;
    salePrice: number;
    originalPrice: number;
    outOfStock: boolean;
  } | null;
}

export function useCart() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // -------------------------
  // AUTH STATE LISTENER
  // -------------------------
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // -------------------------
  // FETCH CART ITEMS
  // -------------------------
  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        supabaseId: user.id,
        email: user.email ?? ""
      });

      const res = await fetch(`/api/cart?${params.toString()}`);

      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();
      const cartItems = Array.isArray(data.items) ? data.items : [];

      setItems(cartItems);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // -------------------------
  // ADD TO CART
  // -------------------------
  const addToCart = useCallback(
    async (productId: number, qty = 1) => {
      if (!user) throw new Error("User not authenticated");

      setPendingProductId(productId);

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            email: user.email,
            productId,
            quantity: qty
          })
        });

        if (!res.ok) throw new Error("Failed to add to cart");

        const updatedItem = await res.json();

        setItems(prev => {
          const idx = prev.findIndex(i => i.productId === productId);
          if (idx >= 0) {
            const clone = [...prev];
            clone[idx] = updatedItem;
            return clone;
          }
          return [updatedItem, ...prev];
        });

        toast.success("Added to cart");
      } catch (err) {
        toast.error("Unable to add to cart");
        throw err;
      } finally {
        setPendingProductId(null);
      }
    },
    [user]
  );

  // -------------------------
  // UPDATE QUANTITY
  // -------------------------
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!user) throw new Error("User not authenticated");

      setPendingProductId(productId);

      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            productId,
            quantity
          })
        });

        if (!res.ok) throw new Error("Failed to update quantity");

        const data = await res.json();

        if (quantity <= 0) {
          setItems(prev => prev.filter(i => i.productId !== productId));
        } else {
          setItems(prev =>
            prev.map(i => (i.productId === productId ? data : i))
          );
        }
      } catch (err) {
        toast.error("Unable to update quantity");
        throw err;
      } finally {
        setPendingProductId(null);
      }
    },
    [user]
  );

  // -------------------------
  // REMOVE ITEM
  // -------------------------
  const removeFromCart = useCallback(
    async (productId: number) => {
      if (!user) throw new Error("User not authenticated");

      setPendingProductId(productId);

      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            productId
          })
        });

        if (!res.ok) throw new Error("Failed to remove cart item");

        setItems(prev => prev.filter(i => i.productId !== productId));
      } catch (err) {
        toast.error("Unable to remove item");
        throw err;
      } finally {
        setPendingProductId(null);
      }
    },
    [user]
  );

  // -------------------------
  // CHECKOUT
  // -------------------------
  const checkout = useCallback(
    async (paymentReference?: string) => {
      if (!user) throw new Error("User not authenticated");

      setCheckoutLoading(true);

      try {
        const res = await fetch("/api/cart/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            email: user.email,
            paymentReference
          })
        });

        const payload = await res.json();

        if (!res.ok) throw new Error(payload.error);

        toast.success(payload.message ?? "Order placed!");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Unable to complete checkout"
        );
        throw err;
      } finally {
        setCheckoutLoading(false);
      }
    },
    [user]
  );

  return {
    user,
    items,
    isCartLoading: loading,
    pendingProductId,
    checkoutLoading,

    addToCart,
    updateQuantity,
    removeFromCart,
    checkout,
    refreshCart: fetchCart
  };
}
