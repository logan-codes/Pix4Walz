"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LoginPopover from "@/components/LoginPopover";

interface Profile {
  id: number;
  supabaseId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image: string;
  } | null;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setAuthError("Unable to verify session. Please try again.");
        setLoading(false);
        return;
      }

      if (!session) {
        setAuthError("Please log in to view your profile.");
        setLoading(false);
        setShowLogin(true);
        return;
      }

      const params = new URLSearchParams({
        supabaseId: session.user.id,
      });

      if (session.user.email) {
        params.append("email", session.user.email);
      }

      const res = await fetch(`/api/profile?${params.toString()}`);

      if (!res.ok) {
        setAuthError("Failed to load profile.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProfile(data.profile);
      setOrders(data.orders || []);
      setFormState({
        name: data.profile?.name ?? "",
        phone: data.profile?.phone ?? "",
        address: data.profile?.address ?? "",
      });
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supabaseId: profile.supabaseId,
        ...formState,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to update profile");
      setSaving(false);
      return;
    }

    const updated = await res.json();
    setProfile(updated);
    toast.success("Profile updated!");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center text-gray-600">
        <p>{authError}</p>
          <div className="mt-6 flex justify-center">
            <LoginPopover
              open={showLogin}
              onOpen={() => setShowLogin(true)}
              onClose={() => setShowLogin(false)}
              showTrigger={true}
            />
          </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <section className="bg-white shadow-sm rounded-2xl p-6 border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm">
              Manage your personal information and contact details.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Name</label>
            <Input
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <Input
              value={formState.phone}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="+1 555 123 4567"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Shipping address
            </label>
            <textarea
              value={formState.address}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[100px]"
              placeholder="Street, City, ZIP, Country"
            />
          </div>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded-2xl p-6 border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Order history</h2>
          <p className="text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                      {order.status}
                    </span>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.product?.name ?? "Item"} × {item.quantity}
                      </span>
                      <span>₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
