import type { Kanji } from "@/lib/types/kanji";
import KanjiItem from "./kanji-item";

type KanjiListProps = {
  kanjis: Kanji[];
};

export default function KanjiList({ kanjis }: KanjiListProps) {
  return (
    <div className="p-6 px-12">
      <div className="flex flex-wrap justify-center gap-2">
        {kanjis.map((kanji) => (
          <KanjiItem key={kanji.id} kanji={kanji} />
        ))}
      </div>
    </div>
  );
}
