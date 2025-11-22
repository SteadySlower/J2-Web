"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";
import JapaneseText from "./japanese-text";
import GraduationButton from "./graduation-button";
import MeaningText from "./meaning-text";
import KanjiList from "./kanji-list";
import RevealButton from "./reveal-button";
import EditButton from "./edit-button";
import EditWordModal from "@/frontend/words/modals/edit-word";

type WordCardProps = {
  word: Word;
};

export default function WordCard({ word }: WordCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
            {isRevealed && (
              <EditButton onClick={() => setIsEditModalOpen(true)} />
            )}
          </div>
        </div>
        {word.kanjis.length > 0 && (
          <KanjiList kanjis={word.kanjis} isExpanded={isRevealed} />
        )}
      </Card>
      <EditWordModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        word={word}
      />
    </>
  );
}
