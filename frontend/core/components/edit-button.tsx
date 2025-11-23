"use client";

import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

type EditButtonProps = {
  showButton: boolean;
  hoverColor: "yellow" | "black";
  onClick: () => void;
};

export default function EditButton({
  showButton,
  hoverColor = "black",
  onClick,
}: EditButtonProps) {
  const hoverColorClass =
    hoverColor === "yellow" ? "hover:text-yellow-500" : "hover:text-black";
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer",
        showButton ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <Edit
        className={cn(
          "w-8 h-8 text-gray-300 transition-colors",
          showButton && `${hoverColorClass} transition-colors`
        )}
        style={
          showButton
            ? {
                animation: "fadeInUp 0.5s ease-out",
              }
            : undefined
        }
      />
    </button>
  );
}
