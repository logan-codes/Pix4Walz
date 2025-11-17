import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getOrCreateProfile } from "@/lib/profileServer";

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

    const supabase = getSupabaseServerClient();

    const finalProfile = await getOrCreateProfile(supabaseId, email);

    if (!finalProfile) {
      return NextResponse.json(
        {
          error: "Profile not found and email not provided to create it.",
        },
        { status: 500 }
      );
    }

    const { data: orders, error: ordersError } = await supabase
      .from("Order")
      .select("*, items:OrderItem(*, product:Products(*))")
      .eq("userId", finalProfile.id)
      .order("createdAt", { ascending: false });

    if (ordersError) throw ordersError;

    return NextResponse.json({ profile: finalProfile, orders: orders ?? [] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, name, phone, address } = body;

    if (!supabaseId) {
      return NextResponse.json(
        { error: "supabaseId is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("UserProfile")
      .update({ name, phone, address })
      .eq("supabaseId", supabaseId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

