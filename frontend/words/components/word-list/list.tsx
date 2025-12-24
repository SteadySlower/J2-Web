"use client";

import { useState } from "react";
import WordCard from "./card";
import EditWordModal from "@/frontend/words/modals/edit-word";
import type { Word } from "@/frontend/core/types/word";
import KanjisModal from "@/frontend/words/modals/kanjis";

type WordListProps = {
  showFront: boolean;
  revealedMap: Record<string, boolean>;
  words: Word[];
  shuffledWordIds: string[];
  isFilterGraduated: boolean;
  onToggleReveal: (wordId: string) => void;
};

export default function WordList({
  showFront,
  revealedMap,
  words,
  shuffledWordIds,
  isFilterGraduated,
  onToggleReveal,
}: WordListProps) {
  const [toEditWord, setToEditWord] = useState<Word | null>(null);
  const [wordToShowKanjis, setWordToShowKanjis] = useState<Word | null>(null);

  const handleEdit = (word: Word) => {
    setToEditWord(word);
  };

  const handleCloseModal = () => {
    setToEditWord(null);
  };

  const handleShowKanjis = (word: Word) => {
    setWordToShowKanjis(word);
  };

  const handleCloseKanjis = () => {
    setWordToShowKanjis(null);
  };

  // 필터링 적용
  const filteredWords = isFilterGraduated
    ? words.filter((word) => word.status !== "learned")
    : words;

  // 섞인 순서에 따라 정렬 (shuffledWordIds가 비어있으면 정렬하지 않음)
  const displayWords =
    shuffledWordIds.length === 0
      ? filteredWords
      : [...filteredWords].sort((a, b) => {
          const indexA = shuffledWordIds.indexOf(a.id);
          const indexB = shuffledWordIds.indexOf(b.id);
          // shuffledWordIds에 없는 경우 맨 뒤로
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

  if (displayWords.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 단어를 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-4 px-16">
        {displayWords.map((word) => (
          <WordCard
            key={word.id}
            showFront={showFront}
            isRevealed={revealedMap[word.id] || false}
            word={word}
            onEdit={handleEdit}
            onShowKanjis={handleShowKanjis}
            onToggleReveal={onToggleReveal}
          />
        ))}
      </div>
      {toEditWord && (
        <EditWordModal
          isOpen={toEditWord !== null}
          onClose={handleCloseModal}
          word={toEditWord}
        />
      )}
      {wordToShowKanjis && (
        <KanjisModal
          isOpen={wordToShowKanjis !== null}
          onClose={handleCloseKanjis}
          word={wordToShowKanjis}
        />
      )}
    </>
  );
}
