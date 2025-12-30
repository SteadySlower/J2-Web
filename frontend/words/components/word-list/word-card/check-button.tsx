"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";

type CheckButtonProps = {
  tooptipText: string;
  onClick: () => void;
  className?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
};

export default function CheckButton({
  tooptipText,
  onClick,
  className,
  tooltipSide = "right",
}: CheckButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  const button = (
    <button
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <Check className={cn("w-8 h-8")} />
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        <p>{tooptipText}</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
