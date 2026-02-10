import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";

type TodayWordsButtonProps = {
  onClick: () => void;
};

export default function TodayWordsButton({ onClick }: TodayWordsButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={
        "h-12 w-12 rounded-full shadow-lg transition-colors bg-green-700 hover:bg-green-500"
      }
    >
      <span className={"inline-block text-white text-xl font-bold"}>日</span>
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>오늘 단어 중 체크 안된 단어만 보기</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
