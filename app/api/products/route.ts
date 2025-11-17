import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const PRODUCTS_TABLE = "Products";
const CATEGORIES_TABLE = "Categories";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "default";
    const id = searchParams.get("id");
    const rawCategory = searchParams.get("category");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = Math.max(Number(pageParam) || 1, 1);
    const limit = Math.max(Number(limitParam) || 9, 1);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = getSupabaseServerClient();

    if (id) {
      const { data: product, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

      if (error) throw error;
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    let categoryId: number | undefined;
    const categoryName = rawCategory?.trim();

    if (categoryName) {
      const { data: category, error } = await supabase
        .from(CATEGORIES_TABLE)
        .select("id")
        .ilike("name", categoryName)
        .maybeSingle();

      if (error) throw error;
      if (!category) {
        return NextResponse.json({
          items: [],
          totalCount: 0,
          totalPages: 1,
          page,
          limit,
        });
      }
      categoryId = category.id;
    }

    let productsQuery = supabase.from(PRODUCTS_TABLE).select("*", { count: "exact" });

    if (query) {
      productsQuery = productsQuery.ilike("name", `%${query}%`);
    }

    if (categoryId) {
      productsQuery = productsQuery.eq("category_id", categoryId);
    }

    let orderColumn = "id";
    let ascending = true;
    if (sort === "price-low") {
      orderColumn = "salePrice";
      ascending = true;
    } else if (sort === "price-high") {
      orderColumn = "salePrice";
      ascending = false;
    } else if (sort === "name") {
      orderColumn = "name";
      ascending = true;
    }

    productsQuery = productsQuery.order(orderColumn, { ascending }).range(from, to);

    const { data, count, error } = await productsQuery;
    if (error) throw error;

    const totalCount = count ?? 0;
    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    return NextResponse.json({
      items: data ?? [],
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
