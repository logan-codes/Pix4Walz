"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TagsSection from "@/components/Shop/TagsSection";
import ProductsSection from "@/components/Shop/ProductsSection";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  return (
    <div className="flex gap-6 p-6">
      <aside className="shrink-0 sticky top-16 self-start">
        <TagsSection
          selectedTag={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </aside>

      <main className="flex-1">
        <ProductsSection page="Store" category={selectedCategory} />
      </main>
    </div>
  );
}
