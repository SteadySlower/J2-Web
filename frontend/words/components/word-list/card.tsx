"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";

export default function WordCard(word: Word) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isKanjisExpanded, setIsKanjisExpanded] = useState(false);

  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  const handleKanjisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsKanjisExpanded(!isKanjisExpanded);
    if (isKanjisExpanded) {
      setIsRevealed(false);
    }
  };

  const getTextSize = (text: string) => {
    const length = text.length;
    if (length <= 8) return "text-4xl";
    if (length <= 14) return "text-3xl";
    if (length <= 20) return "text-2xl";
    return "text-xl";
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative flex flex-col">
      <div className="flex relative">
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className={`${getTextSize(word.japanese)} font-semibold`}>
            {word.japanese}
          </p>
        </div>
        <div className="flex-1 p-6">
          <p className={`${getTextSize(word.meaning)} text-black`}>
            <span className="relative inline-block" onClick={handleClick}>
              <span className="relative z-10">{word.meaning}</span>
              <span
                className={`absolute inset-0 bg-black transition-all duration-300 ease-in-out ${
                  isRevealed
                    ? "clip-path-[inset(0_0_0_100%)]"
                    : "clip-path-[inset(0_0_0_0%)]"
                }`}
                style={{
                  clipPath: isRevealed
                    ? "inset(0 0 0 100%)"
                    : "inset(0 0 0 0%)",
                }}
              />
            </span>
          </p>
        </div>
        {word.kanjis.length > 0 && isRevealed && !isKanjisExpanded && (
          <button
            className="absolute bottom-1 right-1 w-6 h-6 bg-black text-white flex items-center justify-center text-sm rounded-full z-10"
            onClick={handleKanjisClick}
          >
            漢
          </button>
        )}
      </div>
      {word.kanjis.length > 0 && (
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isKanjisExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden relative">
            {isKanjisExpanded && (
              <button
                className="absolute bottom-1 right-1 w-6 h-6 bg-white text-black border border-black flex items-center justify-center text-sm rounded-full z-10"
                onClick={handleKanjisClick}
              >
                漢
              </button>
            )}
            <div className="p-6 px-12">
              <div className="flex flex-wrap justify-center gap-2">
                {word.kanjis.map((kanji) => (
                  <span
                    key={kanji.id}
                    className="text-4xl font-semibold border rounded px-2 py-1 flex flex-col items-center gap-2"
                  >
                    {kanji.character}
                    <span className="text-base text-muted-foreground mt-1">
                      {kanji.meaning}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
