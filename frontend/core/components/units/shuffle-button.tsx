import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { Shuffle } from "lucide-react";

type ShuffleButtonProps = {
  onClick: () => void;
};

export default function ShuffleButton({ onClick }: ShuffleButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className="h-12 w-12 rounded-full bg-yellow-500 hover:bg-yellow-600 shadow-lg"
    >
      <Shuffle className="h-5 w-5 text-white" />
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>순서 랜덤</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
