import { DateTime } from "luxon";
import type { KanjiResponse } from "@/lib/api/types/kanji";
import type { Kanji } from "@/lib/types/kanji";
import type { Word } from "@/lib/types/word";

export function mapKanjiResponseToKanji(kanji: KanjiResponse): Kanji {
  return {
    id: kanji.id,
    character: kanji.character,
    meaning: kanji.meaning,
    onReading: kanji.on_reading,
    kunReading: kanji.kun_reading,
    status: kanji.status,
  };
}

type WordResponseLike = {
  id: string;
  japanese: string;
  meaning: string;
  pronunciation: string;
  status: "learning" | "learned";
  created_at: string;
  updated_at: string;
  kanjis: KanjiResponse[];
};

export function mapWordResponseToWord(data: WordResponseLike): Word {
  return {
    id: data.id,
    japanese: data.japanese,
    meaning: data.meaning,
    pronunciation: data.pronunciation,
    status: data.status,
    createdAt: DateTime.fromISO(data.created_at),
    updatedAt: DateTime.fromISO(data.updated_at),
    kanjis: data.kanjis.map(mapKanjiResponseToKanji),
  };
}
