"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  image: string;
}

const CategoriesSection: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Category[]>("/api/categories");
        setCategories(response.data);
      } catch (error) {
        toast("Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const skeletonCount = 4;

  return (
    <section className="py-12 px-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-700">Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden shadow-lg animate-pulse bg-gray-200 h-80"
              />
            ))
          : categories.map((cat, index) => (
              <div
                key={cat.id}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                </div>

                <div className="absolute top-6 left-6">
                  <h3 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">
                    {cat.name}
                  </h3>
                </div>

                <div className="absolute bottom-6 left-6">
                  <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                    Shop Now
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;
