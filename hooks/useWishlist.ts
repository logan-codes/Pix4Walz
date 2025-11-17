"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface WishlistItemWithProduct {
  id: number;
  productId: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    image: string;
    salePrice: number;
    originalPrice: number;
    outOfStock?: boolean;
    onSale?: boolean;
  };
}

export function useWishlist() {
  const [user, setUser] = useState<User | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItemWithProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const initSession = async () => {
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

    initSession();
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const updateWishlistState = useCallback((items: WishlistItemWithProduct[]) => {
    setWishlistItems(items);
    setWishlistIds(new Set(items.map((item) => item.productId)));
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      updateWishlistState([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        supabaseId: user.id,
      });
      if (user.email) {
        params.append("email", user.email);
      }

      const res = await fetch(`/api/wishlist?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load wishlist");
      }

      const data = await res.json();
      if (Array.isArray(data.items)) {
        updateWishlistState(data.items);
      } else {
        updateWishlistState([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [updateWishlistState, user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(
    async (productId: number) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const isFavorite = wishlistIds.has(productId);
      setPendingProductId(productId);

      try {
        const res = await fetch("/api/wishlist", {
          method: isFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supabaseId: user.id,
            productId,
            email: user.email,
          }),
        });

        if (!res.ok) {
          throw new Error("Wishlist update failed");
        }

        if (isFavorite) {
          updateWishlistState(
            wishlistItems.filter((item) => item.productId !== productId)
          );
        } else {
          const item = await res.json();
          if (item?.productId) {
            updateWishlistState([...wishlistItems, item]);
          } else {
            fetchWishlist();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(
          isFavorite
            ? "Could not remove item from wishlist"
            : "Could not add item to wishlist"
        );
        throw err;
      } finally {
        setPendingProductId((prev) => (prev === productId ? null : prev));
      }
    },
    [fetchWishlist, updateWishlistState, user, wishlistIds, wishlistItems]
  );

  return {
    user,
    wishlistItems,
    wishlistIds,
    isWishlistLoading: isLoading,
    pendingProductId,
    toggleWishlist,
    refreshWishlist: fetchWishlist,
  };
}

