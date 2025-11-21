import { cn } from "@/lib/utils";
import { getTextSize } from "./utils";

type MeaningTextProps = {
  text: string;
  isRevealed: boolean;
  onReveal: () => void;
};

export default function MeaningText({
  text,
  isRevealed,
  onReveal,
}: MeaningTextProps) {
  return (
    <div className="flex-1 p-6">
      <p className={cn(getTextSize(text), "text-black")}>
        <span className="relative inline-block" onClick={onReveal}>
          <span className="relative z-10">{text}</span>
          <span
            className={cn(
              "absolute inset-0 bg-black transition-all duration-300 ease-in-out",
              isRevealed
                ? "clip-path-[inset(0_0_0_100%)]"
                : "clip-path-[inset(0_0_0_0%)]"
            )}
            style={{
              clipPath: isRevealed ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)",
            }}
          />
        </span>
      </p>
    </div>
  );
}
