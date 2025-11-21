"use client";

import { Book, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type RevealButtonProps = {
  isRevealed: boolean;
  onReveal: () => void;
};

export default function RevealButton({
  isRevealed,
  onReveal,
}: RevealButtonProps) {
  const Icon = isRevealed ? BookOpen : Book;
  const iconClassName = isRevealed ? "text-black" : "text-gray-300";
  const tooltipText = isRevealed ? "의미 숨기기" : "의미 보기";

  return (
    <button
      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
      onClick={onReveal}
      title={tooltipText}
    >
      <Icon className={cn("w-8 h-8", iconClassName)} />
    </button>
  );
}
