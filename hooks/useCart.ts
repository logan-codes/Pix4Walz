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
  product?: {
    id: number;
    name: string;
    image: string;
    salePrice: number;
    originalPrice: number;
    outOfStock?: boolean;
  } | null;
}

export function useCart() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (active) {
        setUser(session?.user ?? null);
      }
    };

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    init();

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

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
      });
      if (user.email) {
        params.append("email", user.email);
      }

      const res = await fetch(`/api/cart?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load cart");
      }

      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: number, qty = 1) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      setPendingProductId(productId);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            email: user.email,
            productId,
            quantity: qty,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to add to cart");
        }

        const updatedItem = await res.json();
        setItems((prev) => {
          const idx = prev.findIndex((item) => item.productId === productId);
          if (idx >= 0) {
            const clone = [...prev];
            clone[idx] = updatedItem;
            return clone;
          }
          return [updatedItem, ...prev];
        });
        toast.success("Added to cart");
      } catch (error) {
        console.error(error);
        toast.error("Unable to add to cart");
        throw error;
      } finally {
        setPendingProductId((prev) => (prev === productId ? null : prev));
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      setPendingProductId(productId);
      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            productId,
            quantity,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update quantity");
        }

        const data = await res.json();

        if (quantity <= 0) {
          setItems((prev) => prev.filter((item) => item.productId !== productId));
        } else {
          setItems((prev) =>
            prev.map((item) => (item.productId === productId ? data : item))
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to update quantity");
        throw error;
      } finally {
        setPendingProductId((prev) => (prev === productId ? null : prev));
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    async (productId: number) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      setPendingProductId(productId);
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: user.id,
            productId,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to remove cart item");
        }

        setItems((prev) => prev.filter((item) => item.productId !== productId));
      } catch (error) {
        console.error(error);
        toast.error("Unable to remove item");
        throw error;
      } finally {
        setPendingProductId((prev) => (prev === productId ? null : prev));
      }
    },
    [user]
  );

  const checkout = useCallback(async (paymentReference?: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseId: user.id,
          email: user.email,
          paymentReference,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to checkout");
      }

      const payload = await res.json();
      toast.success(payload.message ?? "Order placed!");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Unable to complete checkout"
      );
      throw error;
    } finally {
      setCheckoutLoading(false);
    }
  }, [user, fetchCart]);

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
    refreshCart: fetchCart,
  };
}

