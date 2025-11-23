"use client";

import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

type EditButtonProps = {
  onClick: () => void;
};

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer"
    >
      <Edit
        className={cn(
          "w-8 h-8 text-gray-300 hover:text-black transition-colors"
        )}
      />
    </button>
  );
}
