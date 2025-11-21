import WordCard from "./card";
import type { Word } from "@/lib/types/word";

type WordListProps = {
  words: Word[];
};

export default function WordList({ words }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 단어를 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 items-start">
      {words.map((word) => (
        <WordCard key={word.id} {...word} />
      ))}
    </div>
  );
}
