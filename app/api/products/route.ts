import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "default";
    const id = searchParams.get("id");

    let orderBy: any = {};
    if (sort === "price-low") orderBy = { salePrice: "asc" };
    else if (sort === "price-high") orderBy = { salePrice: "desc" };
    else if (sort === "name") orderBy = { name: "asc" };

    if (id) {
      const product = await prisma.products.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: orderBy && Object.keys(orderBy).length ? orderBy : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
