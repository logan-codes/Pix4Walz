// src/components/HeroSection.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const HeroSection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="relative bg-gray-200 h-[400px] flex items-center justify-center">
      <div className="absolute left-4 bottom-4">
        <button onClick={()=>{router.push("/shop")}} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Shop Now
        </button>
      </div>
      <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
    </section>
  );
};

export default HeroSection;
