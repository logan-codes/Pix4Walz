// app/shop/page.tsx
"use client";

import { Suspense } from "react";
import ShopPageWithParams from "./ShopPageWithParans";

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageWithParams />
    </Suspense>
  );
}
