import { cn } from "@/lib/utils";
import type { Kanji } from "@/lib/types/kanji";
import KanjiItem from "./kanji-item";

type KanjiListProps = {
  kanjis: Kanji[];
  isExpanded: boolean;
};

export default function KanjiList({ kanjis, isExpanded }: KanjiListProps) {
  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden relative">
        <div className="p-6 px-12">
          <div className="flex flex-wrap justify-center gap-2">
            {kanjis.map((kanji) => (
              <KanjiItem key={kanji.id} kanji={kanji} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
