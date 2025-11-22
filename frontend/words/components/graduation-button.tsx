import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { GraduationCap } from "lucide-react";

type GraduationButtonProps = {
  isFiltered: boolean;
  onClick: () => void;
};

export default function GraduationButton({
  isFiltered,
  onClick,
}: GraduationButtonProps) {
  const bgColor = isFiltered
    ? "bg-green-500 hover:bg-green-600"
    : "bg-gray-400 hover:bg-gray-500";

  const tooltipText = isFiltered ? "졸업 필터 끄기" : "졸업 필터 켜기";

  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={`h-12 w-12 rounded-full ${bgColor} shadow-lg`}
    >
      <GraduationCap className="h-5 w-5 text-white" />
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
