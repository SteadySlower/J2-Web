"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";
import JapaneseText from "./japanese-text";
import GraduationButton from "./graduation-button";
import MeaningText from "./meaning-text";
import KanjiList from "./kanji-list";

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
        <GraduationButton
          wordId={word.id}
          status={word.status}
          wordbookId={wordbookId}
        />
        <MeaningText
          text={word.meaning}
          isRevealed={isRevealed}
          onReveal={handleReveal}
        />
      </div>
      {word.kanjis.length > 0 && (
        <KanjiList kanjis={word.kanjis} isExpanded={isRevealed} />
      )}
    </Card>
  );
}
