// app/api/best-selling/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("Products")
      .select(
        "id,name,title,subtitle,image,originalPrice,salePrice,onSale,outOfStock,bestSelling"
      )
      .eq("bestSelling", true)
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("❌ Error fetching best-selling products:", error);
    return NextResponse.json(
      { error: "Failed to fetch best-selling products" },
      { status: 500 }
    );
  }
}
