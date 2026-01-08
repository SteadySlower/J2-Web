import type { Word } from "@/frontend/core/types/word";
import RubyText from "@/frontend/ruby/components/ruby-text";

type WordItemProps = {
  word: Word;
};

export default function WordItem({ word }: WordItemProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-1 p-3 border rounded-md">
      <RubyText
        rubyString={word.pronunciation}
        className="text-3xl font-semibold"
      />
      <div className="text-lg">{word.meaning}</div>
    </div>
  );
}
