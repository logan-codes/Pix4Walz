import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getOrCreateProfile } from "@/lib/profileServer";

//
// Helper: map Supabase Auth UUID to UserProfile integer id
//
async function getUserProfileId(supabaseId: string, email?: string | null) {
  const profile = await getOrCreateProfile(supabaseId, email);
  return profile?.id ?? null;
}

//
// 🚀 GET /api/cart
//
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const supabaseId = searchParams.get("supabaseId");
    const email = searchParams.get("email");

    if (!supabaseId) return NextResponse.json({ items: [] });

    const userId = await getUserProfileId(supabaseId, email);
    if (!userId) return NextResponse.json({ items: [] });

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("CartItem")
      .select("*, product:Products(*)")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ items: [] }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

//
// 🚀 POST /api/cart → add item
//
export async function POST(req: Request) {
  try {
    const { supabaseId, productId, quantity = 1, email } = await req.json();

    if (!supabaseId || !productId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userId = await getUserProfileId(supabaseId, email);
    if (!userId) return NextResponse.json({ error: "Profile not found" }, { status: 400 });

    const supabase = getSupabaseServerClient();
    // Check if cart item already exists
    const { data: existing } = await supabase
      .from("CartItem")
      .select("*")
      .eq("userId", userId)
      .eq("productId", productId)
      .maybeSingle();

    let insertedId: number;

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from("CartItem")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select("id")
        .single();

      if (error) throw error;
      insertedId = data.id;
    } else {
      // Insert new cart item
      const { data, error } = await supabase
        .from("CartItem")
        .insert({ userId, productId, quantity })
        .select("id")
        .single();

      if (error) throw error;
      insertedId = data.id;
    }

    // Return full joined item
    const { data: item, error: fetchError } = await supabase
      .from("CartItem")
      .select("*, product:Products(*)")
      .eq("id", insertedId)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(item);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

//
// 🚀 PUT /api/cart → update quantity
//
export async function PUT(req: Request) {
  try {
    const { supabaseId, productId, quantity, email } = await req.json();

    if (!supabaseId || !productId || quantity == null) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userId = await getUserProfileId(supabaseId, email);
    if (!userId) return NextResponse.json({ error: "Profile not found" }, { status: 400 });

    const supabase = getSupabaseServerClient();
    if (quantity <= 0) {
      // Remove item
      await supabase.from("CartItem").delete().eq("userId", userId).eq("productId", productId);
      return NextResponse.json({ success: true });
    }

    // Update quantity
    const { data: updated, error } = await supabase
      .from("CartItem")
      .update({ quantity })
      .eq("userId", userId)
      .eq("productId", productId)
      .select("id")
      .single();

    if (error) throw error;

    const { data: item, error: fetchError } = await supabase
      .from("CartItem")
      .select("*, product:Products(*)")
      .eq("id", updated.id)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(item);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

//
// 🚀 DELETE /api/cart → remove item
//
export async function DELETE(req: Request) {
  try {
    const { supabaseId, productId, email } = await req.json();

    if (!supabaseId || !productId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userId = await getUserProfileId(supabaseId, email);
    if (!userId) return NextResponse.json({ error: "Profile not found" }, { status: 400 });

    const supabase = getSupabaseServerClient();
    await supabase.from("CartItem").delete().eq("userId", userId).eq("productId", productId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}
