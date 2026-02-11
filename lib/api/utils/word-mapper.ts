import { DateTime } from "luxon";
import type { KanjiResponse } from "@/lib/api/types/kanji";
import type { Kanji } from "@/frontend/core/types/kanji";
import type { Word } from "@/frontend/core/types/word";
import type { WordResponse } from "@/lib/api/types/word";

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

export function mapWordResponseToWord(data: WordResponse): Word {
  return {
    id: data.id,
    bookId: data.book_id,
    japanese: data.japanese,
    meaning: data.meaning,
    pronunciation: data.pronunciation,
    status: data.status,
    createdAt: DateTime.fromISO(data.created_at),
    updatedAt: DateTime.fromISO(data.updated_at),
    kanjis: (data.kanjis || []).map(mapKanjiResponseToKanji),
  };
}
