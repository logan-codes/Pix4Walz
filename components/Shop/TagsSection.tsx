"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface TagsSectionProps {
  selectedTag: string | null;
  onSelect: (tag: string | null) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({ selectedTag, onSelect }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const tagNames = data.map((item) => item.name);
          setTags(tagNames);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast("Error loading tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      onSelect(categoryParam);
    }
  }, [onSelect, searchParams]);

  const updateUrl = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("category", tag);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  };

  const handleClick = (tag: string | null) => {
    if (selectedTag === tag) {
      onSelect(null);
      updateUrl(null);
    } else {
      onSelect(tag);
      updateUrl(tag);
    }
  };

  return (
    <div className="sticky top-16 z-10 w-64">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-16 rounded-full bg-gray-200 animate-pulse"
                  />
                ))
              ) : (
                <>
                  <Badge
                    variant={selectedTag ? "secondary" : "default"}
                    className="cursor-pointer"
                    onClick={() => handleClick(null)}
                  >
                    All
                  </Badge>
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={() => handleClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TagsSection;