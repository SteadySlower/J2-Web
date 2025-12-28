"use client";

import KanjiCard from "./card";
import type { Kanji } from "@/frontend/core/types/kanji";

type KanjiListProps = {
  showFront: boolean;
  revealedMap: Record<string, boolean>;
  kanjis: Kanji[];
  shuffledKanjiIds: string[];
  isFilterGraduated: boolean;
  onToggleReveal: (kanjiId: string) => void;
};

export default function KanjiList({
  showFront,
  revealedMap,
  kanjis,
  shuffledKanjiIds,
  isFilterGraduated,
  onToggleReveal,
}: KanjiListProps) {
  // 필터링 적용
  const filteredKanjis = isFilterGraduated
    ? kanjis.filter((kanji) => kanji.status !== "learned")
    : kanjis;

  // 섞인 순서에 따라 정렬 (shuffledKanjiIds가 비어있으면 정렬하지 않음)
  const displayKanjis =
    shuffledKanjiIds.length === 0
      ? filteredKanjis
      : [...filteredKanjis].sort((a, b) => {
          const indexA = shuffledKanjiIds.indexOf(a.id);
          const indexB = shuffledKanjiIds.indexOf(b.id);
          // shuffledKanjiIds에 없는 경우 맨 뒤로
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

  if (displayKanjis.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 한자를 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 px-16">
      {displayKanjis.map((kanji) => (
        <KanjiCard
          key={kanji.id}
          showFront={showFront}
          isRevealed={revealedMap[kanji.id] || false}
          kanji={kanji}
          onToggleReveal={onToggleReveal}
        />
      ))}
    </div>
  );
}
