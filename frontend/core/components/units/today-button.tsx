import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TodayWordsButtonProps = {
  onClick: () => void;
  type: "word" | "kanji";
};

export default function TodayWordsButton({
  onClick,
  type,
}: TodayWordsButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "h-12 w-12 rounded-full shadow-lg transition-color",
        type === "word"
          ? "bg-green-700 hover:bg-green-500"
          : "bg-blue-700 hover:bg-blue-500",
      )}
    >
      <span className={"inline-block text-white text-xl font-bold"}>
        {type === "word" ? "日" : "漢"}
      </span>
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>
          {type === "word"
            ? "오늘 단어 중 체크 안된 단어만 보기"
            : "오늘 한자 중 체크 안된 한자만 보기"}
        </p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
