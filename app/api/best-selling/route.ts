// app/api/best-selling/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ✅ Fetch products marked as best-selling
    const bestSellingProducts = await prisma.products.findMany({
      where: { bestSelling: true },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        image: true,
        originalPrice: true,
        salePrice: true,
        onSale: true,
        outOfStock: true,
        bestSelling: true,
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(bestSellingProducts);
  } catch (error) {
    console.error("❌ Error fetching best-selling products:", error);
    return NextResponse.json(
      { error: "Failed to fetch best-selling products" },
      { status: 500 }
    );
  }
}
