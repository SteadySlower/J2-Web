import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { Plus } from "lucide-react";

type PlusButtonProps = {
  tooltipText?: string;
  onClick: () => void;
};

export default function PlusButton({ tooltipText, onClick }: PlusButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className="h-12 w-12 rounded-full bg-red-400 hover:bg-red-400/90 shadow-lg"
    >
      <Plus className="h-5 w-5 text-white" />
    </Button>
  );

  if (tooltipText) {
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

  return button;
}
