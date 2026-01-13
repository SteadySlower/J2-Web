import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { Flag } from "lucide-react";

type ReviewDoneButtonProps = {
  onClick: () => void;
};

export default function ReviewDoneButton({ onClick }: ReviewDoneButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
    >
      <Flag className="h-5 w-5 text-white" />
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>복습 완료</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
