"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";
import JapaneseText from "./word-card/japanese-text";
import GraduationButton from "./word-card/graduation-button";
import MeaningText from "./word-card/meaning-text";
import KanjiList from "./word-card/kanji-list";
import RevealButton from "./word-card/reveal-button";
import EditButton from "../../../core/components/edit-button";

type WordCardProps = {
  word: Word;
  onEdit: (word: Word) => void;
};

export default function WordCard({ word, onEdit }: WordCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-stretch relative pr-6">
        <JapaneseText text={word.japanese} />
        <MeaningText
          text={word.meaning}
          isRevealed={isRevealed}
          onReveal={handleReveal}
        />
        <div className="flex flex-col gap-2 py-6 px-2 justify-start">
          <RevealButton isRevealed={isRevealed} onReveal={handleReveal} />
          <GraduationButton wordId={word.id} status={word.status} />
          {isRevealed && <EditButton onClick={() => onEdit(word)} />}
        </div>
      </div>
      {word.kanjis.length > 0 && (
        <KanjiList kanjis={word.kanjis} isExpanded={isRevealed} />
      )}
    </Card>
  );
}
