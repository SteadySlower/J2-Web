import WordBookCard from "./card";
import type { WordBook } from "@/lib/types/word-books";

type WordBookListProps = {
  wordbooks: WordBook[];
};

export default function WordBookList({ wordbooks }: WordBookListProps) {
  if (wordbooks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 단어장을 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-4 p-4">
      {wordbooks.map((wordbook) => (
        <WordBookCard key={wordbook.id} wordbook={wordbook} />
      ))}
    </div>
  );
}
