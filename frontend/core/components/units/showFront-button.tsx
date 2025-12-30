import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ShowFrontButtonProps = {
  showFront: boolean;
  tooltipText: string;
  buttonText: string;
  onClick: () => void;
  className?: string;
};

export default function ShowFrontButton({
  showFront,
  tooltipText,
  buttonText,
  onClick,
  className,
}: ShowFrontButtonProps) {
  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "h-12 w-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 transition-colors",
        className
      )}
    >
      <span
        key={showFront ? "front" : "back"}
        className={cn(
          "inline-block text-white text-xl font-bold",
          showFront && "fade-in-up"
        )}
        style={
          showFront
            ? {
                animation: "fadeInUp 0.5s ease-out",
              }
            : undefined
        }
      >
        {buttonText}
      </span>
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
