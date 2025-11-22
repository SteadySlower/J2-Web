import WordCard from "./word-card/card";
import type { Word } from "@/lib/types/word";

type WordListProps = {
  words: Word[];
  shuffledWordIds: string[];
  isFilterGraduated: boolean;
};

export default function WordList({
  words,
  shuffledWordIds,
  isFilterGraduated,
}: WordListProps) {
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
    <div className="flex flex-col items-center gap-4 p-4">
      {displayWords.map((word) => (
        <WordCard key={word.id} word={word} />
      ))}
    </div>
  );
}
