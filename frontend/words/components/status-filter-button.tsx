import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { Check } from "lucide-react";

type StatusFilterButtonProps = {
  isFiltered: boolean;
  onClick: () => void;
};

export default function StatusFilterButton({
  isFiltered,
  onClick,
}: StatusFilterButtonProps) {
  const bgColor = isFiltered
    ? "bg-green-500 hover:bg-green-600"
    : "bg-gray-400 hover:bg-gray-500";

  const tooltipText = isFiltered ? "체크 필터 끄기" : "체크 필터 켜기";

  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={`h-12 w-12 rounded-full ${bgColor} shadow-lg`}
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
