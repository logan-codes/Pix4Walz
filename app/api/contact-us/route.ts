// app/api/contact-us/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, number, message, timestamp } = body;

    if (!name || !number || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("UserMessage")
      .insert({
        name,
        number,
        message,
        timestamp: timestamp || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
