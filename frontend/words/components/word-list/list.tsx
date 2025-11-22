import WordCard from "./word-card/card";
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
    <div className="flex flex-col items-center gap-4 p-4">
      {words.map((word) => (
        <div key={word.id} className="w-full max-w-[800px]">
          <WordCard word={word} />
        </div>
      ))}
    </div>
  );
}
