import type { Kanji } from "@/lib/types/kanji";

type KanjiItemProps = {
  kanji: Kanji;
};

export default function KanjiItem({ kanji }: KanjiItemProps) {
  return (
    <span className="text-4xl font-semibold border rounded px-2 py-1 flex flex-col items-center gap-2">
      {kanji.character}
      <span className="text-base text-muted-foreground mt-1">
        {kanji.meaning}
      </span>
    </span>
  );
}
