"use client";

import type { Kanji } from "@/frontend/core/types/kanji";
import { Card } from "@/frontend/core/components/ui/card";
import { cn } from "@/lib/utils";

type KanjiCardProps = {
  showFront: boolean;
  kanji: Kanji;
  isRevealed: boolean;
  onToggleReveal: (kanjiId: string) => void;
};

export default function KanjiCard({
  showFront,
  isRevealed,
  kanji,
  onToggleReveal,
}: KanjiCardProps) {
  const handleReveal = () => {
    onToggleReveal(kanji.id);
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleReveal}
    >
      <div className="flex flex-col items-center justify-center p-6 gap-4 relative">
        <div className="relative w-fit mx-auto">
          <div
            className={cn(
              "text-6xl font-bold text-center transition-opacity inline-block",
              showFront ? "" : isRevealed && "fade-in-up"
            )}
            style={
              !showFront && isRevealed
                ? {
                    animation: "fadeInUp 0.5s ease-out",
                  }
                : undefined
            }
          >
            {kanji.character}
          </div>
          {showFront === false && !isRevealed && (
            <div className="absolute -inset-1 bg-gray-300 rounded-md" />
          )}
        </div>
        <div className="relative w-full">
          <div
            className={cn(
              "text-lg text-center transition-opacity",
              showFront ? isRevealed && "fade-in-up" : ""
            )}
            style={
              showFront && isRevealed
                ? {
                    animation: "fadeInUp 0.5s ease-out",
                  }
                : undefined
            }
          >
            <div>{kanji.meaning}</div>
            {(kanji.onReading || kanji.kunReading) && (
              <div className="mt-2 text-sm text-muted-foreground space-y-1">
                {kanji.onReading && <div>음독: {kanji.onReading}</div>}
                {kanji.kunReading && <div>훈독: {kanji.kunReading}</div>}
              </div>
            )}
          </div>
          {showFront === true && !isRevealed && (
            <div className="absolute inset-0 bg-gray-300 rounded-md" />
          )}
        </div>
      </div>
    </Card>
  );
}
