"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TagsSection from "@/components/Shop/TagsSection";
import ProductsSection from "@/components/Shop/ProductsSection";

export default function ShopPageWithParams() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
      <aside className="w-full md:w-64 md:shrink-0 md:sticky md:top-16 md:self-start mb-4 md:mb-0">
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
