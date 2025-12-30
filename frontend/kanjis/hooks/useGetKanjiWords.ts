"use client";

import { useQuery } from "@tanstack/react-query";
import { getKanjiWords } from "@/lib/api/kanjis/get-kanji-words";

export function useGetKanjiWords(kanjiId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["kanjis", kanjiId, "words"],
    queryFn: () => getKanjiWords(kanjiId),
    enabled: enabled && !!kanjiId,
  });
}
