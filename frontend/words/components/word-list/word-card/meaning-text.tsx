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
  // 텍스트 길이에 따라 skeleton 개수 계산 (대략 15자당 1개)
  const skeletonCount = Math.max(1, Math.ceil(text.length / 15));

  return (
    <div className="flex-1 p-6">
      <div className={cn(getTextSize(text), "text-black")}>
        {isRevealed ? (
          <span
            className="inline-block fade-in-up"
            style={{
              animation: "fadeInUp 0.5s ease-out",
            }}
            onClick={onReveal}
          >
            {text}
          </span>
        ) : (
          <div
            className="flex flex-col gap-1 justify-center"
            onClick={onReveal}
          >
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className="rounded-md bg-gray-300 h-[1em] w-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
