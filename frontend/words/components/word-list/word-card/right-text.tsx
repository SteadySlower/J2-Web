import { cn } from "@/lib/utils";
import { getTextSize } from "./utils";

type RightTextProps = {
  text: string;
  isRevealed: boolean;
  onReveal: () => void;
};

export default function RightText({
  text,
  isRevealed,
  onReveal,
}: RightTextProps) {
  return (
    <div className="flex-1 p-6">
      <div
        className={cn(
          getTextSize(text),
          "h-full text-black flex items-center relative cursor-pointer"
        )}
        onClick={onReveal}
      >
        <span
          className={cn("inline-block", isRevealed && "fade-in-up")}
          style={
            isRevealed
              ? {
                  animation: "fadeInUp 0.5s ease-out",
                }
              : undefined
          }
        >
          {text}
        </span>
        {!isRevealed && (
          <div className="absolute inset-0 bg-gray-300 rounded-md" />
        )}
      </div>
    </div>
  );
}
