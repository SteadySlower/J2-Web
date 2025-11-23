"use client";
import { cn } from "@/lib/utils";

type KanjiButtonProps = {
  showButton: boolean;
  onClick: () => void;
};

export default function KanjiButton({ showButton, onClick }: KanjiButtonProps) {
  return (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer",
        showButton ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "text-2xl font-extrabold text-gray-300 hover:text-red-400 transition-colors",
          showButton && "fade-in-up"
        )}
        style={
          showButton
            ? {
                animation: "fadeInUp 0.5s ease-out",
              }
            : undefined
        }
      >
        漢
      </span>
    </button>
  );
}
