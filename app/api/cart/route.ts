import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getOrCreateProfile, getProfileBySupabaseId } from "@/lib/profileServer";

const TABLE = "CartItem";

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
      .from(TABLE)
      .select("*, product:Products(*)")
      .eq("userId", profile.id)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, email, productId, quantity = 1 } = body;

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
      .from(TABLE)
      .select("*, product:Products(*)")
      .match({ userId: profile.id, productId: Number(productId) })
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    if (existing) {
      const newQuantity = existing.quantity + Number(quantity || 1);
      const { data, error } = await supabase
        .from(TABLE)
        .update({ quantity: newQuantity })
        .eq("id", existing.id)
        .select("*, product:Products(*)")
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        userId: profile.id,
        productId: Number(productId),
        quantity: Number(quantity),
      })
      .select("*, product:Products(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, productId, quantity } = body;

    if (!supabaseId || !productId || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "supabaseId, productId, and quantity are required" },
        { status: 400 }
      );
    }

    const profile = await getProfileBySupabaseId(supabaseId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const supabase = getSupabaseServerClient();

    if (quantity <= 0) {
      await supabase
        .from(TABLE)
        .delete()
        .match({ userId: profile.id, productId: Number(productId) });
      return NextResponse.json({ success: true });
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update({ quantity })
      .match({ userId: profile.id, productId: Number(productId) })
      .select("*, product:Products(*)")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error modifying cart:", error);
    return NextResponse.json({ error: "Failed to modify cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, productId } = body;

    if (!supabaseId || !productId) {
      return NextResponse.json(
        { error: "supabaseId and productId are required" },
        { status: 400 }
      );
    }

    const profile = await getProfileBySupabaseId(supabaseId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from(TABLE)
      .delete()
      .match({ userId: profile.id, productId: Number(productId) });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

