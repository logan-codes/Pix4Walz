import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const TagsSection: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [isloading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching JSON
    const fetchTags = async () => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    setLoading(true);
    try {
      const response = await axios.get<string[]>(`${backend_url}/products/tags`);
      if (Array.isArray(response.data)) {
        setTags(response.data);
      } else {
        throw new Error("Response is not an array");
      }
    } catch (error) {
      toast("Error loading tags");
    } finally {
      setLoading(false);
    }
  };

  fetchTags();
  }, []);

  return (
    <div className="sticky top-16 z-10 w-64">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {isloading ? (
                // Skeleton Loader
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-16 rounded-full bg-gray-200 animate-pulse"
                  />
                ))
              ) : (
                tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => console.log(`Clicked tag: ${tag}`)}
                  >
                    {tag}
                  </Badge>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TagsSection