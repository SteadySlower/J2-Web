"use client";

import { useQuery } from "@tanstack/react-query";
import {
  searchDictionaryByKanji,
  type KanjiDictionaryResponse,
} from "@/lib/api/dictionary/search-kanji";

export function useSearchDictionaryByKanji(
  character: string,
  enabled: boolean
) {
  return useQuery<KanjiDictionaryResponse>({
    queryKey: ["dictionary", "kanji", character],
    queryFn: () => searchDictionaryByKanji(character),
    enabled: enabled && !!character,
  });
}
