"use client";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";

type WordButtonProps = {
  showButton: boolean;
  onClick: () => void;
  kanji: string;
};

export default function WordButton({
  showButton,
  onClick,
  kanji,
}: WordButtonProps) {
  const button = (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer",
        showButton ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    >
      <List
        className={cn(
          "w-8 h-8 text-gray-300 hover:text-blue-400 transition-colors",
          showButton && "fade-in-up"
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>{kanji}가 쓰인 단어 보기</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
