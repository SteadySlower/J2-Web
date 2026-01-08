import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Kanji } from "@/frontend/core/types/kanji";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseToEmptyOkurigana(input: string): string {
  const kanjiRegex = /([\u4E00-\u9FFF]+)/g;
  return input.replace(kanjiRegex, (match) => {
    return `${match}{???}`;
  });
}

export function containsKanji(input: string): boolean {
  const kanjiRegex = /[\u4E00-\u9FFF]/;
  return kanjiRegex.test(input);
}

// 한자가 쓰인 단어에 따라 한자를 정렬
export function orderKanjisByAppearanceInJapanese(
  japanese: string,
  kanjis: Kanji[]
): Kanji[] {
  const kanjiRegex = /[\u4E00-\u9FFF]/g;
  const kanjisInJapanese = Array.from(
    new Set(japanese.match(kanjiRegex) || [])
  );

  const kanjiMap = new Map(kanjis.map((kanji) => [kanji.character, kanji]));

  const result: Kanji[] = [];

  for (const kanjiChar of kanjisInJapanese) {
    const kanji = kanjiMap.get(kanjiChar);
    if (kanji) {
      result.push(kanji);
    }
  }

  return result;
}
