"use client";

import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";

type EditButtonProps = {
  onClick: () => void;
  className?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
};

export default function EditButton({
  onClick,
  className,
  tooltipSide = "right",
}: EditButtonProps) {
  const button = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer text-gray-300",
        className
      )}
    >
      <Edit className="w-8 h-8" />
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        <p>수정 하기</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
