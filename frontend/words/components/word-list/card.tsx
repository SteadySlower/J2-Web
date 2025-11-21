"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";

export default function WordCard(word: Word) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer relative flex"
      onClick={handleClick}
    >
      <div className="flex-1 p-6 flex items-center justify-center border-r">
        <p className="text-2xl font-semibold">{word.japanese}</p>
      </div>
      <div className="flex-2 p-6">
        <p className="text-base">
          <span className="relative inline-block">
            <span className="relative z-10">{word.meaning}</span>
            <span
              className={`absolute inset-0 bg-black transition-all duration-300 ease-in-out ${
                isRevealed
                  ? "clip-path-[inset(0_0_0_100%)]"
                  : "clip-path-[inset(0_0_0_0%)]"
              }`}
              style={{
                clipPath: isRevealed ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)",
              }}
            />
          </span>
        </p>
      </div>
    </Card>
  );
}
