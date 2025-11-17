"use client";
import { useState } from "react";
import TagsSection from "@/components/Shop/TagsSection";
import ProductsSection from "@/components/Shop/ProductsSection";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
