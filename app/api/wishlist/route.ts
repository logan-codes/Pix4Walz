import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getOrCreateProfile, getProfileBySupabaseId } from "@/lib/profileServer";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const supabaseId = searchParams.get("supabaseId");
    const email = searchParams.get("email");

    if (!supabaseId) {
      return NextResponse.json(
        { error: "supabaseId query parameter is required" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateProfile(supabaseId, email);

    if (!profile) {
      return NextResponse.json({ items: [] });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("WishlistItem")
      .select("*, product:Products(*)")
      .eq("userId", profile.id)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { supabaseId, productId, email } = await req.json();

    if (!supabaseId || !productId) {
      return NextResponse.json(
        { error: "supabaseId and productId are required" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateProfile(supabaseId, email);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const supabase = getSupabaseServerClient();

    const { data: existing, error: existingError } = await supabase
      .from("WishlistItem")
      .select("*, product:Products(*)")
      .match({ userId: profile.id, productId: Number(productId) })
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    if (existing) {
      return NextResponse.json(existing);
    }

    const { data: created, error } = await supabase
      .from("WishlistItem")
      .insert({
        userId: profile.id,
        productId: Number(productId),
      })
      .select("*, product:Products(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { supabaseId, productId } = await req.json();

    if (!supabaseId || !productId) {
      return NextResponse.json(
        { error: "supabaseId and productId are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const profile = await getProfileBySupabaseId(supabaseId);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("WishlistItem")
      .delete()
      .match({ userId: profile.id, productId: Number(productId) });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

