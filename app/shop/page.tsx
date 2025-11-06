"use client";
import TagsSection from "@/components/Shop/TagsSection"
import ProductsSection from "@/components/Shop/ProductsSection"

export default function ShopPage() {
  return (
    <div className="flex gap-6 p-6">
      {/* Left Sidebar - Tags (Sticky) */}
      <aside className="shrink-0 sticky top-16 self-start">
        <TagsSection/>
      </aside>
      
      {/* Right Content - Products with internal scroll */}
      <main className="flex-1">
        <ProductsSection page="Store"/>
      </main>
    </div>
  )
}
