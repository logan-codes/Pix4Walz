import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getProfileBySupabaseId, getOrCreateProfile } from "@/lib/profileServer";

const CART_TABLE = "CartItem";
const ORDER_TABLE = "Order";
const ORDER_ITEM_TABLE = "OrderItem";

function generateOrderNumber() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, email, paymentReference } = body;

    if (!supabaseId) {
      return NextResponse.json(
        { error: "supabaseId is required" },
        { status: 400 }
      );
    }

    const profile =
      (await getProfileBySupabaseId(supabaseId)) ||
      (await getOrCreateProfile(supabaseId, email));

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const supabase = getSupabaseServerClient();
    const { data: cartItems, error: cartError } = await supabase
      .from(CART_TABLE)
      .select("*, product:Products(id,name,salePrice)")
      .eq("userId", profile.id);

    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderItemsPayload = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: (item.product?.salePrice ?? 0) * item.quantity,
    }));

    const total = orderItemsPayload.reduce((sum, item) => sum + item.price, 0);

    const now = new Date().toISOString();

    const { data: order, error: orderError } = await supabase
      .from(ORDER_TABLE)
      .insert({
        orderNumber: generateOrderNumber(),
        status: "awaiting_payment_confirmation",
        paymentReference: paymentReference || null,
        total,
        userId: profile.id,
        updatedAt: now,
        createdAt: now,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItemsInsert = orderItemsPayload.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from(ORDER_ITEM_TABLE)
      .insert(orderItemsInsert);

    if (orderItemsError) throw orderItemsError;

    return NextResponse.json({
      success: true,
      order,
      message: "Please complete payment and send confirmation via WhatsApp.",
    });
  } catch (error) {
    console.error("Error checking out:", error);
    return NextResponse.json({ error: "Failed to checkout" }, { status: 500 });
  }
}

