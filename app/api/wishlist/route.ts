import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getOrCreateProfile } from "@/lib/profileServer";

async function getUserProfileId(supabaseId: string, email?: string | null) {
  const profile = await getOrCreateProfile(supabaseId, email);
  return profile?.id ?? null;
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const supabaseId = searchParams.get("supabaseId");
    const email = searchParams.get("email");
    if (!supabaseId) {
      return NextResponse.json({ items: [] });
    }

    const userProfileId = await getUserProfileId(supabaseId, email);
    if (!userProfileId) {
      return NextResponse.json({ items: [] });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("WishlistItem")
      .select("*, product:Products(*)")
      .eq("userId", userProfileId)
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, productId, email } = body;

    if (!supabaseId || !productId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userProfileId = await getUserProfileId(supabaseId, email);
    if (!userProfileId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data: inserted, error: insertError } = await supabase
      .from("WishlistItem")
      .insert({
        userId: userProfileId,
        productId: productId,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    const { data: item, error: fetchError } = await supabase
      .from("WishlistItem")
      .select("*, product:Products(*)")
      .eq("id", inserted.id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return NextResponse.json({ error: "Fetch after insert failed" }, { status: 500 });
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, productId, email } = body;

    if (!supabaseId || !productId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userProfileId = await getUserProfileId(supabaseId, email);
    if (!userProfileId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("WishlistItem")
      .delete()
      .eq("userId", userProfileId)
      .eq("productId", productId);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
