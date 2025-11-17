import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "default";
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = Math.max(Number(pageParam) || 1, 1);
    const limit = Math.max(Number(limitParam) || 9, 1);

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

    const where: any = {
      name: {
        contains: query,
        mode: "insensitive",
      },
    };

    if (category) {
      where.category = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
      where,
      orderBy: orderBy && Object.keys(orderBy).length ? orderBy : undefined,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.products.count({ where }),
    ]);

    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    return NextResponse.json({
      items: products,
      totalCount,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
