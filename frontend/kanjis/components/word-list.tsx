import type { Word } from "@/frontend/core/types/word";
import WordItem from "./word-item";

type WordListProps = {
  words: Word[];
};

export default function WordList({ words }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-muted-foreground text-sm">연결된 단어가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto px-2 pr-4">
      {words.map((word) => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
}
