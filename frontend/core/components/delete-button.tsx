"use client";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";

type DeleteButtonProps = {
  onClick: () => void;
};

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  const button = (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
      )}
      onClick={onClick}
    >
      <Trash2
        className={cn(
          "w-8 h-8 text-gray-300 hover:text-red-400 transition-colors"
        )}
      />
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>삭제하기</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
