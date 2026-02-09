import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { XCircle } from "lucide-react";

type TodayWordsButtonProps = {
  onClick: () => void;
  isActive?: boolean;
};

export default function TodayWordsButton({
  onClick,
  isActive = false,
}: TodayWordsButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={`h-12 w-12 rounded-full shadow-lg transition-colors ${
        isActive
          ? "bg-red-600 hover:bg-red-700"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      <XCircle className="h-5 w-5 text-white" />
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>틀린 단어만 보기</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
