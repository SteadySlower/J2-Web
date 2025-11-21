"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";
import JapaneseText from "./japanese-text";
import GraduationButton from "./graduation-button";
import MeaningText from "./meaning-text";
import KanjiList from "./kanji-list";
import RevealButton from "./reveal-button";

type WordCardProps = {
  word: Word;
  wordbookId: string;
};

export default function WordCard({ word, wordbookId }: WordCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative flex flex-col">
      <div className="flex relative items-center">
        <JapaneseText text={word.japanese} />
        <MeaningText text={word.meaning} isRevealed={isRevealed} />
        <div className="flex flex-col gap-2 px-2">
          <RevealButton isRevealed={isRevealed} onReveal={handleReveal} />
          <GraduationButton
            wordId={word.id}
            status={word.status}
            wordbookId={wordbookId}
          />
        </div>
      </div>
      {word.kanjis.length > 0 && (
        <KanjiList kanjis={word.kanjis} isExpanded={isRevealed} />
      )}
    </Card>
  );
}
