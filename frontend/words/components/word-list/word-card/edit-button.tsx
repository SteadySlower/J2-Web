"use client";

import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditButton() {
  return (
    <button className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform group">
      <Edit
        className={cn(
          "w-8 h-8 text-gray-300 group-hover:text-black transition-colors"
        )}
      />
    </button>
  );
}
