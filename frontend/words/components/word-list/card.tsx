"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";
import JapaneseText from "./word-card/japanese-text";
import StatusButton from "./word-card/status-button";
import MeaningText from "./word-card/meaning-text";
import EditButton from "../../../core/components/edit-button";
import KanjiButton from "./word-card/kanji-button";

type WordCardProps = {
  word: Word;
  onEdit: (word: Word) => void;
  onShowKanjis: (word: Word) => void;
};

export default function WordCard({
  word,
  onEdit,
  onShowKanjis,
}: WordCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <div className="flex pr-6 items-stretch">
        <JapaneseText text={word.japanese} />
        <MeaningText
          text={word.meaning}
          isRevealed={isRevealed}
          onReveal={handleReveal}
        />
        <div className="flex flex-col gap-2 py-6 px-2 justify-center">
          <StatusButton wordId={word.id} status={word.status} />
          <EditButton
            showButton={isRevealed}
            hoverColor="yellow"
            onClick={() => onEdit(word)}
          />
          <KanjiButton
            showButton={isRevealed && word.kanjis.length > 0}
            onClick={() => onShowKanjis(word)}
          />
        </div>
      </div>
    </Card>
  );
}
