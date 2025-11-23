import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckFilterButtonProps = {
  tooltipText: string;
  onClick: () => void;
  className?: string;
};

export default function CheckFilterButton({
  tooltipText,
  onClick,
  className,
}: CheckFilterButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(`h-12 w-12 rounded-full shadow-lg`, className)}
    >
      <Check className="h-5 w-5 text-white" />
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltipText}</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
